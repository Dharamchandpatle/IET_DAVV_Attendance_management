
-- ============================================
-- IET AMS FINAL DATABASE SCHEMA
-- ============================================

-- Updated IET AMS schema aligned with server models
-- Database: create or run within your DB. This script creates the schema expected by the server code.

SET FOREIGN_KEY_CHECKS = 0;

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','faculty','admin') NOT NULL DEFAULT 'student',
  phone VARCHAR(30) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  last_login TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Students (has its own id and references users.id)
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  enrollment_no VARCHAR(50) UNIQUE,
  roll_number VARCHAR(100) NOT NULL,
  department_id INT DEFAULT NULL,
  semester INT DEFAULT NULL,
  section VARCHAR(20) DEFAULT NULL,
  admission_year INT DEFAULT NULL,
  cgpa DECIMAL(4,2) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  guardian_name VARCHAR(255) DEFAULT NULL,
  guardian_phone VARCHAR(30) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Faculty
CREATE TABLE IF NOT EXISTS faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  faculty_code VARCHAR(100) DEFAULT NULL,
  employee_number VARCHAR(100) DEFAULT NULL,
  department_id INT DEFAULT NULL,
  designation VARCHAR(255) DEFAULT NULL,
  specialization VARCHAR(255) DEFAULT NULL,
  joining_date DATE DEFAULT NULL,
  education_details TEXT DEFAULT NULL,
  address TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(255) NOT NULL,
  subject_code VARCHAR(50) NOT NULL UNIQUE,
  semester INT DEFAULT NULL,
  department_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Attendance records (normalized). Server expects student_id referencing students.id
CREATE TABLE IF NOT EXISTS attendance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_assignment_id INT DEFAULT NULL,
  course_id INT DEFAULT NULL,
  faculty_id INT DEFAULT NULL,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  semester INT DEFAULT NULL,
  academic_year VARCHAR(9) DEFAULT NULL,
  status ENUM('present','absent','late') NOT NULL DEFAULT 'absent',
  marked_by INT NOT NULL,
  remarks TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (course_assignment_id, student_id, date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leave requests: server expects student_id, type, document_urls JSON text, reviewed metadata
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  type ENUM('medical','personal','family','other') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT DEFAULT NULL,
  status ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',
  review_comment TEXT DEFAULT NULL,
  reviewed_by INT DEFAULT NULL,
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  document_urls TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES faculty(id) ON DELETE SET NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: sample departments
INSERT IGNORE INTO departments (name, code) VALUES
  ('Computer Engineering','CE'),
  ('Information Technology','IT'),
  ('Electronics Engineering','EC'),
  ('Mechanical Engineering','ME');

SET FOREIGN_KEY_CHECKS = 1;


