import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './button';

export function AuthToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('login'); // 'login' or 'register'
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    };

    try {
      await login(credentials);
      setIsOpen(false);
    } catch (error) {
      show({
        title: "Login Failed",
        description: error.message
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => {
          setView('login');
          setIsOpen(true);
        }}>
          Login
        </Button>
        <Button onClick={() => {
          setView('register');
          setIsOpen(true);
        }}>
          Register
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl max-w-lg mx-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {view === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                {view === 'login' ? (
                  <form onSubmit={handleLogin} className="auth-form space-y-4">
                    <select name="role" className="w-full p-3 border rounded-lg dark:bg-gray-700">
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />
                    <Button className="w-full">Sign In</Button>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setView('register')}
                        className="text-blue-600 hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-3 border rounded-lg dark:bg-gray-700"
                    />
                    <Button className="w-full">Create Account</Button>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => setView('login')}
                        className="text-blue-600 hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
