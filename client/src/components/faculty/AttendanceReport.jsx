import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const attendanceData = [
  { date: '01/02', present: 28, total: 30 },
  { date: '02/02', present: 25, total: 30 },
  { date: '03/02', present: 29, total: 30 },
  // Add more data points...
];

export function AttendanceReport() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Report</h2>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <XAxis dataKey="date" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Attendance</p>
            <p className="text-2xl font-bold text-blue-600">85%</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
            <p className="text-2xl font-bold text-green-600">24</p>
          </div>
        </div>
      </div>
    </div>
  );
}
