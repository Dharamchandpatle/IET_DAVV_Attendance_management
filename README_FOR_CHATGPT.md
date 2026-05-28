# IET_DAVV Attendance Management — Project Overview for ChatGPT

This document summarizes the full project (client + server + database) to help a language model or a new developer understand the repository layout, key files, how to run the app, and common places to look for issues.

**Quick Overview**
- **Client:** React + Vite app under `client/` (SPA with route-based lazy-loading, Tailwind CSS).
- **Server:** Node + Express API in `server/` (controllers → services → models pattern), MySQL database.
- **Auth:** JWT on server, client `AuthContext` for session handling.

**How to use this README**
- If you need help from ChatGPT, paste the relevant file path(s), the exact error messages, and the sequence of steps you ran (commands). Include snippet(s) of server logs or Vite console output when asking runtime questions.

**Top-level layout**
- `client/` — front-end app (run: `cd client && npm install && npm run dev`).
- `server/` — back-end API (run: `cd server && npm install && node index.js` or `npm start`).
- Markdown files: `README.md`, `AUTH_SETUP.md`, `DATABASE_INTEGRATION.md` (project docs).

**Client — important files & folders**
- `client/src/main.jsx` — React bootstrap (root render).
- `client/src/App.jsx` — Main router and lazy-loaded routes.
- `client/src/pages/` — All page routes organized into:
  - `client/src/pages/auth/` — `Login.jsx`, `Register.jsx` (auth pages)
  - `client/src/pages/admin/` — admin dashboard & management pages
  - `client/src/pages/faculty/` — faculty dashboard, `AttendancePage.jsx`, `FacultyProfile.jsx`
  - `client/src/pages/student/` — student dashboard, attendance view, leave pages
  - `client/src/LandingPage.jsx` — public landing.
- `client/src/components/` — reusable UI components (admin, student, faculty subfolders).
- `client/src/context/` — `AuthContext.jsx`, `ThemeContext.jsx` (global providers).
- `client/src/services/` — API wrappers and service modules (`api.js`, `authService.js`, `studentService.js`, `facultyService.js`, `attendanceService.js`, `leaveService.js`, `index.js` aggregator).
- `client/src/utils/routeLoader.js` — helper implementing `import.meta.glob` + `React.lazy` for nested lazy-loading.
- `client/src/styles/` & `client/src/index.css` — global styles and Tailwind config.
- `client/public/` — static assets served by Vite (manifest, icons). Images live under `client/src/assets/images`.

Client notes:
- Routes use `React.lazy` via `routeLoader.lazyLoad('auth/Login')` style paths.
- All lazy-loaded modules must export a default React component.
- If you see "Element type is invalid" errors, check `App.jsx` lazy paths and ensure matching files exist under `client/src/pages/` and export `default`.

**Server — important files & folders**
- `server/index.js` / `server/app.js` / `server/server.js` — server entry and Express app setup. Start here for middleware and port config. See [server/index.js](server/index.js).
- `server/config/db.js` — database connection (MySQL via `mysql2`).
- `server/config/env.js` — environment variable parsing wrapper (DB credentials, JWT secret).
- `server/controllers/` — `authController.js`, `attendanceController.js`, `studentController.js`, etc. Controllers parse requests and call services.
- `server/services/` — business logic and DB queries (separation from controllers keeps controllers thin).
- `server/models/` — Mongoose-like or simple JS models for `User`, `Student`, `Faculty` (shape and helper methods).
- `server/routes/` — Express routers wiring endpoints to controllers.
- `server/middleware/` — `authMiddleware.js` (JWT verification, role checks).
- `server/migrations/` — SQL migration files; example: `20260520_update_attendance.sql`.

Server notes:
- Authentication uses JWT: `authController` issues tokens, `authMiddleware` verifies on protected routes.
- Errors in API responses propagate JSON error objects; server logs are in the terminal where `node` is run.

**Database**
- The project uses MySQL. SQL setup scripts and schema notes are in `server/config/database.sql` and `server/migrations/`.
- Typical env vars required (place in `.env` or `server/.env`):
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`.

**Development commands**
- Run client dev server (hot reload):
```bash
cd client
npm install
npm run dev
```
- Run server locally:
```bash
cd server
npm install
node index.js
# or use npm start if configured
```

**Common troubleshooting steps**
- If Vite fails to lazy-load a route: confirm `client/src/utils/routeLoader.js` uses `import.meta.glob('../pages/**/*.jsx')` and the requested path `../pages/<path>.jsx` exists and exports default.
- If you see `Cannot convert object to primitive value` in console: check any custom objects placed into `console.log` that override `toString` / `Symbol.toPrimitive`.
- If API auth fails: verify `JWT_SECRET` matches between server and client expectations, and inspect the `Authorization` header format (`Bearer <token>`).

**How to ask ChatGPT about this project**
When asking for help about a runtime error or refactor, include:
- The exact command you ran (e.g., `cd client && npm run dev`).
- Full error output (copy-paste the Vite or Node stack trace).
- The relevant file paths (use exact paths from this repo) and short code snippets (5–30 lines) around where the error occurs.
- State what you expect to happen and what actually happened.

Example prompt to share with ChatGPT:
```
I'm running the client dev server (`cd client && npm run dev`) and see:
Error: Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function.
App uses `client/src/utils/routeLoader.js` and lazyLoad('auth/Login') — file exists at `client/src/pages/auth/Login.jsx`. Please check why lazy import returns undefined. Here are the first 30 lines of `Login.jsx`:
<paste the code snippet>
```

**Key files to inspect first for most issues**
- `client/src/App.jsx` — route wiring
- `client/src/utils/routeLoader.js` — lazy loader implementation
- `client/src/pages/**` — ensure each lazy page file exists and `export default` a component
- `server/routes/index.js` and `server/controllers/authController.js` — auth flow
- `server/config/db.js` — database connection errors

If you'd like, I can:
- Generate a single-file map of all `client/src/pages/**` paths (already available in the repo). 
- Search for any pages that still use named exports instead of `default` and convert them.

---
This README is intended to be machine- and human-friendly so you (or ChatGPT) can quickly locate code, reproduce errors, and reason about fixes. If you want, I can also generate a shorter "practical troubleshooting checklist" that you can paste into issues when asking for help.
