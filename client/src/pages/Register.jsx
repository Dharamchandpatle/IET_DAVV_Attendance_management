import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Eye, EyeOff, LucideLoader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import davvlogo from '../assets/images/davvlogo.png';
import { HeroShape } from '../components/ui/HeroShape';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/toast';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';
import { getDepartments } from '../services/departmentService';

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
  const [selectedRole, setSelectedRole] = useState('');
  const [departments, setDepartments] = useState([]);

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

  useEffect(() => {
    let isActive = true;

    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        if (isActive) {
          setDepartments(data);
        }
      } catch (error) {
        if (isActive) {
          show({
            title: "Unable to load departments",
            description: getApiErrorMessage(error, "Please try again later."),
            type: "error"
          });
        }
      }
    };

    loadDepartments();

    return () => {
      isActive = false;
    };
  }, [show]);

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
    } else if (!email.endsWith('@ietdavv.edu.in')) {
      errors.email = 'Email must end with @ietdavv.edu.in';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'student') {
      if (!formData.get('roll_number')) errors.roll_number = 'Roll number is required';
      if (!formData.get('department_id')) errors.department_id = 'Department is required';
      if (!formData.get('semester')) errors.semester = 'Semester is required';
      if (!formData.get('section')) errors.section = 'Section is required';
      if (!formData.get('admission_year')) errors.admission_year = 'Admission year is required';
    }

    if (role === 'faculty') {
      if (!formData.get('faculty_code')) errors.faculty_code = 'Faculty code is required';
      if (!formData.get('department_id')) errors.department_id = 'Department is required';
      if (!formData.get('designation')) errors.designation = 'Designation is required';
      if (!formData.get('joining_date')) errors.joining_date = 'Joining date is required';
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
      const role = formData.get('role');
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role,
        phone: formData.get('phone') || undefined
      };

      if (role === 'student') {
        payload.roll_number = formData.get('roll_number');
        payload.department_id = Number(formData.get('department_id'));
        payload.semester = Number(formData.get('semester'));
        payload.section = formData.get('section');
        payload.admission_year = Number(formData.get('admission_year'));
      }

      if (role === 'faculty') {
        payload.faculty_code = formData.get('faculty_code');
        payload.department_id = Number(formData.get('department_id'));
        payload.designation = formData.get('designation');
        payload.joining_date = formData.get('joining_date');
        payload.specialization = formData.get('specialization') || undefined;
      }

      await register(payload);
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
          <motion.div
            onClick={() => navigate('/')}
            className="cursor-pointer inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={davvlogo}
              alt="IET DAVV Logo" 
              className="w-24 h-24 mx-auto object-contain"
            />
          </motion.div>
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
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
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

            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone (optional)"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors border-gray-300"
              />
            </div>

            {selectedRole === 'student' && (
              <>
                <div>
                  <input
                    type="text"
                    name="roll_number"
                    placeholder="Roll Number"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.roll_number ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {validationErrors.roll_number && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.roll_number}</p>
                  )}
                </div>

                <div>
                  <select
                    name="department_id"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.department_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.department_id && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.department_id}</p>
                  )}
                </div>

                <div>
                  <select
                    name="semester"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.semester ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                      <option key={semester} value={semester}>
                        Semester {semester}
                      </option>
                    ))}
                  </select>
                  {validationErrors.semester && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.semester}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="section"
                    placeholder="Section"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.section ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {validationErrors.section && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.section}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="admission_year"
                    placeholder="Admission Year"
                    min="2000"
                    max="2100"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.admission_year ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {validationErrors.admission_year && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.admission_year}</p>
                  )}
                </div>
              </>
            )}

            {selectedRole === 'faculty' && (
              <>
                <div>
                  <input
                    type="text"
                    name="faculty_code"
                    placeholder="Faculty Code"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.faculty_code ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {validationErrors.faculty_code && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.faculty_code}</p>
                  )}
                </div>

                <div>
                  <select
                    name="department_id"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.department_id ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.department_id && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.department_id}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.designation ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {validationErrors.designation && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.designation}</p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    name="joining_date"
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors
                      ${validationErrors.joining_date ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {validationErrors.joining_date && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.joining_date}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization (optional)"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-colors border-gray-300"
                  />
                </div>
              </>
            )}

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
