import api, { unwrapResponse } from './api';

export const markClassAttendance = async (payload) => {
  const response = await api.post('/api/attendance/class', payload);
  return unwrapResponse(response).data;
};

export const getMyAttendance = async () => {
  const response = await api.get('/api/attendance/class/me');
  return unwrapResponse(response).data || [];
};
