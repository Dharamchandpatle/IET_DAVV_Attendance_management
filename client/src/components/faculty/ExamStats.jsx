import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function ExamStats() {
  const examData = [
    { subject: 'Math', pass: 85, fail: 15 },
    { subject: 'Physics', pass: 78, fail: 22 },
    { subject: 'Chemistry', pass: 90, fail: 10 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Exam Performance</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={examData}>
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pass" fill="#22c55e" stackId="stack" />
            <Bar dataKey="fail" fill="#ef4444" stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
