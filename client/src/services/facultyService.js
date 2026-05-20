import api, { unwrapResponse } from './api';

// Fetches all faculty members for admin views.
export const listFaculty = async () => {
  const response = await api.get('/api/faculty');
  return unwrapResponse(response).data || [];
};
