import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Home, Moon, Settings, Sun, User, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { navigateWithTransition } from '../../utils/navigation';

const roleBasedNavItems = {
  admin: [
    { title: 'Dashboard', path: '/admin', icon: Home, end: true },
    { title: 'Students', path: '/admin/students', icon: Users },
    { title: 'Faculty', path: '/admin/faculty', icon: Users },
    { title: 'Exams', path: '/exams', icon: FileText },
    { title: 'Leave Requests', path: '/leave-requests', icon: Clock },
    { title: 'Settings', path: '/settings', icon: Settings },
  ],
  faculty: [
    { title: 'Dashboard', path: '/faculty', icon: Home, end: true },
    { title: 'Profile', path: '/faculty/profile', icon: User },
    { title: 'Attendance', path: '/faculty/attendance', icon: Calendar },
    { title: 'Exams', path: '/exams', icon: FileText },
    { title: 'Leave Requests', path: '/leave-requests', icon: Clock },
  ],
  student: [
    { title: 'Dashboard', path: '/student', icon: Home, end: true },
    { title: 'Profile', path: '/student/profile', icon: User },
    { title: 'Attendance', path: '/student/attendance', icon: Calendar },
    { title: 'Leave', path: '/student/leave', icon: Clock },
  ]
};

export function Sidebar({ userRole = 'student' }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = roleBasedNavItems[userRole];

  const handleNavigation = (path) => {
    navigateWithTransition(navigate, path);
  };

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          IET DAVV
        </h2>
      </motion.div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={({ isActive }) => `
              nav-link flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            {item.icon && <item.icon className="w-5 h-5" />}
            <span>{item.title}</span>
          </motion.button>
        ))}
      </nav>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="mx-4 mb-6 p-2 flex items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {theme === 'dark' ? 
          <Sun className="w-5 h-5 text-yellow-500" /> : 
          <Moon className="w-5 h-5 text-blue-500" />
        }
        <span>Toggle Theme</span>
      </motion.button>
    </motion.aside>
  );
}
