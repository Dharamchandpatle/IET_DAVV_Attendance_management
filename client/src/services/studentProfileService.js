import api, { unwrapResponse } from './api';

// Fetch current student profile
// If no studentId is provided, use the authenticated /me endpoint
export const getStudentProfile = async (studentId) => {
  const url = studentId ? `/api/students/${studentId}` : '/api/students/me';
  const response = await api.get(url);
  return unwrapResponse(response).data;
};

// Update student profile
export const updateStudentProfile = async (studentId, data) => {
  const response = await api.put(`/api/students/${studentId}`, data);
  return unwrapResponse(response).data;
};

// Get all students (admin/faculty only)
export const getAllStudents = async () => {
  const response = await api.get('/api/students');
  return unwrapResponse(response).data;
};

// Delete student (admin only)
export const deleteStudent = async (studentId) => {
  const response = await api.delete(`/api/students/${studentId}`);
  return unwrapResponse(response).data;
};
