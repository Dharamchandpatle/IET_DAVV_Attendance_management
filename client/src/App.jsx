
import { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ToasterProvider } from './components/ui/Toaster';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { lazyLoad } from './utils/routeLoader';

// Public Pages
const LandingPage = lazyLoad('LandingPage');
const Login = lazyLoad('auth/Login');
const Register = lazyLoad('auth/Register');

// Admin Pages
const AdminDashboard = lazyLoad('admin/AdminDashboard');
const StudentsManagement = lazyLoad('admin/StudentsManagement');
const FacultyManagement = lazyLoad('admin/FacultyManagement');

// Faculty Pages
const FacultyDashboard = lazyLoad('faculty/FacultyDashboard');
const AttendancePage = lazyLoad('faculty/AttendancePage');
const LeaveRequests = lazyLoad('faculty/LeaveRequests');
const FacultyProfile = lazyLoad('faculty/FacultyProfile');

// Student Pages
const StudentDashboard = lazyLoad('student/StudentDashboard');
const AttendanceView = lazyLoad('student/AttendanceView');
const LeaveRequest = lazyLoad('student/LeaveRequest');
const StudentProfile = lazyLoad('student/StudentProfile');

function AppContent() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Suspense fallback={<LoadingSpinner fullScreen />}>

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StudentsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/faculty"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FacultyManagement />
              </ProtectedRoute>
            }
          />

          {/* ================= FACULTY ROUTES ================= */}

          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/attendance"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <AttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/leave-requests"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <LeaveRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty/profile"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyProfile />
              </ProtectedRoute>
            }
          />

          {/* ================= STUDENT ROUTES ================= */}

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AttendanceView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/leave"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <LeaveRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </Suspense>
    </div>
  );
}

export default function App() {
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

