import { createContext, useCallback, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await mockLoginCall(credentials);
      setUser(response.user);
      
      const destination = location.state?.from || getRoleBasedPath(response.user.role);
      navigate(destination, { replace: true });
      
      return response.user;
    } catch (error) {
      show({
        title: "Login Failed",
        description: error.message,
        type: "error"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location, show]);

  const logout = useCallback(() => {
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
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

async function mockLoginCall(credentials) {
  // Mock API call - replace with actual implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: 1,
          name: 'Test User',
          role: credentials.role || 'student',
          email: credentials.email
        }
      });
    }, 1000);
  });
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
