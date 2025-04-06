import { createContext, useCallback, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to prevent flash
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();

  // Check for existing session on mount
  useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await mockLoginCall(credentials);
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      const destination = location.state?.from || getRoleBasedPath(response.user.role);
      navigate(destination, { replace: true });
      
      show({
        title: "Welcome Back",
        description: "You have successfully logged in.",
        type: "success"
      });
      
      return response.user;
    } catch (error) {
      show({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        type: "error"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location, show]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate basic validation
      if (!credentials.email || !credentials.password || !credentials.role) {
        reject(new Error('Please fill in all required fields'));
        return;
      }

      // Simulate successful login
      resolve({
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name: credentials.email.split('@')[0],
          role: credentials.role,
          email: credentials.email
        }
      });
    }, 1000); // Simulate network delay
  });
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
