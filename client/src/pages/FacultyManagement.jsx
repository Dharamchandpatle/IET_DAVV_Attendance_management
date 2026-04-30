import { motion } from 'framer-motion';
import { Filter, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DEPARTMENTS, DESIGNATIONS } from '../components/admin/adminConstants';
import { DataTable } from '../components/admin/DataTable';
import { DynamicFormModal } from '../components/admin/DynamicFormModal';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../services/api';
import { listFaculty } from '../services/facultyService';

// Mock faculty data
const departmentValues = DEPARTMENTS.map((department) => department.value);
const designationValues = DESIGNATIONS.map((designation) => designation.value);
const mockFaculty = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Dr. Faculty ${i + 1}`,
  facultyId: `FAC${String(i + 1).padStart(3, '0')}`,
  department: departmentValues[Math.floor(Math.random() * departmentValues.length)],
  designation: designationValues[Math.floor(Math.random() * designationValues.length)],
  email: `faculty${i + 1}@iet.davv.ac.in`,
  courses: Math.floor(Math.random() * 3) + 1,
  joiningYear: 2020 + Math.floor(Math.random() * 4)
}));

export function FacultyManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [faculty, setFaculty] = useState(mockFaculty);
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    designation: 'all'
  });
  const { show } = useToast();

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

    return () => {
      isActive = false;
    };
  }, [show]);

  const departmentOptions = useMemo(() => {
    const values = faculty.map((member) => member.department).filter(Boolean);
    return Array.from(new Set(values));
  }, [faculty]);

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
    const newFaculty = {
      id: faculty.length + 1,
      ...formData,
      courses: 0,
      joiningYear: new Date().getFullYear()
    };
    setFaculty(prev => [...prev, newFaculty]);
    setShowAddModal(false);
    show({
      title: "Success",
      description: "Faculty member added successfully",
      type: "success"
    });
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Add Faculty
          </motion.button>
        </header>

        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border rounded-lg dark:border-gray-700 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </motion.button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-4 pt-4 border-t dark:border-gray-700"
              >
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
              </motion.div>
            )}
          </div>

          {/* Faculty Table */}
          {filteredFaculty.length > 0 ? (
            <DataTable type="faculty" data={filteredFaculty} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No faculty members found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Faculty Modal */}
      {showAddModal && (
        <DynamicFormModal
          type="add-faculty"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddFaculty}
        />
      )}
    </DashboardLayout>
  );
}
