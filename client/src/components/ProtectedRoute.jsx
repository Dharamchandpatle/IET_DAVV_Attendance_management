import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ui/toast';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { show } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      show({
        title: "Authentication Required",
        description: "Please login to access this page."
      });
    }
  }, [isAuthenticated, isLoading, show]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    show({
      title: "Access Denied",
      description: "You don't have permission to access this page."
    });
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}
