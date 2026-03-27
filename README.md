# IET DAVV Attendance Management System

A full-stack attendance management platform for IET DAVV that streamlines academic administration for students, faculty, and administrators. The project is split into a React-based client and a Node.js/Express API server backed by MySQL.

## Highlights
- Role-based access for admin, faculty, and students.
- End-to-end attendance workflows with policies and analytics.
- Leave management, announcements, holidays, and notifications.
- Audit trails and configurable system settings.

## Features
- Authentication and authorization with JWT.
- Student and faculty management.
- Departments, courses, and faculty-course assignments.
- Class attendance marking and tracking.
- Attendance policies and thresholds.
- Leave requests with approval workflow.
- Announcements and holiday calendar.
- Notifications and audit logs.
- System settings for academic year and preferences.

## Tech Stack
- Client: React 18, React Router, React Query, Tailwind CSS, Radix UI.
- Server: Node.js, Express, MySQL, JWT, bcrypt.

## Project Structure
- client: Frontend application built with React and Tailwind CSS.
- server: REST API with Express and MySQL database integration.

## Client (Frontend)
### Key Modules
- Pages for authentication, dashboards, attendance, and management flows.
- Shared UI components and utility helpers.
- API client integration using Axios and React Query.

### Scripts
```bash
npm run start   # Run the development server
npm run build   # Build for production
npm run test    # Run tests
```

## Server (Backend)
### Core Capabilities
- REST API routes grouped by feature (auth, users, students, faculty, courses, attendance).
- Services and controllers for business logic separation.
- Middleware for auth, logging, and validation.
- SQL schema provided for database setup.

### Environment Variables
Create a .env file in the server folder:
```bash
DB_HOST=host
DB_NAME=db_name
DB_USER=root
DB_PASS=your_password
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Database Setup
- Use the SQL script in server/config/database.sql to initialize the database and seed defaults.

### Scripts
```bash
npm run dev     # Start with nodemon (update script if needed)
npm run start   # Start the API server (update script if needed)
```

Note: The current entry file is server/index.js. If needed, update server/package.json scripts to use index.js instead of server.js.

## Getting Started
### Prerequisites
- Node.js 18+ and npm
- MySQL 8+

### Setup
1. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
2. Install server dependencies:
   ```bash
   cd ../server
   npm install
   ```
3. Configure environment variables in server/.env.
4. Initialize the database with server/config/database.sql.
5. Start the server:
   ```bash
   node index.js
   ```
6. Start the client:
   ```bash
   cd ../client
   npm run start
   ```

## API Overview
The API is organized by feature routes under server/routes. Examples include:
- /api/auth
- /api/users
- /api/students
- /api/faculty
- /api/class-attendance

## Security Notes
- Keep your JWT secret private.
- Do not commit .env to version control.
- Use strong database credentials in production.

## License
Add your license information here.
