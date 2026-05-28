import api, { unwrapResponse } from './api';

// Fetches all students for admin/faculty views.
export const listStudents = async () => {
  const response = await api.get('/api/students');
  return unwrapResponse(response).data || [];
};

export const createStudent = async (payload) => {
  const response = await api.post('/api/students', payload);
  return unwrapResponse(response).data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/api/students/${id}`);
  return unwrapResponse(response).data;
};
