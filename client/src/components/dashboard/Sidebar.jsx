import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Clock, FileText, Home, Moon, Settings, Sun, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import davvlogo from '../../assets/images/davvlogo.png';
import { useTheme } from '../../context/ThemeContext';
import { navigateWithTransition, preloadRoute } from '../../utils/navigation';

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
    { title: 'Exams', path: '/faculty/exams', icon: FileText },
    { title: 'Leave Requests', path: '/faculty/leave-requests', icon: Clock },
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);

  // Preload routes on mount
  useEffect(() => {
    navItems.forEach(item => preloadRoute(item.path));
  }, [navItems]);

  const handleNavigation = (path) => {
    if (path === activeItem) return; // Prevent unnecessary navigation
    setActiveItem(path);
    navigateWithTransition(navigate, path, {
      duration: 0.2,
      onBeforeNavigate: () => {
        // Preload the target route before navigation
        preloadRoute(path);
      }
    });
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  const itemVariants = {
    open: {
      width: "100%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    collapsed: {
      width: 48,
      opacity: isCollapsed ? 1 : 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ 
        x: 0,
        width: isCollapsed ? 80 : 256,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        width: { duration: 0.2 }
      }}
      className={`${sidebarWidth} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg flex flex-col relative`}
    >
      {/* Collapse Toggle Button */}
      <motion.button
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {/* Logo Section */}
      <motion.div
        className={`p-6 ${isCollapsed ? "px-4" : ""}`}
      >
        <motion.div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={davvlogo} 
            alt="IET DAVV Logo"
            className={`${isCollapsed ? "w-12 h-12" : "w-16 h-16"} object-contain transition-all duration-200`}
          />
        </motion.div>
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            variants={itemVariants}
            initial="open"
            animate={isCollapsed ? "collapsed" : "open"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
              ${location.pathname === item.path || (item.end && location.pathname === item.path)
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <div className="flex items-center gap-3 min-w-max">
              {item.icon && (
                <item.icon className={`w-5 h-5 ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`} />
              )}
              {!isCollapsed && <span>{item.title}</span>}
            </div>
          </motion.button>
        ))}
      </nav>

      {/* Theme Toggle & User Menu */}
      <div className={`border-t border-gray-200 dark:border-gray-700 p-4 ${isCollapsed ? "px-2" : ""}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-full p-2 flex items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? 
            <Sun className="w-5 h-5 text-yellow-500" /> : 
            <Moon className="w-5 h-5 text-blue-500" />
          }
          {!isCollapsed && <span>Toggle Theme</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}
