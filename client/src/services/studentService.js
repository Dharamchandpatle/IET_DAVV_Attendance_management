import api, { unwrapResponse } from './api';

// Fetches all students for admin/faculty views.
export const listStudents = async () => {
  const response = await api.get('/api/students');
  return unwrapResponse(response).data || [];
};
