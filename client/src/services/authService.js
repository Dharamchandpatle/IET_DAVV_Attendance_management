import api, { unwrapResponse } from './api';

// Authenticates a user and returns token/user data.
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  const payload = unwrapResponse(response);
  return payload.data;
};

// Registers a user based on role and returns auth data.
export const register = async (payload) => {
  const { confirmPassword, ...rest } = payload;
  const response = await api.post('/api/auth/register', rest);
  return unwrapResponse(response).data;
};

// Logs out the current user session.
export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  return unwrapResponse(response).data;
};
