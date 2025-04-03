import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/ui/toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { AttendanceSheet } from './pages/AttendanceSheet';
import { AttendanceView } from './pages/AttendanceView';
import { ExamManagement } from './pages/ExamManagement';
import { ExamView } from './pages/ExamView';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { FacultyManagement } from './pages/FacultyManagement';
import { FacultyProfile } from './pages/FacultyProfile';
import LandingPage from './pages/LandingPage';
import { LeaveRequest } from './pages/LeaveRequest';
import { LeaveRequests } from './pages/LeaveRequests';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfile } from './pages/StudentProfile';
import { StudentsManagement } from './pages/StudentsManagement';

function AppContent() {
  const location = useLocation();
  const ctx = useRef(gsap.context(() => {}));

  useEffect(() => {
    ctx.current = gsap.context(() => {
      gsap.registerEffect({
        name: "pageTransition",
        effect: (targets) => {
          return gsap.timeline()
            .to(targets, { opacity: 0, y: -20, duration: 0.2 })
            .set(targets, { y: 20 })
            .to(targets, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
        }
      });

      gsap.effects.pageTransition('.page-content');
    });

    return () => ctx.current.revert(); // Clean up all GSAP animations
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
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
      </motion.div>
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