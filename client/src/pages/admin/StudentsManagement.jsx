// import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useToast } from '../../components/ui/toast';
import { getApiErrorMessage } from '../../services/api';
import { getDepartments } from '../../services/departmentService';
import { createStudent, deleteStudent, listStudents } from '../../services/studentService';

// Mock data for students
const SAMPLE_DEPARTMENTS = ['CSE', 'ECE', 'ME', 'IT'];
const mockStudents = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  rollNo: `CS21B${String(i + 1).padStart(3, '0')}`,
  semester: Math.ceil(Math.random() * 8),
  department: SAMPLE_DEPARTMENTS[Math.floor(Math.random() * SAMPLE_DEPARTMENTS.length)],
  email: `student${i + 1}@iet.davv.ac.in`,
  attendance: Math.floor(Math.random() * (100 - 75) + 75)
}));

export default function StudentsManagement() {
  const [isLoading, setIsLoading] = useState(true);
  // simplified add flow uses prompts
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { show } = useToast();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const data = await listStudents();
        if (!isActive) return;

        const mapped = data.map((student) => ({
          id: student.id,
          name: student.name,
          rollNo: student.roll_number,
          semester: student.semester,
          department: student.department_code || student.department_name,
          email: student.email,
          attendance: student.attendance_percentage || 0
        }));

        setStudents(mapped.length ? mapped : mockStudents);
      } catch (error) {
        if (isActive) {
          show({
            title: 'Unable to load students',
            description: getApiErrorMessage(error, 'Please try again later.'),
            type: 'error'
          });
          setStudents(mockStudents);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadStudents();

    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        if (!isActive) return;
        setDepartments(data.map(d => d.name || d.department_name || d.code || d.id));
      } catch (error) {
        // ignore departments error for now
      }
    };

    loadDepartments();

    return () => {
      isActive = false;
    };
  }, [show]);

  const departmentOptions = useMemo(() => {
    if (departments && departments.length) return departments;
    const values = students.map((student) => student.department).filter(Boolean);
    return Array.from(new Set(values));
  }, [students, departments]);

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (value) => value?.toLowerCase().includes(query);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = !query || [student.name, student.rollNo, student.email].some(matchesQuery);
    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = (formData) => {
    (async () => {
      try {
        const payload = {
          name: formData.name,
          enrollment_no: formData.enrollment_no,
          roll_number: formData.roll_number,
          department_id: Number(formData.department_id),
          semester: Number(formData.semester),
          section: formData.section,
          admission_year: Number(formData.admission_year),
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: 'TempPass@123'
        };

        const created = await createStudent(payload);
        const mapped = {
          id: created.id,
          name: created.name,
          rollNo: created.roll_number,
          semester: created.semester,
          department: created.department_name || created.department_code || formData.department_id,
          email: created.email,
          attendance: 100
        };

        setStudents(prev => [...prev, mapped]);
        setShowAddModal(false);
        show({ title: 'Success', description: 'Student created', type: 'success' });
      } catch (error) {
        show({ title: 'Error', description: getApiErrorMessage(error), type: 'error' });
      }
    })();
  };

  const handleDeleteStudent = async (row) => {
    if (!window.confirm(`Delete student ${row.name}?`)) return;
    try {
      await deleteStudent(row.id);
      setStudents(prev => prev.filter(s => s.id !== row.id));
      show({ title: 'Deleted', description: 'Student removed', type: 'success' });
    } catch (error) {
      show({ title: 'Error', description: getApiErrorMessage(error), type: 'error' });
    }
  };

  return (
    <DashboardLayout userRole="admin" isLoading={isLoading}>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Students Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage student records and information
            </p>
          </div>
          <button
            onClick={async () => {
              const name = window.prompt('Student name');
              if (!name) return;
              const email = window.prompt('Student email');
              const dept = departmentOptions[0] || 'CSE';
              const formData = { name, email, enrollment_no: `ENR${Date.now()%100000}`, roll_number: `R${Date.now()%10000}`, department_id: dept, semester: 1 };
              await handleAddStudent(formData);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:scale-102 transition-transform"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
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
          </div>

          {/* Students Table */}
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Roll No</th>
                    <th className="px-4 py-2 text-left">Semester</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Attendance</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.rollNo}</td>
                      <td className="px-4 py-2">{s.semester}</td>
                      <td className="px-4 py-2">{s.department}</td>
                      <td className="px-4 py-2">{s.email}</td>
                      <td className="px-4 py-2">{s.attendance}%</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDeleteStudent(s)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No students found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Student uses prompt-based flow (no modal) */}
    </DashboardLayout>
  );
}
