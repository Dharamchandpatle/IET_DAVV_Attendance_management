import { motion } from 'framer-motion';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

const mockData = {
  students: [
    { id: 1, name: 'John Doe', roll: 'CS21B001', branch: 'CSE' },
    { id: 2, name: 'Jane Smith', roll: 'CS21B002', branch: 'CSE' },
  ],
  faculty: [
    { id: 1, name: 'Dr. Sharma', department: 'CSE', designation: 'Professor' },
    { id: 2, name: 'Dr. Kumar', department: 'CSE', designation: 'Associate Professor' },
  ],
  courses: [
    { id: 1, code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Sharma' },
    { id: 2, code: 'CS102', name: 'Data Structures', instructor: 'Dr. Kumar' },
  ],
};

export function DataTable({ type }) {
  const [items, setItems] = useState(mockData[type]);
  const [editingId, setEditingId] = useState(null);

  const columns = {
    students: ['Roll No', 'Name', 'Branch'],
    faculty: ['Name', 'Department', 'Designation'],
    courses: ['Code', 'Name', 'Instructor'],
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New
        </motion.button>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-hidden rounded-xl border dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">{type}</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Add {type.slice(0, -1)}
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                {columns[type].map((col) => (
                  <th key={col} className="text-left py-3 px-4">{col}</th>
                ))}
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b dark:border-gray-700"
                >
                  {Object.keys(item).slice(1).map((key) => (
                    <td key={key} className="py-3 px-4">{item[key]}</td>
                  ))}
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
