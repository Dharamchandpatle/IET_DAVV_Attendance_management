import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from '../components/admin/DataTable';
import { DynamicFormModal } from '../components/admin/DynamicFormModal';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useToast } from '../components/ui/toast';

// Mock data for students
const mockStudents = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  rollNo: `CS21B${String(i + 1).padStart(3, '0')}`,
  semester: Math.ceil(Math.random() * 8),
  department: ['CSE', 'IT', 'ECE'][Math.floor(Math.random() * 3)],
  email: `student${i + 1}@iet.davv.ac.in`,
  attendance: Math.floor(Math.random() * (100 - 75) + 75)
}));

export function StudentsManagement() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { show } = useToast();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.students-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);

    return () => ctx.revert();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = (formData) => {
    const newStudent = {
      id: students.length + 1,
      ...formData,
      attendance: 100 // New students start with 100% attendance
    };
    setStudents(prev => [...prev, newStudent]);
    setShowAddModal(false);
    show({
      title: "Success",
      description: "Student added successfully",
      type: "success"
    });
  };

  return (
    <DashboardLayout userRole="admin" isLoading={isLoading}>
      <div className="space-y-6" ref={containerRef}>
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Students Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage student records and information
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </motion.button>
        </header>

        <motion.div
          className="students-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
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
              <option value="CSE">Computer Science</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics & Communication</option>
            </select>
          </div>

          {/* Students Table */}
          {filteredStudents.length > 0 ? (
            <DataTable type="students" data={filteredStudents} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No students found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <DynamicFormModal
          type="add-student"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStudent}
        />
      )}
    </DashboardLayout>
  );
}
