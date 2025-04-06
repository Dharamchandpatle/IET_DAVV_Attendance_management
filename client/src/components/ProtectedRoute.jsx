import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useToast } from './ui/toast';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { show } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      show({
        title: "Authentication Required",
        description: "Please login to access this page.",
        type: "warning"
      });
    }
  }, [isAuthenticated, isLoading, show]);

  if (isLoading) {
    return <LoadingSpinner label="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    show({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      type: "error"
    });
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
