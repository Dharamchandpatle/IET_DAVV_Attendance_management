# Attendance Management Server

This folder contains the Express + MySQL backend used by the client UI.

## Quick start

1. Create a .env file with the following keys:
	 - DB_HOST
	 - DB_USER
	 - DB_PASS
	 - DB_NAME
	 - JWT_SECRET
	 - PORT (optional, defaults to 5000)

2. Install and run:
	 - npm install
	 - npm run dev

## API overview

Base path: /api

Auth
	- POST /api/auth/register
	- POST /api/auth/login
	- POST /api/auth/logout
	- POST /api/auth/refresh-token

Users (admin unless noted)
	- GET /api/users
	- GET /api/users/:id
	- GET /api/users/email/:email
	- PUT /api/users/:id
	- PATCH /api/users/:id/role
	- PATCH /api/users/:id/last-login
	- DELETE /api/users/:id

Students
	- POST /api/students/register
	- POST /api/students/login
	- GET /api/students
	- GET /api/students/:id
	- PUT /api/students/:id
	- DELETE /api/students/:id

Faculty
	- POST /api/faculty/register
	- POST /api/faculty/login
	- GET /api/faculty
	- GET /api/faculty/:id
	- PUT /api/faculty/:id
	- DELETE /api/faculty/:id

Departments
	- GET /api/departments

Attendance (class)
	- POST /api/attendance/class
	- GET /api/attendance/class/me

Leave Requests
	- POST /api/leave-requests
	- GET /api/leave-requests
	- PATCH /api/leave-requests/:id/status

## Notes

- All protected routes expect a Bearer token in the Authorization header.
- Role checks are enforced in the route middleware.
- The client UI currently uses mock data; wire real API calls as you integrate.
