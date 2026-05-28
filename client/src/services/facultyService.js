import api, { unwrapResponse } from './api';

// Fetches all faculty members for admin views.
export const listFaculty = async () => {
  const response = await api.get('/api/faculty');
  return unwrapResponse(response).data || [];
};

export const getFacultyById = async (id) => {
  const response = await api.get(`/api/faculty/${id}`);
  return unwrapResponse(response).data || null;
};

export const getMyFaculty = async () => {
  const response = await api.get('/api/faculty/me');
  return unwrapResponse(response).data || null;
};

export const createFaculty = async (payload) => {
  const response = await api.post('/api/faculty', payload);
  return unwrapResponse(response).data;
};

export const deleteFaculty = async (id) => {
  const response = await api.delete(`/api/faculty/${id}`);
  return unwrapResponse(response).data;
};
