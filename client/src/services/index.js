// Central exports for client service layer
export { default as api } from './api';
export * as attendanceService from './attendanceService';
export * as authService from './authService';
export * from './authStorage';
export * from './departmentService';
export * from './facultyProfileService';
export * as facultyService from './facultyService';
export * as leaveService from './leaveService';
export * from './studentProfileService';
export * as studentService from './studentService';

// Backwards compatibility: default export with named modules attached
import apiDefault from './api';
import * as _attendance from './attendanceService';
import * as _auth from './authService';
import * as _faculty from './facultyService';
import * as _leave from './leaveService';
import * as _student from './studentService';

const services = {
  api: apiDefault,
  auth: _auth,
  faculty: _faculty,
  student: _student,
  attendance: _attendance,
  leave: _leave
};

export default services;
