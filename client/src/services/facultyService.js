import api, { unwrapResponse } from './api';

export const listFaculty = async () => {
  const response = await api.get('/faculty');
  return unwrapResponse(response).data || [];
};

export const getFacultyById = async (id) => {
  const response = await api.get(`/faculty/${id}`);
  return unwrapResponse(response).data || null;
};

export const getMyFaculty = async () => {
  const response = await api.get('/faculty/me');
  return unwrapResponse(response).data || null;
};

export const createFaculty = async (payload) => {
  const response = await api.post('/faculty', payload);
  return unwrapResponse(response).data;
};

export const deleteFaculty = async (id) => {
  const response = await api.delete(`/faculty/${id}`);
  return unwrapResponse(response).data;
};