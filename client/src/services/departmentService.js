import api, { unwrapResponse } from './api';

export const getDepartments = async () => {
  const response = await api.get('/api/departments');
  return unwrapResponse(response).data || [];
};
