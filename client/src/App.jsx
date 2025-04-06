import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ToastProvider } from './components/ui/toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { lazyLoad, prefetchRoutes } from './utils/routeLoader';

// Lazy load all pages with optimized chunk naming
const LandingPage = lazyLoad('LandingPage');
const Login = lazyLoad('Login');
const Register = lazyLoad('Register');
const AdminDashboard = lazyLoad('AdminDashboard');
const StudentDashboard = lazyLoad('StudentDashboard');
const FacultyDashboard = lazyLoad('FacultyDashboard');
const StudentsManagement = lazyLoad('StudentsManagement');
const FacultyManagement = lazyLoad('FacultyManagement');
const Settings = lazyLoad('Settings');
const AttendanceSheet = lazyLoad('AttendanceSheet');
const ExamManagement = lazyLoad('ExamManagement');
const LeaveRequests = lazyLoad('LeaveRequests');
const FacultyProfile = lazyLoad('FacultyProfile');
const AttendanceView = lazyLoad('AttendanceView');
const LeaveRequest = lazyLoad('LeaveRequest');
const ExamView = lazyLoad('ExamView');
const StudentProfile = lazyLoad('StudentProfile');

function AppContent() {
  const location = useLocation();
  const pageTransitionRef = useRef(null);

  useEffect(() => {
    // Prefetch critical routes
    prefetchRoutes();

    // Setup GSAP page transitions
    const ctx = gsap.context(() => {
      gsap.registerEffect({
        name: "smoothPageTransition",
        effect: (targets) => {
          return gsap.timeline()
            .set(targets, { opacity: 0, y: 20 })
            .to(targets, { 
              opacity: 1, 
              y: 0, 
              duration: 0.3,
              ease: "power2.out",
              stagger: 0.1,
              clearProps: "all" 
            });
        }
      });
    }, pageTransitionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300" ref={pageTransitionRef}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="students/*" element={<StudentsManagement />} />
                    <Route path="faculty/*" element={<FacultyManagement />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Protected Faculty Routes */}
              <Route path="/faculty/*" element={
                <ProtectedRoute allowedRoles={['faculty']}>
                  <Routes>
                    <Route index element={<FacultyDashboard />} />
                    <Route path="attendance" element={<AttendanceSheet />} />
                    <Route path="exams" element={<ExamManagement />} />
                    <Route path="leave-requests" element={<LeaveRequests />} />
                    <Route path="profile" element={<FacultyProfile />} />
                    <Route path="*" element={<Navigate to="/faculty" replace />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Protected Student Routes */}
              <Route path="/student/*" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Routes>
                    <Route index element={<StudentDashboard />} />
                    <Route path="attendance" element={<AttendanceView />} />
                    <Route path="leave" element={<LeaveRequest />} />
                    <Route path="exams" element={<ExamView />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="*" element={<Navigate to="/student" replace />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;