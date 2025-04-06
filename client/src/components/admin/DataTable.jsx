import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function DataTable({ type = 'students', data = [] }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const columns = {
    students: [
      { key: 'name', label: 'Name' },
      { key: 'rollNo', label: 'Roll No.' },
      { key: 'department', label: 'Department' },
      { key: 'semester', label: 'Semester' },
      { key: 'email', label: 'Email' },
      { key: 'attendance', label: 'Attendance' }
    ],
    faculty: [
      { key: 'name', label: 'Name' },
      { key: 'facultyId', label: 'Faculty ID' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designation' },
      { key: 'email', label: 'Email' },
      { key: 'courses', label: 'Courses' }
    ]
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-gray-700">
            {columns[type].map(({ key, label }) => (
              <th 
                key={key}
                onClick={() => handleSort(key)}
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
              >
                <div className="flex items-center gap-2">
                  {label}
                  <div className="flex flex-col">
                    <ChevronUp 
                      className={`w-3 h-3 ${
                        sortConfig.key === key && sortConfig.direction === 'asc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <ChevronDown 
                      className={`w-3 h-3 -mt-1 ${
                        sortConfig.key === key && sortConfig.direction === 'desc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedData.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              {columns[type].map(({ key }) => (
                <td key={key} className="px-4 py-3 text-sm">
                  {key === 'attendance' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            row[key] >= 75 ? 'bg-green-500' :
                            row[key] >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${row[key]}%` }}
                        />
                      </div>
                      <span>{row[key]}%</span>
                    </div>
                  ) : key === 'courses' ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {row[key]} {row[key] === 1 ? 'course' : 'courses'}
                    </span>
                  ) : (
                    row[key]
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {}} // Will be implemented later
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {}} // Will be implemented later
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
