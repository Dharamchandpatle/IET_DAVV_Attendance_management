import api, { unwrapResponse } from './api';

export const getDepartments = async () => {
  const response = await api.get('/departments');
  return unwrapResponse(response).data || [];
};