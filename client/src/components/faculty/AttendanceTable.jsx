import { useEffect, useState } from 'react';
import { markClassAttendance } from '../../services/attendanceService';
import { listStudents } from '../../services/studentService';

export default function AttendanceTable({ semester = 1, course_id = null }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await listStudents();
        if (!active) return;
        const filtered = data.filter(s => Number(s.semester) === Number(semester));
        setStudents(filtered);
        const initial = {};
        filtered.forEach(s => {
          const uid = String(s.user_id ?? s.id ?? '');
          if (uid) initial[uid] = 'present';
        });
        setRecords(initial);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [semester]);

  const toggleStatus = (studentId, status) => {
    const id = String(studentId);
    setRecords(prev => ({ ...prev, [id]: status }));
  };

  const submit = async () => {
    const payload = {
      class_date: new Date().toISOString().slice(0,10),
      records: students.map(s => ({ user_id: Number(s.user_id ?? s.id), status: records[String(s.user_id ?? s.id)] })),
      course_id,
      semester
    };
    await markClassAttendance(payload);
    alert('Attendance submitted');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border-b"><th>Name</th><th>Roll</th><th>Mark</th></tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.roll_number}</td>
              <td className="px-4 py-2">
                <select value={records[s.id]} onChange={(e) => toggleStatus(s.id, e.target.value)}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit Attendance</button>
      </div>
    </div>
  );
}
