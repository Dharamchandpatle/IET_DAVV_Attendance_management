import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/toast';

export function Register() {
  const navigate = useNavigate();
  const { show } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      // API call would go here
      show({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        type: "success"
      });
      navigate('/login');
    } catch (error) {
      show({
        title: "Registration Failed",
        description: error.message,
        type: "error"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Join IET DAVV's Attendance Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />

            <select
              name="role"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium"
            >
              Create Account
            </motion.button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
