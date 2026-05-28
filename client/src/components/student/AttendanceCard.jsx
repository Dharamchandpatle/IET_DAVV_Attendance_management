import { useEffect, useState } from 'react';
import { getMyAttendance } from '../../services/attendanceService';

export default function AttendanceCard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getMyAttendance();
      setRecords(data || []);
    })();
  }, []);

  const percent = Math.round((records.filter(r => r.status === 'present').length / (records.length || 1)) * 100);

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h3 className="text-lg font-semibold">Attendance</h3>
      <p className="text-2xl mt-2">{percent}%</p>
      <p className="text-sm text-gray-500">Based on last {records.length} classes</p>
    </div>
  );
}
