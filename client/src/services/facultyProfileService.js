import api, { unwrapResponse } from './api';

// Fetch current faculty profile
export const getFacultyProfile = async (facultyId) => {
  const response = await api.get(`/api/faculty/${facultyId}`);
  return unwrapResponse(response).data;
};

// Update faculty profile
export const updateFacultyProfile = async (facultyId, data) => {
  const response = await api.put(`/api/faculty/${facultyId}`, data);
  return unwrapResponse(response).data;
};

// Get all faculty (admin only)
export const getAllFaculty = async () => {
  const response = await api.get('/api/faculty');
  return unwrapResponse(response).data;
};

// Delete faculty (admin only)
export const deleteFaculty = async (facultyId) => {
  const response = await api.delete(`/api/faculty/${facultyId}`);
  return unwrapResponse(response).data;
};
