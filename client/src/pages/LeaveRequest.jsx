import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { LeaveRequestForm } from '../components/student/LeaveRequestForm';
import { useToast } from '../components/ui/toast';

export function LeaveRequest() {
  const { show } = useToast();
  const containerRef = useRef(null);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, date: '2024-02-15', reason: 'Medical', status: 'pending' },
    { id: 2, date: '2024-02-10', reason: 'Family Event', status: 'approved' },
  ]);

  const handleLeaveSubmit = async (formData) => {
    try {
      // API call would go here
      const newRequest = {
        id: Date.now(),
        date: formData.date,
        reason: formData.reason,
        type: formData.type,
        status: 'pending'
      };

      setLeaveRequests(prev => [newRequest, ...prev]);
      
      show({
        title: "Request Submitted",
        description: "Your leave request has been submitted successfully.",
        type: "success"
      });

      gsap.from(`[data-request="${newRequest.id}"]`, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.out'
      });
    } catch (error) {
      show({
        title: "Error",
        description: "Failed to submit leave request",
        type: "error"
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.leave-request-card', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar userRole="student" />
      
      <main className="flex-1 overflow-y-auto p-6" ref={containerRef}>
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Leave Requests</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Submit and track your leave applications
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Leaves</p>
                  <p className="text-2xl font-bold">{leaveRequests.length}</p>
                </div>
              </div>
            </motion.div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Leave Request Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="leave-request-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">New Leave Request</h2>
              <LeaveRequestForm onSubmit={handleLeaveSubmit} />
            </motion.div>

            {/* Leave History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="leave-request-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4">Leave History</h2>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    data-request={request.id}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{request.date}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.reason}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
