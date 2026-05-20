// import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Clock, Home, LogOut, Moon, Sun, User, Users } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import davvlogo from '../../assets/images/davvlogo.png';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const roleBasedNavItems = {
  admin: [
    { title: 'Dashboard', path: '/admin', icon: Home, end: true },
    { title: 'Students', path: '/admin/students', icon: Users },
    { title: 'Faculty', path: '/admin/faculty', icon: Users },
  ],
  faculty: [
    { title: 'Dashboard', path: '/faculty', icon: Home, end: true },
    { title: 'Profile', path: '/faculty/profile', icon: User },
    { title: 'Attendance', path: '/faculty/attendance', icon: Calendar },
    // Exams disabled
    // { title: 'Exams', path: '/faculty/exams', icon: FileText },
    { title: 'Leave Requests', path: '/faculty/leave-requests', icon: Clock },
  ],
  student: [
    { title: 'Dashboard', path: '/student', icon: Home, end: true },
    { title: 'Profile', path: '/student/profile', icon: User },
    { title: 'Attendance', path: '/student/attendance', icon: Calendar },
    { title: 'Leave', path: '/student/leave', icon: Clock },
  ]
};

// Sidebar navigation with role-based links and actions.
export function Sidebar({ userRole = 'student' }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = roleBasedNavItems[userRole];
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  // Builds the NavLink class string based on active state.
  const navLinkClass = (isActive) => (
    `nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ` +
    (isActive
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700')
  );

  return (
    <aside
      className={`${sidebarWidth} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg flex flex-col relative`}
    >
      {/* Collapse Toggle Button */}
      <button
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Logo Section */}
      <div
        className={`p-6 ${isCollapsed ? "px-4" : ""}`}
      >
        <div 
          className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate('/')}
        >
          <img 
            src={davvlogo} 
            alt="IET DAVV Logo"
            className={`${isCollapsed ? "w-12 h-12" : "w-16 h-16"} object-contain transition-all duration-200`}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <div
              className="flex items-center gap-3 min-w-max hover:scale-102 transition-transform"
            >
              {item.icon && (
                <item.icon className="w-5 h-5 text-inherit" />
              )}
              {!isCollapsed && <span>{item.title}</span>}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle & User Menu */}
      <div className={`border-t border-gray-200 dark:border-gray-700 p-4 ${isCollapsed ? "px-2" : ""}`}>
        {/* User Info Section */}
        <div
          className={`flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 mb-3 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'User'}</p>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="w-full p-2 flex items-center gap-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105 transition-transform"
        >
          {theme === 'dark' ? 
            <Sun className="w-5 h-5 text-yellow-500" /> : 
            <Moon className="w-5 h-5 text-blue-500" />
          }
          {!isCollapsed && <span>Toggle Theme</span>}
        </button>

        <button
          onClick={logout}
          className="mt-3 w-full p-2 flex items-center gap-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-transform"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
