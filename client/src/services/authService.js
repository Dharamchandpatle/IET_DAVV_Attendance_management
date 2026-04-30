import api, { unwrapResponse } from './api';

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  const payload = unwrapResponse(response);
  return payload.data;
};

export const register = async (payload) => {
  const { role, confirmPassword, ...rest } = payload;

  if (role === 'student') {
    const response = await api.post('/api/students/register', rest);
    return unwrapResponse(response).data;
  }

  if (role === 'faculty') {
    const response = await api.post('/api/faculty/register', rest);
    return unwrapResponse(response).data;
  }

  const response = await api.post('/api/auth/register', { ...rest, role });
  return unwrapResponse(response).data;
};

export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  return unwrapResponse(response).data;
};
