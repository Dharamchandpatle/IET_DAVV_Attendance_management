import { useMemo } from 'react';

export function AttendanceStats({ students = [], present: presentProp, absent: absentProp }) {
  const stats = useMemo(() => {
    const total = students.length;
    const present = typeof presentProp === 'number' ? presentProp : students.filter(s => s.present).length;
    const absent = typeof absentProp === 'number' ? absentProp : total - present;
    const percent = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percent };
  }, [students, presentProp, absentProp]);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm min-w-[220px]">
      <h4 className="text-sm text-gray-500 dark:text-gray-400">Attendance Summary</h4>
      <div className="mt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Present</span>
          <span className="font-semibold">{stats.present}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">Absent</span>
          <span className="font-semibold">{stats.absent}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
          <span className="font-semibold">{stats.total}</span>
        </div>
        <div className="mt-3">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
          <div className="text-right mt-1 text-sm text-gray-600 dark:text-gray-400">{stats.percent}%</div>
        </div>
      </div>
    </div>
  );
}
