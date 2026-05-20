# Authentication System Setup Guide

## Overview
Your authentication system has been fully updated with:
- ✅ React Toastify for notifications (replaces custom toast)
- ✅ Simplified authentication code
- ✅ Complete client-server integration
- ✅ Database integration for all roles (Student, Faculty, Admin)
- ✅ JWT token-based authentication
- ✅ Persistent user sessions

## Installation Steps

### 1. Install Client Dependencies
```bash
cd client
npm install
```

### 2. Install react-toastify
```bash
npm install react-toastify@10.0.3
```

### 3. Set Up Environment Variables

**Client (.env):**
```
VITE_API_BASE_URL=http://localhost:5000
```

**Server (.env):**
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=iet_davv_db
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 4. Database Setup
```bash
# Create database
mysql -u root -p < server/config/database.sql
```

### 5. Start the Server
```bash
cd server
npm install
npm run dev
```

### 6. Start the Client
```bash
cd client
npm run dev
```

## File Changes Summary

### Client Side
1. **package.json** - Added react-toastify dependency
2. **src/components/ui/Toaster.jsx** - New toaster provider component
3. **src/context/AuthContext.jsx** - Updated to use react-toastify
4. **src/pages/Login.jsx** - Updated to use react-toastify
5. **src/pages/Register.jsx** - Updated to use react-toastify
6. **src/App.jsx** - Updated to use ToasterProvider

### Server Side
1. **server/services/authService.js** - Simplified auth logic with proper DB integration
2. **server/controllers/authController.js** - Cleaned up controller

## Authentication Flow

### Registration
```
1. User fills registration form (name, email, password, role, etc.)
2. Client validates form data
3. Server validates and checks for duplicate email/roll number
4. Password is hashed with bcryptjs
5. User record created in database with role-specific data
6. JWT token generated
7. Success toast shown
8. User redirected to login
```

### Login
```
1. User enters email, password, and role
2. Server finds user by email
3. Password compared with stored hash
4. JWT token generated and returned
5. Token stored in localStorage
6. User data stored in context
7. Success toast shown
8. User redirected to role-based dashboard
```

### Token Persistence
```
- Token stored in localStorage as part of auth object
- Token automatically attached to all API requests
- Automatic logout on 401/403 errors
- Session persists across browser refresh
```

## Testing the System

### Test Student Registration
```
- Email: student@ietdavv.edu.in
- Password: Password123!
- Roll Number: CS001
- Department: Select from dropdown
- Semester: 1
- Section: A
```

### Test Faculty Registration
```
- Email: faculty@ietdavv.edu.in
- Password: Password123!
- Faculty Code: FAC001
- Department: Select from dropdown
- Designation: Assistant Professor
- Joining Date: 2024-01-01
```

### Test Login
```
- Use registered email and password
- Select correct role
- Should see dashboard based on role
```

## Key Features

✅ **Email Validation** - Must end with @ietdavv.edu.in
✅ **Password Security** - Minimum 8 characters, bcryptjs hashing
✅ **Duplicate Prevention** - Email, roll number, faculty code unique
✅ **Role-based Access** - Student, Faculty, Admin with different dashboards
✅ **Database Integration** - All data persisted to MySQL
✅ **Toast Notifications** - Success/error messages with react-toastify
✅ **JWT Tokens** - Secure token-based authentication
✅ **Session Persistence** - localStorage for auth data
✅ **Error Handling** - Comprehensive error messages

## Troubleshooting

### "Email must end with @ietdavv.edu.in"
- Ensure you're using the correct institutional email domain

### "Password must be at least 8 characters"
- Enter a password with minimum 8 characters

### "Email already exists"
- Use a different email address
- Check if you already registered

### "Invalid credentials"
- Verify email and password are correct
- Ensure role selection matches registered role

### Database connection errors
- Check MySQL is running
- Verify DB credentials in .env
- Ensure database is created: `iet_davv_db`

### CORS errors
- Verify server is running on port 5000
- Check VITE_API_BASE_URL is correct

## API Endpoints

### POST /api/auth/register
```json
Request: {
  "name": "Student Name",
  "email": "student@ietdavv.edu.in",
  "password": "SecurePass123",
  "role": "student",
  "roll_number": "CS001",
  "department_id": 1,
  "semester": 1,
  "section": "A",
  "admission_year": 2023
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": { user_object }
  }
}
```

### POST /api/auth/login
```json
Request: {
  "email": "student@ietdavv.edu.in",
  "password": "SecurePass123",
  "role": "student"
}

Response: {
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": { user_object }
  }
}
```

### POST /api/auth/logout
```json
Response: {
  "success": true,
  "message": "Logout successful"
}
```

## Next Steps

1. Install dependencies: `npm install` in both client and server
2. Set up .env files
3. Create database: `mysql -u root -p < server/config/database.sql`
4. Test registration and login
5. Verify toasts appear correctly
6. Check database records are created

Happy coding! 🚀
