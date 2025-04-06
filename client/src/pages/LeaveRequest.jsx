import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { LeaveRequestForm } from '../components/student/LeaveRequestForm';
import { useToast } from '../components/ui/toast';

export function LeaveRequest() {
  const { show } = useToast();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = [
          { 
            id: 1, 
            date: '2024-02-15', 
            fromDate: '2024-02-15',
            toDate: '2024-02-16',
            reason: 'Medical Appointment', 
            status: 'pending',
            type: 'medical'
          },
          { 
            id: 2, 
            date: '2024-02-10', 
            fromDate: '2024-02-10',
            toDate: '2024-02-10',
            reason: 'Family Function', 
            status: 'approved',
            type: 'personal'
          },
        ];
        
        setLeaveRequests(mockData);
        updateStats(mockData);
      } catch (error) {
        console.error('Failed to fetch leave requests:', error);
        show({
          title: "Error",
          description: "Failed to load leave requests",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [show]);

  const updateStats = (requests) => {
    const newStats = requests.reduce((acc, req) => {
      acc.total++;
      acc[req.status]++;
      return acc;
    }, { total: 0, pending: 0, approved: 0, rejected: 0 });
    
    setStats(newStats);
  };

  const handleLeaveSubmit = async (formData) => {
    try {
      const newRequest = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        type: formData.type || 'personal',
        status: 'pending'
      };

      setLeaveRequests(prev => [newRequest, ...prev]);
      updateStats([...leaveRequests, newRequest]);
      
      show({
        title: "Request Submitted",
        description: "Your leave request has been submitted successfully.",
        type: "success"
      });

      // Animate the new request
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  return (
    <DashboardLayout userRole="student" isLoading={isLoading}>
      <div className="space-y-6" ref={containerRef}>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Leave Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">New Leave Request</h2>
            <LeaveRequestForm onSubmit={handleLeaveSubmit} />
          </motion.div>

          {/* Leave History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Leave History</h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {leaveRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 border dark:border-gray-700 rounded-lg"
                    data-request={request.id}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {new Date(request.fromDate).toLocaleDateString()} 
                          {request.fromDate !== request.toDate && 
                            ` - ${new Date(request.toDate).toLocaleDateString()}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.reason}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {leaveRequests.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 dark:text-gray-400 py-4"
                >
                  No leave requests found
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
