import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r min-h-screen p-4">
      <nav className="space-y-2">
        <Link to="/" className="block">Home</Link>
        {role === 'admin' && (
          <>
            <Link to="/admin" className="block">Admin Dashboard</Link>
            <Link to="/admin/students" className="block">Students</Link>
            <Link to="/admin/faculty" className="block">Faculty</Link>
          </>
        )}
        {role === 'faculty' && (
          <>
            <Link to="/faculty" className="block">Dashboard</Link>
            <Link to="/faculty/attendance" className="block">Attendance</Link>
            <Link to="/faculty/leave-requests" className="block">Leave Requests</Link>
          </>
        )}
        {role === 'student' && (
          <>
            <Link to="/student" className="block">Dashboard</Link>
            <Link to="/student/attendance" className="block">Attendance</Link>
            <Link to="/student/leave" className="block">Leave</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
