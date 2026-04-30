import api, { unwrapResponse } from './api';

export const listFaculty = async () => {
  const response = await api.get('/api/faculty');
  return unwrapResponse(response).data || [];
};
