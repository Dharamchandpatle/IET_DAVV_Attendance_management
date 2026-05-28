import api, { unwrapResponse } from './api';

// Submits a leave request for the current student.
export const createLeaveRequest = async (payload) => {
  const response = await api.post('/api/leave-requests', payload);
  return unwrapResponse(response).data;
};

// Uploads attachments and returns array of URLs
export const uploadAttachments = async (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  const response = await api.post('/api/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrapResponse(response).data || [];
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

export const deleteLeaveRequest = async (id) => {
  const response = await api.delete(`/api/leave-requests/${id}`);
  return unwrapResponse(response).data;
};
