import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../services/api';
import { login as loginApi, logout as logoutApi, register as registerApi } from '../services/authService';
import { clearAuth, getAuth, setAuth } from '../services/authStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to prevent flash
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();

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

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      await registerApi(userData);
      
      show({
        title: "Registration Successful",
        description: "Your account has been created successfully. Please sign in.",
        type: "success"
      });
      
      navigate('/login');
    } catch (error) {
      show({
        title: "Registration Failed",
        description: getApiErrorMessage(error, "An error occurred during registration. Please try again."),
        type: "error"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, show]);

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await loginApi(credentials);
      
      // Store auth details for persistence
      setAuth({ token: response.token, user: response.user });
      setUser(response.user);
      
      const destination = location.state?.from || getRoleBasedPath(response.user.role);
      navigate(destination, { replace: true });
      
      show({
        title: "Welcome Back",
        description: "You have successfully logged in.",
        type: "success"
      });
      
    } catch (error) {
      show({
        title: "Login Failed",
        description: getApiErrorMessage(error, "Invalid credentials. Please try again."),
        type: "error"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location, show]);

  const logout = useCallback(async () => {
    setUser(null);
    clearAuth();
    try {
      await logoutApi();
    } catch (error) {
      // Ignore logout errors to keep UX smooth.
    }
    navigate('/', { replace: true });
    show({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      type: "success"
    });
  }, [navigate, show]);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
