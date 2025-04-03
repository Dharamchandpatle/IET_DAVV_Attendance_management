import { motion } from 'framer-motion';
import { BarChart3, BookOpen, GraduationCap, Users } from 'lucide-react';

const kpiData = {
  admin: [
    { title: 'Total Students', value: '1,234', icon: GraduationCap, trend: '+5.2%' },
    { title: 'Faculty Members', value: '48', icon: Users, trend: '+2.1%' },
    { title: 'Active Courses', value: '26', icon: BookOpen, trend: '0%' },
    { title: 'Avg. Attendance', value: '89%', icon: BarChart3, trend: '+1.2%' }
  ],
  faculty: [
    { title: 'My Students', value: '120', icon: GraduationCap },
    { title: 'Courses', value: '4', icon: BookOpen },
    { title: 'Avg. Attendance', value: '85%', icon: BarChart3 },
    { title: 'Today\'s Classes', value: '3', icon: Users }
  ],
  student: [
    { title: 'Attendance', value: '92%', icon: BarChart3 },
    { title: 'Courses', value: '6', icon: BookOpen },
    { title: 'Assignments', value: '8', icon: GraduationCap },
    { title: 'Average Score', value: '85%', icon: Users }
  ]
};

export function KPIGrid({ userRole = 'student' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData[userRole].map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="dashboard-card bg-card p-6 rounded-xl shadow-sm"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <kpi.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <h3 className="text-2xl font-bold">{kpi.value}</h3>
              {kpi.trend && (
                <p className={`text-sm ${
                  kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trend} from last month
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
