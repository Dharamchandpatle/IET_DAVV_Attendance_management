// import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useToast } from '../../components/ui/toast';
import { getApiErrorMessage } from '../../services/api';
import { getDepartments } from '../../services/departmentService';
import { createStudent, deleteStudent, listStudents } from '../../services/studentService';

const fallbackDepartments = [
  { id: 1, name: 'Computer Engineering', code: 'CE' },
  { id: 2, name: 'Information Technology', code: 'IT' },
  { id: 3, name: 'Electronics Engineering', code: 'EC' },
  { id: 4, name: 'Mechanical Engineering', code: 'ME' }
];

export default function StudentsManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { show } = useToast();
  const [departments, setDepartments] = useState(fallbackDepartments);

  useEffect(() => {
    let isActive = true;

    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const data = await listStudents();
        if (!isActive) return;

        const mapped = (data || []).map((student) => ({
          id: student.id,
          name: student.name,
          rollNo: student.roll_number,
          semester: student.semester,
          department: student.department_name || student.department_code || 'Department',
          departmentId: student.department_id || null,
          email: student.email,
          attendance: student.attendance_percentage || 0
        }));

        setStudents(mapped);
      } catch (error) {
        if (isActive) {
          show({
            title: 'Unable to load students',
            description: getApiErrorMessage(error, 'Please try again later.'),
            type: 'error'
          });
          setStudents([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        if (!isActive) return;

        const nextDepartments = (data || []).map((department) => ({
          id: department.id,
          name: department.name || department.department_name || department.code || 'Department',
          code: department.code || department.department_code || ''
        }));

        setDepartments(nextDepartments.length ? nextDepartments : fallbackDepartments);
      } catch (error) {
        setDepartments(fallbackDepartments);
      }
    };

    loadStudents();
    loadDepartments();

    return () => {
      isActive = false;
    };
  }, [show]);

  const departmentOptions = useMemo(() => {
    if (departments && departments.length) return departments;
    return fallbackDepartments;
  }, [departments]);

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (value) => value?.toLowerCase().includes(query);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = !query || [student.name, student.rollNo, student.email].some(matchesQuery);
    const matchesDepartment = selectedDepartment === 'all' || student.departmentId === Number(selectedDepartment) || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = async (formData) => {
    try {
      const department = departmentOptions.find((item) => item.id === Number(formData.department_id)) || departmentOptions[0] || fallbackDepartments[0];
      const payload = {
        name: formData.name,
        enrollment_no: formData.enrollment_no,
        roll_number: formData.roll_number,
        department_id: Number(department?.id || formData.department_id),
        semester: Number(formData.semester || 1),
        section: formData.section || 'A',
        admission_year: Number(formData.admission_year || new Date().getFullYear()),
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        password: 'TempPass@123'
      };

      const created = await createStudent(payload);
      const mapped = {
        id: created.id,
        name: created.name,
        rollNo: created.roll_number,
        semester: created.semester,
        department: department?.name || created.department_name || 'Department',
        departmentId: department?.id || created.department_id || null,
        email: created.email,
        attendance: 100
      };

      setStudents(prev => [...prev, mapped]);
      show({ title: 'Success', description: 'Student created', type: 'success' });
    } catch (error) {
      show({ title: 'Error', description: getApiErrorMessage(error), type: 'error' });
    }
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
              const departmentId = departmentOptions[0]?.id || 1;
              const formData = {
                name,
                email,
                enrollment_no: `ENR${Date.now() % 100000}`,
                roll_number: `R${Date.now() % 10000}`,
                department_id: departmentId,
                semester: 1,
                section: 'A',
                admission_year: new Date().getFullYear(),
                phone: '',
                address: ''
              };
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
              {departmentOptions.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
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
