import api, { unwrapResponse } from './api';

export const listStudents = async () => {
  const response = await api.get('/api/students');
  return unwrapResponse(response).data || [];
};
