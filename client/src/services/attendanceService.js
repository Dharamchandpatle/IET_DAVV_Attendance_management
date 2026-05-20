import api, { unwrapResponse } from './api';

// Submits class attendance records.
export const markClassAttendance = async (payload) => {
  const response = await api.post('/api/attendance/class', payload);
  return unwrapResponse(response).data;
};

// Fetches attendance history for the current user.
export const getMyAttendance = async () => {
  const response = await api.get('/api/attendance/class/me');
  return unwrapResponse(response).data || [];
};
