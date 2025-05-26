import { motion } from 'framer-motion';
import { Check, Clock, Download, EyeIcon, Paperclip, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useToast } from '../ui/toast';

const mockStats = {
  pending: 5,
  approved: 12,
  rejected: 3
};

const mockRequests = [
  {
    id: 1,
    studentName: 'Dharamchand Patle',
    studentId: 'ST2025001',
    startDate: '2025-04-08',
    endDate: '2025-04-10',
    reason: 'Medical appointment',
    type: 'medical',
    status: 'pending',
    attachments: [
      { id: 1, name: 'medical_certificate.pdf', type: 'application/pdf', url: '#' }
    ],
    comments: []
  },
  // ... other mock requests
];

export function LeaveRequestsSection() {
  const { show } = useToast();
  const [stats, setStats] = useState(mockStats);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    hasAttachments: false
  });
  const [comment, setComment] = useState('');

  useEffect(() => {
    const loadLeaveRequests = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        setRequests(mockRequests);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading leave requests:', error);
        show({
          title: "Error",
          description: "Failed to load leave requests",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaveRequests();
  }, [show]);

  const handleStatusChange = async (requestId, newStatus) => {
    if (!comment && newStatus === 'rejected') {
      show({
        title: "Comment Required",
        description: "Please provide a reason for rejecting the request",
        type: "error"
      });
      return;
    }

    try {
      // Optimistic update
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: newStatus,
                comments: comment 
                  ? [...(req.comments || []), { text: comment, date: new Date().toISOString() }]
                  : req.comments 
              } 
            : req
        )
      );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update stats
      setStats(prev => {
        const updatedStats = { ...prev };
        updatedStats.pending--;
        updatedStats[newStatus]++;
        return updatedStats;
      });

      show({
        title: "Success",
        description: `Request ${newStatus} successfully`,
        type: "success"
      });

      setComment('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request status:', error);
      // Revert optimistic update on error
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'pending' } : req
        )
      );
      show({
        title: "Error",
        description: `Failed to ${newStatus} request`,
        type: "error"
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(search.toLowerCase()) ||
      request.studentId.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filters.type === 'all' || request.type === filters.type;
    const matchesAttachments = !filters.hasAttachments || 
      (request.attachments && request.attachments.length > 0);
    
    let matchesDate = true;
    if (filters.date === 'today') {
      matchesDate = request.startDate === new Date().toISOString().split('T')[0];
    } else if (filters.date === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(request.startDate) >= weekAgo;
    }

    return matchesSearch && matchesType && matchesAttachments && matchesDate &&
      (activeTab === 'all' || request.status === activeTab);
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
        >
          <h3 className="font-medium">Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
        >
          <h3 className="font-medium">Approved</h3>
          <p className="text-2xl font-bold">{stats.approved}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
        >
          <h3 className="font-medium">Rejected</h3>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="p-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Types</option>
          <option value="medical">Medical</option>
          <option value="personal">Personal</option>
          <option value="family">Family</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          className="p-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasAttachments}
            onChange={(e) => setFilters(prev => ({ ...prev, hasAttachments: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm">Has Attachments</span>
        </label>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="flex gap-2 p-4 border-b dark:border-gray-700">
          {['pending', 'approved', 'rejected', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors
                ${activeTab === tab 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y dark:divide-gray-700">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-500 dark:text-gray-400"
            >
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No {activeTab} leave requests found</p>
            </motion.div>
          ) : (
            filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  selectedRequest?.id === request.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">{request.studentName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {request.studentId}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {request.startDate} to {request.endDate}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                        {request.type}
                      </span>
                      {request.attachments?.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Paperclip className="w-3 h-3" />
                          {request.attachments.length} attachment(s)
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-2">{request.reason}</p>
                    {request.comments?.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium">Comments:</p>
                        {request.comments.map((comment, i) => (
                          <p key={i} className="mt-1">{comment.text}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' ? (
                    <div className="flex gap-2">
                      {/* Review Actions */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className={`px-3 py-1 rounded-full text-sm
                      ${request.status === 'approved' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}
                    >
                      {request.status}
                    </div>
                  )}
                </div>

                {/* Attachments Preview */}
                {request.attachments?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="text-sm truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* Download logic */}}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4">Review Leave Request</h3>
            
            <div className="space-y-6">
              {/* Student Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student Name</p>
                    <p className="font-medium">{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
                    <p className="font-medium">{selectedRequest.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From Date</p>
                    <p className="font-medium">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To Date</p>
                    <p className="font-medium">{selectedRequest.endDate}</p>
                  </div>
                </div>
              </div>

              {/* Leave Type and Reason */}
              <div>
                <h4 className="font-medium mb-2">Leave Type</h4>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {selectedRequest.type}
                </span>
                
                <h4 className="font-medium mt-4 mb-2">Reason for Leave</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Attachments */}
              {selectedRequest.attachments?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Supporting Documents</h4>
                  <div className="grid gap-3">
                    {selectedRequest.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => {/* Download logic */}}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Comments */}
              <div>
                <h4 className="font-medium mb-3">Review Comments</h4>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your review comments here (required for rejection)..."
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-h-[100px] resize-none"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setComment('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Reject Request</span>
                </button>
                <button
                  onClick={() => handleStatusChange(selectedRequest.id, 'approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Request</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
