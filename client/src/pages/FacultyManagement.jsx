import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Filter, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from '../components/admin/DataTable';
import { DynamicFormModal } from '../components/admin/DynamicFormModal';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useToast } from '../components/ui/toast';

// Mock faculty data
const mockFaculty = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Dr. Faculty ${i + 1}`,
  facultyId: `FAC${String(i + 1).padStart(3, '0')}`,
  department: ['CSE', 'IT', 'ECE'][Math.floor(Math.random() * 3)],
  designation: ['Professor', 'Associate Professor', 'Assistant Professor'][Math.floor(Math.random() * 3)],
  email: `faculty${i + 1}@iet.davv.ac.in`,
  courses: Math.floor(Math.random() * 3) + 1,
  joiningYear: 2020 + Math.floor(Math.random() * 4)
}));

export function FacultyManagement() {
  const containerRef = useRef(null);
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
    const ctx = gsap.context(() => {
      gsap.from('.faculty-card', {
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

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.facultyId.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.email.toLowerCase().includes(filters.search.toLowerCase());
    
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
      <div className="space-y-6" ref={containerRef}>
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

        <motion.div
          className="faculty-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
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
                  <option value="CSE">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ECE">Electronics & Communication</option>
                </select>
                <select
                  value={filters.designation}
                  onChange={(e) => setFilters(prev => ({ ...prev, designation: e.target.value }))}
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="all">All Designations</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
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
