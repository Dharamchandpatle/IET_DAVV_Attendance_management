// import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

// Modal for marking attendance with optional event details.
export function AttendanceModal({ onClose, onSubmit }) {
  const { show } = useToast();
  const [attendanceType, setAttendanceType] = useState('regular');
  const [eventDetails, setEventDetails] = useState('');
  const [students, setStudents] = useState([
    { id: 1, name: 'Dharamchand Patle', rollNo: 'CS21B001', present: false },
    { id: 2, name: 'Dharamchand Patle', rollNo: 'CS21B002', present: false },
    // Add more students as needed
  ]);

  const attendanceTypes = [
    { value: 'regular', label: 'Regular Class' },
    { value: 'college_event', label: 'College Event' },
    { value: 'govt_event', label: 'Government Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'other', label: 'Other' }
  ];

  // Marks all students with the same attendance status.
  const handleMarkAll = (status) => {
    setStudents(prev => prev.map(student => ({ ...student, present: status })));
  };

  // Validates inputs and submits attendance payload.
  const handleSubmit = async () => {
    try {
      if (attendanceType !== 'regular' && !eventDetails) {
        show({
          title: "Error",
          description: "Please provide event details",
          type: "error"
        });
        return;
      }

      await onSubmit({
        type: attendanceType,
        eventDetails: eventDetails,
        students: students.map(({ id, present }) => ({ id, present })),
        date: new Date().toISOString()
      });
      
      show({
        title: "Success",
        description: "Attendance marked successfully",
        type: "success"
      });
      onClose();
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to mark attendance",
        type: "error"
      });
    }
  };

  const isHolidayOrEvent = attendanceType !== 'regular';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full mx-4 shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Mark Attendance</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attendance Type Selector */}
        <div className="mb-6 space-y-4">
          <select
            value={attendanceType}
            onChange={(e) => setAttendanceType(e.target.value)}
            className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg"
          >
            {attendanceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Event Details Input */}
          {isHolidayOrEvent && (
            <div>
              <input
                type="text"
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
                placeholder={`Enter ${attendanceType.replace('_', ' ')} details...`}
                className="w-full p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isHolidayOrEvent && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleMarkAll(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:scale-102 transition-transform"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-102 transition-transform"
            >
              All Absent
            </button>
          </div>
        )}

        {/* Student List - Only show for regular attendance */}
        {!isHolidayOrEvent && (
          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.rollNo}</p>
                </div>
                <button
                  onClick={() => {
                    setStudents(prev => prev.map(s => 
                      s.id === student.id ? { ...s, present: !s.present } : s
                    ));
                  }}
                  className={`p-2 rounded-lg hover:scale-105 transition-transform ${
                    student.present 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {student.present ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:scale-102 transition-transform"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}
