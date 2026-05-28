import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b">
      <div className="flex items-center gap-3">
        <img src="/davvlogo.png" alt="logo" className="w-8 h-8" />
        <h1 className="text-lg font-semibold">IET DAVV Attendance</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name || ''}</span>
        <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
      </div>
    </header>
  );
}
