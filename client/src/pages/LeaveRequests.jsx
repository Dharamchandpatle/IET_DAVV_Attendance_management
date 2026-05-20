// import { motion } from 'framer-motion';
import { Clock, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FacultyPageLayout } from '../components/faculty/FacultyPageLayout';
import { useToast } from '../components/ui/toast';

const mockRequests = [
  { 
    id: 1, 
    studentName: 'Dharamchand Patle',
    studentId: 'DE24799',
    fromDate: '2024-02-15',
    toDate: '2024-02-16',
    reason: 'Computer Science ',
    status: 'pending',
    requestedOn: '2024-02-10'
  },
  { 
    id: 2, 
    studentName: 'Dharamchand Patle',
    studentId: 'DE24799',
    fromDate: '2024-02-15',
    toDate: '2024-02-16',
    reason: 'Computer Science ',
    status: 'rejected',
    requestedOn: '2024-02-10'
  },
  { 
    id: 3, 
    studentName: 'Dharamchand Patle',
    studentId: 'DE24799',
    fromDate: '2024-02-15',
    toDate: '2024-02-16',
    reason: 'Computer Science ',
    status: 'approved',
    requestedOn: '2024-02-10'
  },
  { 
    id: 4, 
    studentName: 'Dharamchand Patle',
    studentId: 'DE24799',
    fromDate: '2024-02-15',
    toDate: '2024-02-16',
    reason: 'Computer Science ',
    status: 'pending',
    requestedOn: '2024-02-10'
  },
  { 
    id: 5, 
    studentName: 'Dharamchand Patle',
    studentId: 'DE24799',
    fromDate: '2024-02-15',
    toDate: '2024-02-16',
    reason: 'Computer Science ',
    status: 'rejected',
    requestedOn: '2024-02-10'
  },
  { 
    id: 6, 
    studentName: 'Dharamchand Patle',
    studentId: 'DE24799',
    fromDate: '2024-02-15',
    toDate: '2024-02-16',
    reason: 'Computer Science ',
    status: 'approved',
    requestedOn: '2024-02-10'
  },
  // Add more mock data...
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export function LeaveRequests() {
  const { show } = useToast();
  const [requests, setRequests] = useState(mockRequests);
  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // API call would go here
      setRequests(prev => prev.map(request => 
        request.id === id ? { ...request, status: newStatus } : request
      ));

      show({
        title: `Request ${newStatus}`,
        description: `Leave request has been ${newStatus} successfully.`,
        type: "success"
      });
    } catch (error) {
      show({
        title: "Error",
        description: `Failed to ${newStatus} request`,
        type: "error"
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query ||
      request.studentName.toLowerCase().includes(query) ||
      request.studentId.toLowerCase().includes(query);
    
    const matchesStatus = 
      filters.status === 'all' || request.status === filters.status;
    
    const matchesDate = filters.dateRange === 'all' || 
      (filters.dateRange === 'today' && request.requestedOn === new Date().toISOString().split('T')[0]) ||
      (filters.dateRange === 'week' && isWithinLastWeek(request.requestedOn));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = useMemo(() => ({
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }), [requests]);

  return (
    <FacultyPageLayout>
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage student leave applications
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Recent updates
          </span>
        </div>
      </header>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats).map(([status, count]) => (
                <div
                  key={status}
                  className={`p-4 rounded-lg ${statusColors[status]} bg-opacity-20 transition-transform`}
                >
                  <h3 className="capitalize font-medium">{status}</h3>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
          </div>

          {/* Requests List with Enhanced Animations */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No leave requests found</div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="leave-request-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-transform hover:scale-101"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{request.studentName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.studentId}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">From Date</p>
                      <p>{request.fromDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To Date</p>
                      <p>{request.toDate}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {request.reason}
                  </p>

                  {request.status === 'pending' && (
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50 hover:scale-102 transition-transform"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:scale-102 transition-transform"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
    </FacultyPageLayout>
  );
}

function isWithinLastWeek(dateString) {
  const date = new Date(dateString);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date >= weekAgo;
}
