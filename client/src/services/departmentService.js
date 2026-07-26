import api, { unwrapResponse } from './api';

// Fetches department options for selectors.
export const getDepartments = async () => {
  try {
    const response = await api.get('/api/departments');
    return unwrapResponse(response).data || [];
  } catch (error) {
    if (error?.response?.status === 404) {
      const fallbackResponse = await api.get('/departments');
      return unwrapResponse(fallbackResponse).data || [];
    }

    throw error;
  }
};
