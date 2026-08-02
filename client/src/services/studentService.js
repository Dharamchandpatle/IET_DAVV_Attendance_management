import api, { unwrapResponse } from './api';

export const listStudents = async () => {
  const response = await api.get('/students');
  return unwrapResponse(response).data || [];
};

export const createStudent = async (payload) => {
  const response = await api.post('/students', payload);
  return unwrapResponse(response).data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return unwrapResponse(response).data;
};