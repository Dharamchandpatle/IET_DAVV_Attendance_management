#!/bin/bash

echo "College Attendance System Project Structure"
echo "==========================================="
echo ""
echo "server/"
echo "├── package.json"
echo "├── .env"
echo "└── src/"
echo "    ├── config/"
echo "    │   ├── db.js"
echo "    │   └── database.sql"
echo "    ├── controllers/"
echo "    │   ├── authController.js"
echo "    │   ├── studentController.js"
echo "    │   ├── facultyController.js"
echo "    │   └── adminController.js"
echo "    ├── middleware/"
echo "    │   └── auth.js"
echo "    ├── models/"
echo "    │   ├── userModel.js"
echo "    │   ├── studentModel.js"
echo "    │   ├── facultyModel.js"
echo "    │   └── adminModel.js"
echo "    ├── routes/"
echo "    │   ├── authRoutes.js"
echo "    │   ├── studentRoutes.js"
echo "    │   ├── facultyRoutes.js"
echo "    │   └── adminRoutes.js"
echo "    └── server.js"
echo ""
echo "client/"
echo "├── package.json"
echo "├── .env"
echo "├── tailwind.config.js"
echo "└── src/"
echo "    ├── components/"
echo "    │   ├── ui/"
echo "    │   │   ├── button.jsx"
echo "    │   │   └── card.jsx"
echo "    │   └── layout/"
echo "    │       └── DashboardLayout.jsx"
echo "    ├── context/"
echo "    │   └── AuthContext.jsx"
echo "    ├── lib/"
echo "    │   └── utils.js"
echo "    ├── pages/"
echo "    │   ├── Login.jsx"
echo "    │   ├── ForgotPassword.jsx"
echo "    │   ├── student/"
echo "    │   │   ├── StudentDashboard.jsx"
echo "    │   │   ├── StudentAttendance.jsx"
echo "    │   │   ├── LeaveRequests.jsx"
echo "    │   │   ├── Holidays.jsx"
echo "    │   │   └── StudentProfile.jsx"
echo "    │   ├── faculty/"
echo "    │   │   ├── FacultyDashboard.jsx"
echo "    │   │   ├── FacultyClasses.jsx"
echo "    │   │   ├── MarkAttendance.jsx"
echo "    │   │   ├── FacultyExams.jsx"
echo "    │   │   ├── FacultyLeaveRequests.jsx"
echo "    │   │   └── FacultyProfile.jsx"
echo "    │   └── admin/"
echo "    │       ├── AdminDashboard.jsx"
echo "    │       ├── ManageStudents.jsx"
echo "    │       ├── ManageFaculty.jsx"
echo "    │       ├── ManageCourses.jsx"
echo "    │       ├── ManageClasses.jsx"
echo "    │       ├── ManageExams.jsx"
echo "    │       ├── ManageHolidays.jsx"
echo "    │       ├── AttendanceReports.jsx"
echo "    │       └── AdminSettings.jsx"
echo "    ├── App.jsx"
echo "    └── index.js"

# Backend structure
mkdir -p server/src/controllers
mkdir -p server/src/models
mkdir -p server/src/routes
mkdir -p server/src/middleware
mkdir -p server/src/config
mkdir -p server/src/utils

# Frontend structure
mkdir -p client/src/components
mkdir -p client/src/pages
mkdir -p client/src/context
mkdir -p client/src/hooks
mkdir -p client/src/lib
mkdir -p client/src/utils
mkdir -p client/src/assets 