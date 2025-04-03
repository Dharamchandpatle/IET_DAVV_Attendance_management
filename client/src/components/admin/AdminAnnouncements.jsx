import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function AdminAnnouncements() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Announcements</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Announcement Title"
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <textarea
            placeholder="Announcement Content"
            rows={4}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg dark:border-gray-600"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Post
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Existing announcements would be mapped here */}
      </div>
    </div>
  );
}
