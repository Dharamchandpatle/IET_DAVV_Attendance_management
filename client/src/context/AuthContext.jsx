import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '../services/api';
import { login as loginApi, logout as logoutApi, register as registerApi } from '../services/authService';
import { clearAuth, getAuth, setAuth } from '../services/authStorage';

const AuthContext = createContext();

// Provides auth state and actions to the app.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const savedAuth = getAuth();
      if (savedAuth?.user) {
        setUser(savedAuth.user);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Registers a user and redirects to login.
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      await registerApi(userData);
      toast.success('Registration successful! Please login to continue.');
      navigate('/login', { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'An error occurred during registration. Please try again.');
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Authenticates and routes to the role's home.
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await loginApi(credentials);
      setAuth({ token: response.token, user: response.user });
      setUser(response.user);
      const destination = location.state?.from || getRoleBasedPath(response.user.role);
      toast.success('Welcome back! You have successfully logged in.');
      navigate(destination, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Invalid credentials. Please try again.');
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location]);

  // Clears local auth state and returns to landing.
  const logout = useCallback(async () => {
    setUser(null);
    clearAuth();
    try {
      await logoutApi();
    } catch (error) {
      // Ignore logout errors to keep UX smooth.
    }
    toast.success('You have been successfully logged out.');
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register,
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper functions
// Maps a role to its default route.
function getRoleBasedPath(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'faculty':
      return '/faculty';
    case 'student':
      return '/student';
    default:
      return '/';
  }
}

// Hook for consuming auth context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
