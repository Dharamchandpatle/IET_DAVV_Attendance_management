# IET DAVV Attendance Management System

A full-stack web application for managing users, students, and faculty at IET DAVV. The project is split into a React (Vite) client and a Node.js/Express API server backed by MySQL.

## Status

- The UI currently uses mock data for most screens (auth, dashboards, attendance). API wiring is ready but not fully integrated.
- The server provides JWT-based auth plus user, student, and faculty management endpoints.

## Tech Stack

- Client: React 19, Vite, React Router, React Query, Tailwind CSS, Radix UI, Framer Motion.
- Server: Node.js, Express, MySQL, JWT, bcrypt.

## Project Structure

- client: Frontend application (Vite + React).
- server: Express API server and MySQL integration.

## Prerequisites

- Node.js 18+ and npm
- MySQL 8+

## Getting Started

1. Database setup
   - Run the SQL schema in server/config/database.sql.

2. Server setup
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. Client setup
   ```bash
   cd client
   npm install
   npm run dev
   ```

The server defaults to port 5000. Vite defaults to port 5173.

## Environment Variables (server/.env)

```bash
DB_HOST=localhost
DB_NAME=iet_attendance
DB_USER=root
DB_PASS=your_password
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Server API Overview

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

## Notes

- Protected routes expect a Bearer token in the Authorization header.
- Role checks are enforced by middleware on the server.
- Replace the mocked client data with real API calls when you are ready.

## Scripts

Client
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

Server
```bash
npm run dev      # Start with nodemon
npm run start    # Start server
```

## License

Add your license information here.
