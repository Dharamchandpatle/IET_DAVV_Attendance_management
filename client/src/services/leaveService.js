import api, { unwrapResponse } from './api';

// Submits a leave request for the current student.
export const createLeaveRequest = async (payload) => {
  const response = await api.post('/api/leave-requests', payload);
  return unwrapResponse(response).data;
};

// Lists leave requests with optional filters.
export const listLeaveRequests = async (params = {}) => {
  const response = await api.get('/api/leave-requests', { params });
  return unwrapResponse(response).data || [];
};

// Updates leave request status for faculty review.
export const updateLeaveStatus = async (id, payload) => {
  const response = await api.patch(`/api/leave-requests/${id}/status`, payload);
  return unwrapResponse(response).data;
};
