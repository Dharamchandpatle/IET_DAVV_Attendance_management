import { motion } from 'framer-motion';
import { useState } from 'react';

const policies = [
  {
    id: 'minAttendance',
    label: 'Minimum Attendance Required',
    value: 75,
    type: 'number',
    unit: '%'
  },
  {
    id: 'maxLeaves',
    label: 'Maximum Leaves Per Semester',
    value: 15,
    type: 'number',
    unit: 'days'
  },
  {
    id: 'graceTime',
    label: 'Grace Time for Attendance',
    value: 10,
    type: 'number',
    unit: 'minutes'
  }
];

export function PolicySettings() {
  const [settings, setSettings] = useState(policies);

  const handleChange = (id, value) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {settings.map((setting) => (
          <div key={setting.id} className="space-y-2">
            <label className="text-sm font-medium">
              {setting.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type={setting.type}
                value={setting.value}
                onChange={(e) => handleChange(setting.id, e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-500">{setting.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        Save Changes
      </motion.button>
    </div>
  );
}
