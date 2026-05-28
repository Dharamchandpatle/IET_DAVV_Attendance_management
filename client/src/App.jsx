// import { AnimatePresence, motion } from 'framer-motion';
// Debug helper: safe console logging for development
import { Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ToasterProvider } from './components/ui/Toaster';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
// debugConsole removed: see commit history
import { lazyLoad } from './utils/routeLoader';

// Lazy load all pages
const LandingPage = lazyLoad('LandingPage');
const Login = lazyLoad('auth/Login');
const Register = lazyLoad('auth/Register');
const AdminDashboard = lazyLoad('admin/AdminDashboard');
const StudentDashboard = lazyLoad('student/StudentDashboard');
const FacultyDashboard = lazyLoad('faculty/FacultyDashboard');
const StudentsManagement = lazyLoad('admin/StudentsManagement');
const FacultyManagement = lazyLoad('admin/FacultyManagement');
const AttendanceSheet = lazyLoad('faculty/AttendancePage');
// Exams disabled
// const ExamManagement = lazyLoad('ExamManagement');
const LeaveRequests = lazyLoad('faculty/LeaveRequests');
const FacultyProfile = lazyLoad('faculty/FacultyProfile');
const AttendanceView = lazyLoad('student/AttendanceView');
const LeaveRequest = lazyLoad('student/LeaveRequest');
// Exams disabled
// const ExamView = lazyLoad('ExamView');
const StudentProfile = lazyLoad('student/StudentProfile');

// Handles route transitions and lazy-loaded pages.
function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div>
        <div
          key={location.pathname}
        >
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <Routes location={location}>
              {/* Public Routes */}
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
                    {/* Exams disabled */}
                    {/* <Route path="exams" element={<ExamManagement />} /> */}
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
                    {/* Exams disabled */}
                    {/* <Route path="exams" element={<ExamView />} /> */}
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="*" element={<Navigate to="/student" replace />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Wraps routing and global providers.
function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToasterProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToasterProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;