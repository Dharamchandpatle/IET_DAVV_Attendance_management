import { motion } from 'framer-motion';
import { Clock, Users } from 'lucide-react';
import { useState } from 'react';

const defaultPolicies = [
  {
    id: 'attendance',
    label: 'Minimum Attendance Required',
    value: 75,
    unit: '%',
    icon: Users
  },
  {
    id: 'grace',
    label: 'Grace Period',
    value: 10,
    unit: 'minutes',
    icon: Clock
  }
];

export function PolicyEditor() {
  const [policies, setPolicies] = useState(defaultPolicies);
  const [isEditing, setIsEditing] = useState(null);

  const updatePolicy = (id, newValue) => {
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, value: newValue } : policy
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Policy Settings</h2>
      <div className="space-y-4">
        {policies.map((policy) => (
          <motion.div
            key={policy.id}
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <policy.icon className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">{policy.label}</h3>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={policy.value}
                onChange={(e) => updatePolicy(policy.id, e.target.value)}
                className="w-24 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                onFocus={() => setIsEditing(policy.id)}
                onBlur={() => setIsEditing(null)}
              />
              <span className="text-gray-600 dark:text-gray-400">{policy.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
