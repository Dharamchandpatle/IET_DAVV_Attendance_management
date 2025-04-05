import { motion } from 'framer-motion';
import { Calendar, Cog, Users } from 'lucide-react';
import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const mockData = {
  regular: [
    { date: '1/5', attendance: 85 },
    { date: '2/5', attendance: 92 },
    { date: '3/5', attendance: 88 },
    { date: '4/5', attendance: 90 },
  ],
  events: [
    { date: '15/4', name: 'College Function', type: 'college_event', attendance: 95 },
    { date: '20/4', name: 'Govt. Program', type: 'govt_event', attendance: 98 },
  ],
  holidays: [
    { date: '1/5', name: 'Labor Day', type: 'holiday' },
    { date: '14/4', name: 'Ambedkar Jayanti', type: 'holiday' },
  ]
};

export function AttendanceTrends() {
  const [viewMode, setViewMode] = useState('regular'); // regular, events, holidays
  const [timeRange, setTimeRange] = useState('week'); // week, month, semester

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Attendance Analytics</h2>
        <div className="flex items-center gap-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg text-sm"
          >
            <option value="regular">Regular Classes</option>
            <option value="events">Events</option>
            <option value="holidays">Holidays</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
      </div>

      {viewMode === 'regular' && (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.regular}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#4F46E5" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Average</span>
              </div>
              <p className="text-2xl font-bold">88%</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Classes</span>
              </div>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                <Cog className="w-5 h-5" />
                <span className="font-medium">Required</span>
              </div>
              <p className="text-2xl font-bold">75%</p>
            </div>
          </div>
        </>
      )}

      {viewMode === 'events' && (
        <div className="space-y-4">
          {mockData.events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{event.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Attendance</p>
                  <p className="text-lg font-bold text-green-600">{event.attendance}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {viewMode === 'holidays' && (
        <div className="space-y-4">
          {mockData.holidays.map((holiday, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{holiday.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{holiday.date}</p>
                </div>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm">
                  Holiday
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
