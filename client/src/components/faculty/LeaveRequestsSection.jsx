// import { motion } from 'framer-motion';
import { Check, Clock, Download, Eye, Paperclip, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getApiErrorMessage } from '../../services/api';
import { listLeaveRequests, updateLeaveStatus } from '../../services/leaveService';
// loader removed per UX request — avoid blocking spinner
import { useToast } from '../ui/toast';

const mockStats = {
  pending: 0,
  approved: 0,
  rejected: 0
};

// Faculty review dashboard for student leave requests.
export function LeaveRequestsSection() {
  const { show } = useToast();
  const [stats, setStats] = useState(mockStats);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const tabs = ['pending', 'approved', 'rejected', 'all'];
  const tabContainerRef = useRef(null);
  const tabRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    hasAttachments: false
  });
  const [comment, setComment] = useState('');
  const [loadError, setLoadError] = useState(null);

  // Loads leave requests and derives summary stats.
  const loadLeaveRequests = async () => {
    let isActive = true; // scoped to this invocation
    setLoadError(null);
    try {
      setIsLoading(true);
      console.debug('LeaveRequestsSection: loading leave requests...');
      // Add a timeout so the UI doesn't hang indefinitely if the API is unreachable
      const data = await Promise.race([
        listLeaveRequests(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 10000))
      ]).catch(err => { throw err; });
      if (!isActive) return;

      const safeData = Array.isArray(data) ? data : [];

      const mapped = safeData.map((request) => ({
          id: request.id,
          studentName: request.student_name,
          studentId: request.roll_number,
          startDate: request.start_date,
          endDate: request.end_date,
          reason: request.reason,
          type: request.type,
          status: request.status,
          attachments: (request.document_urls || []).map((name, index) => ({
            id: index + 1,
            name: (name && name.split('/').pop()) || `attachment-${index + 1}`,
            type: (name && name.endsWith && name.endsWith('.pdf')) ? 'application/pdf' : 'image',
            url: name
          })),
          comments: request.review_comment
            ? [{ text: request.review_comment, date: request.reviewed_at || new Date().toISOString() }]
            : []
        }));

        setRequests(mapped);
        const nextStats = mapped.reduce(
          (acc, item) => {
            if (item.status in acc) acc[item.status] += 1;
            return acc;
          },
          { pending: 0, approved: 0, rejected: 0 }
        );
        setStats(nextStats);
    } catch (error) {
      console.error('Error loading leave requests:', error);
      setLoadError(getApiErrorMessage(error, 'Failed to load leave requests'));
      show({
        title: "Error",
        description: getApiErrorMessage(error, "Failed to load leave requests"),
        type: "error"
      });
      setRequests([]);
      setStats(mockStats);
    } finally {
      if (isActive) setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) loadLeaveRequests();
    return () => { mounted = false; };
  }, [show]);

  // Update the slider position under the active tab
  useEffect(() => {
    const updateSlider = () => {
      const container = tabContainerRef.current;
      const refs = tabRefs.current || [];
      const idx = tabs.indexOf(activeTab);
      if (!container || !refs[idx]) {
        setSliderStyle(s => ({ ...s, opacity: 0 }));
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const btnRect = refs[idx].getBoundingClientRect();
      const left = btnRect.left - containerRect.left + container.scrollLeft + 8;
      const width = Math.max(24, btnRect.width - 16);
      setSliderStyle({ left: `${left}px`, width: `${width}px`, opacity: 1 });
    };

    // Defer to next frame to ensure layout is ready
    requestAnimationFrame(updateSlider);
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [activeTab, tabs]);

  // Approves or rejects a leave request with optional comments.
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

      await updateLeaveStatus(requestId, {
        status: newStatus,
        review_comment: comment
      });

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
        description: getApiErrorMessage(error, `Failed to ${newStatus} request`),
        type: "error"
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const nameText = (request.studentName || '').toString();
    const idText = (request.studentId || '').toString();
    const q = (search || '').toString().toLowerCase();
    const matchesSearch = nameText.toLowerCase().includes(q) || idText.toLowerCase().includes(q);
    
    const matchesType = filters.type === 'all' || (request.type || '').toString() === filters.type;
    const matchesAttachments = !filters.hasAttachments || 
      (request.attachments && request.attachments.length > 0);
    
    let matchesDate = true;
    if (filters.date === 'today') {
      matchesDate = (request.startDate || '') === new Date().toISOString().split('T')[0];
    } else if (filters.date === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(request.startDate || 0) >= weekAgo;
    }

    return matchesSearch && matchesType && matchesAttachments && matchesDate &&
      (activeTab === 'all' || request.status === activeTab);
  });

  // Non-blocking load state: show inline spinner and error banner instead of blocking the entire page

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 transition-transform">
          <h3 className="font-medium">Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 transition-transform">
          <h3 className="font-medium">Approved</h3>
          <p className="text-2xl font-bold">{stats.approved}</p>
        </div>
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 transition-transform">
          <h3 className="font-medium">Rejected</h3>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      {loadError && (
        <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Failed to load leave requests</p>
              <p className="text-sm text-red-600 mt-1">{loadError}</p>
            </div>
            <div>
              <button
                onClick={() => loadLeaveRequests()}
                className="px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="relative" ref={tabContainerRef}>
          <div className="flex gap-2 p-4 border-b dark:border-gray-700">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                ref={(el) => (tabRefs.current[idx] = el)}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors relative z-10
                  ${activeTab === tab 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            aria-hidden
            className="absolute bottom-0 h-1 bg-blue-600 dark:bg-blue-400 rounded transition-all"
            style={{
              left: sliderStyle.left,
              width: sliderStyle.width,
              opacity: sliderStyle.opacity
            }}
          />
        </div>

        <div className="divide-y dark:divide-gray-700">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No {activeTab} leave requests found</p>
            </div>
          ) : (
            filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  selectedRequest?.id === request.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } transition-transform`}
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
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-transform hover:scale-105"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
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
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={file.url}
                            download
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-transform">
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
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <a
                            href={file.url}
                            download
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
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
          </div>
        </div>
      )}
    </div>
  );
}
