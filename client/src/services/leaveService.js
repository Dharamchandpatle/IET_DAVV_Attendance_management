import api, { unwrapResponse } from './api';

export const createLeaveRequest = async (payload) => {
  const response = await api.post('/api/leave-requests', payload);
  return unwrapResponse(response).data;
};

export const listLeaveRequests = async (params = {}) => {
  const response = await api.get('/api/leave-requests', { params });
  return unwrapResponse(response).data || [];
};

export const updateLeaveStatus = async (id, payload) => {
  const response = await api.patch(`/api/leave-requests/${id}/status`, payload);
  return unwrapResponse(response).data;
};
