// import { motion } from 'framer-motion';
import { Filter, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useToast } from '../../components/ui/toast';
import { getApiErrorMessage } from '../../services/api';
import { getDepartments } from '../../services/departmentService';
import { createFaculty, deleteFaculty, listFaculty } from '../../services/facultyService';

// Mock faculty data
const SAMPLE_DEPARTMENTS = ['CSE', 'ECE', 'ME', 'IT'];
const SAMPLE_DESIGNATIONS = ['Assistant Professor', 'Associate Professor', 'Professor'];
const mockFaculty = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Dr. Faculty ${i + 1}`,
  facultyId: `FAC${String(i + 1).padStart(3, '0')}`,
  department: SAMPLE_DEPARTMENTS[Math.floor(Math.random() * SAMPLE_DEPARTMENTS.length)],
  designation: SAMPLE_DESIGNATIONS[Math.floor(Math.random() * SAMPLE_DESIGNATIONS.length)],
  email: `faculty${i + 1}@iet.davv.ac.in`,
  courses: Math.floor(Math.random() * 3) + 1,
  joiningYear: 2020 + Math.floor(Math.random() * 4)
}));

export default function FacultyManagement() {
  const [isLoading, setIsLoading] = useState(true);
  // simplified add flow: prompt-based
  const [showFilters, setShowFilters] = useState(false);
  const [faculty, setFaculty] = useState(mockFaculty);
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    designation: 'all'
  });
  const { show } = useToast();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadFaculty = async () => {
      try {
        setIsLoading(true);
        const data = await listFaculty();
        if (!isActive) return;

        const mapped = data.map((member) => ({
          id: member.id,
          name: member.name,
          facultyId: member.faculty_code,
          department: member.department_code || member.department_name,
          designation: member.designation,
          email: member.email,
          courses: member.courses || 0
        }));

        setFaculty(mapped.length ? mapped : mockFaculty);
      } catch (error) {
        if (isActive) {
          show({
            title: 'Unable to load faculty',
            description: getApiErrorMessage(error, 'Please try again later.'),
            type: 'error'
          });
          setFaculty(mockFaculty);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadFaculty();

    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        if (!isActive) return;
        setDepartments(data.map(d => d.name || d.department_name || d.code || d.id));
      } catch (e) {
        // ignore
      }
    };

    loadDepartments();

    return () => {
      isActive = false;
    };
  }, [show]);

  const departmentOptions = useMemo(() => {
    if (departments && departments.length) return departments;
    const values = faculty.map((member) => member.department).filter(Boolean);
    return Array.from(new Set(values));
  }, [faculty, departments]);

  const designationOptions = useMemo(() => {
    const values = faculty.map((member) => member.designation).filter(Boolean);
    return Array.from(new Set(values));
  }, [faculty]);

  const query = filters.search.trim().toLowerCase();
  const matchesQuery = (value) => value?.toLowerCase().includes(query);

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch = 
      !query || [member.name, member.facultyId, member.email].some(matchesQuery);
    
    const matchesDepartment = filters.department === 'all' || member.department === filters.department;
    const matchesDesignation = filters.designation === 'all' || member.designation === filters.designation;
    
    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  const handleAddFaculty = (formData) => {
    (async () => {
      try {
        const payload = {
          name: formData.name,
          faculty_code: formData.faculty_code || formData.facultyId,
          department_id: Number(formData.department_id),
          designation: formData.designation,
          email: formData.email,
          phone: formData.phone,
          joining_year: Number(formData.joiningYear || new Date().getFullYear()),
          password: 'TempPass@123'
        };

        const created = await createFaculty(payload);
        const mapped = {
          id: created.id,
          name: created.name,
          facultyId: created.faculty_code || formData.faculty_code,
          department: created.department_name || formData.department_id,
          designation: created.designation,
          email: created.email,
          courses: created.courses || 0
        };

        setFaculty(prev => [...prev, mapped]);
        setShowAddModal(false);
        show({ title: 'Success', description: 'Faculty created', type: 'success' });
      } catch (error) {
        show({ title: 'Error', description: getApiErrorMessage(error), type: 'error' });
      }
    })();
  };

  const handleDeleteFaculty = async (row) => {
    if (!window.confirm(`Delete faculty ${row.name}?`)) return;
    try {
      await deleteFaculty(row.id);
      setFaculty(prev => prev.filter(f => f.id !== row.id));
      show({ title: 'Deleted', description: 'Faculty removed', type: 'success' });
    } catch (error) {
      show({ title: 'Error', description: getApiErrorMessage(error), type: 'error' });
    }
  };

  return (
    <DashboardLayout userRole="admin" isLoading={isLoading}>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Faculty Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage faculty records and information
            </p>
          </div>
          <button
            onClick={async () => {
              const name = window.prompt('Faculty name');
              if (!name) return;
              const email = window.prompt('Faculty email');
              const dept = departmentOptions[0] || 'CSE';
              const formData = { name, email, faculty_code: `FAC${Date.now() % 10000}`, department_id: dept, designation: 'Assistant Professor' };
              await handleAddFaculty(formData);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:scale-102 transition-transform"
          >
            <Plus className="w-5 h-5" />
            Add Faculty
          </button>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search faculty..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border rounded-lg dark:border-gray-700 flex items-center gap-2 hover:scale-102 transition-transform"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-4 pt-4 border-t dark:border-gray-700 transition-all">
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="all">All Departments</option>
                  {departmentOptions.length
                    ? departmentOptions.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))
                    : DEPARTMENTS.map((department) => (
                        <option key={department.value} value={department.value}>
                          {department.label}
                        </option>
                      ))}
                </select>
                <select
                  value={filters.designation}
                  onChange={(e) => setFilters(prev => ({ ...prev, designation: e.target.value }))}
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="all">All Designations</option>
                  {designationOptions.length
                    ? designationOptions.map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))
                    : DESIGNATIONS.map((designation) => (
                        <option key={designation.value} value={designation.value}>
                          {designation.label}
                        </option>
                      ))}
                </select>
              </div>
            )}
          </div>

          {/* Faculty Table */}
          {filteredFaculty.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Faculty ID</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Designation</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Courses</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{f.name}</td>
                      <td className="px-4 py-2">{f.facultyId}</td>
                      <td className="px-4 py-2">{f.department}</td>
                      <td className="px-4 py-2">{f.designation}</td>
                      <td className="px-4 py-2">{f.email}</td>
                      <td className="px-4 py-2">{f.courses}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDeleteFaculty(f)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No faculty members found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Faculty uses prompt-based flow (no modal) */}
    </DashboardLayout>
  );
}
