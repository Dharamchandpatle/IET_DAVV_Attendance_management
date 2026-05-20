// import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Eye, EyeOff, LucideLoader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import davvlogo from '../assets/images/davvlogo.png';
import { HeroShape } from '../components/ui/HeroShape';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => setIsPageLoading(false)
      });

      const gridEl = containerRef.current?.querySelector('.bg-grid-pattern') || document.querySelector('.bg-grid-pattern');
      if (gridEl) {
        gsap.to(gridEl, {
          backgroundPosition: '40px 40px',
          duration: 20,
          repeat: -1,
          ease: 'none'
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const validateForm = ({ role, email, password }) => {
    const errors = {};
    if (!role) errors.role = 'Please select a role';
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    const formData = new FormData(e.target);
    const values = {
      role: formData.get('role'),
      email: formData.get('email'),
      password: formData.get('password')
    };
    const errors = validateForm(values);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await login(values);
    } catch (error) {
      toast.error(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return <LoadingSpinner label="Loading..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 bg-grid-pattern animate-grid opacity-10" />
      <HeroShape className="absolute inset-0 opacity-5" />
      
      <div
        className="login-card max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-xl relative z-10"
      >
        <div className="text-center space-y-6">
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer inline-block"
          >
            <img 
              src={davvlogo}
              alt="IET DAVV Logo" 
              className="w-24 h-24 mx-auto object-contain"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                <option value="admin">Admin</option>
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <LucideLoader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline font-medium bg-none border-none cursor-pointer"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
