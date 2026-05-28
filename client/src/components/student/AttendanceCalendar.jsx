
import AttendanceList from './AttendanceList';

export function AttendanceCalendar({ semester }) {
  return (
    <div>
      <AttendanceList semester={semester} />
    </div>
  );
}

export default AttendanceCalendar;
