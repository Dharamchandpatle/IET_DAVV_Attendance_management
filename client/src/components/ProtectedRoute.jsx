// import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useToast } from './ui/toast';

// Guards routes based on auth state and allowed roles.
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { show } = useToast();
  const isAuthorized = !allowedRoles.length || allowedRoles.includes(user?.role);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      show({
        title: "Authentication Required",
        description: "Please login to access this page.",
        type: "warning"
      });
    }
  }, [isAuthenticated, isLoading, show]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAuthorized) {
      show({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        type: "error"
      });
    }
  }, [isAuthenticated, isAuthorized, isLoading, show]);

  if (isLoading) {
    return <LoadingSpinner label="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <div className="page-content transition-opacity duration-300">
      {children}
    </div>
  );
}
