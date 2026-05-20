import axios from 'axios';
import { clearAuth, getToken } from './authStorage';

// Shared Axios instance for API calls.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attaches auth token to outgoing requests.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handles auth failures globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Normalizes API payloads and throws on failures.
export const unwrapResponse = (response) => {
  const payload = response?.data;
  if (!payload) {
    return { data: null };
  }
  if (payload.success === false) {
    throw new Error(payload.message || 'Request failed');
  }
  return payload;
};

// Extracts a user-friendly error message.
export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  return error?.response?.data?.message || error?.message || fallback;
};

export default api;
