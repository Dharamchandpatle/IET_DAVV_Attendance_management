import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Eye, EyeOff, LucideLoader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroShape } from '../components/ui/HeroShape';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/toast';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { show } = useToast();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the register card
      gsap.from('.register-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => setIsPageLoading(false)
      });

      // Animate background grid
      gsap.to('.bg-grid-pattern', {
        backgroundPosition: '40px 40px',
        duration: 20,
        repeat: -1,
        ease: 'none'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const validateForm = (formData) => {
    const errors = {};
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!name || name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }

    if (!role) {
      errors.role = 'Please select a role';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    const formData = new FormData(e.target);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: formData.get('role')
      });
    } catch (error) {
      // Server-side validation errors will be caught here
      if (error.message) {
        // If it's a specific field error
        if (error.message.toLowerCase().includes('email')) {
          setValidationErrors(prev => ({ ...prev, email: error.message }));
        } else if (error.message.toLowerCase().includes('password')) {
          setValidationErrors(prev => ({ ...prev, password: error.message }));
        }
      }
    }
  };

  if (isPageLoading) {
    return <LoadingSpinner label="Loading..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid opacity-10" />
      <HeroShape />
      
      <motion.div
        className="register-card max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-6">
          <img 
            src="/client/assest/images/davvlogo.png"
            alt="IET DAVV Logo" 
            className="w-24 h-24 mx-auto object-contain"
          />
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join IET DAVV's Attendance Management System
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                  ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <select
                name="role"
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                  ${validationErrors.role ? 'border-red-500' : 'border-gray-300'}`}
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
              {validationErrors.role && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.role}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                  ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                  ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                  ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <LucideLoader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
}
