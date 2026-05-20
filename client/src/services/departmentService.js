import api, { unwrapResponse } from './api';

// Fetches department options for selectors.
export const getDepartments = async () => {
  const response = await api.get('/api/departments');
  return unwrapResponse(response).data || [];
};
