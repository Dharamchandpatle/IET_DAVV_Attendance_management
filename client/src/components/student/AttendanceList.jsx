import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyAttendance } from '../../services/attendanceService';

export function AttendanceList({ semester }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMyAttendance();
        const filtered = Array.isArray(data) ? data.filter(r => Number(r.semester) === Number(semester)) : [];
        if (mounted) setRecords(filtered.slice(0, 50));
      } catch (err) {
        console.warn('Failed to load attendance list', err);
        if (mounted) setRecords([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [semester]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
        Loading attendance...
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="text-center text-gray-500 py-6">
        <Clock className="mx-auto mb-2 w-8 h-8 opacity-60" />
        <div>No attendance records found for semester {semester}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left px-2">Date</th>
            <th className="py-2 text-left px-2">Course</th>
            <th className="py-2 text-center px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="py-2 px-2">{r.date || r.class_date || r.attendance_date}</td>
              <td className="py-2 px-2">{r.subject_name || r.course || 'Class'}</td>
              <td className="py-2 px-2 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${r.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceList;
