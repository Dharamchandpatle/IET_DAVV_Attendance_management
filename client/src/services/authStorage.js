// Local storage key for auth data.
const STORAGE_KEY = 'auth';

// Reads and parses stored auth data.
export const getAuth = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

// Persists auth data to local storage.
export const setAuth = (auth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

// Clears stored auth data.
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Returns the stored auth token if present.
export const getToken = () => getAuth()?.token || null;
