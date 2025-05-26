-- Reset database if exists
DROP DATABASE IF EXISTS iet_davv_db;
CREATE DATABASE iet_davv_db;
USE iet_davv_db;

-- Users table (for authentication and user management)
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin') NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT check_email_domain CHECK (email LIKE '%@ietdavv.edu.in'),
  UNIQUE INDEX email_idx (email),
  INDEX role_idx (role),
  INDEX auth_idx (email, password)
);

-- Department table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  head_faculty_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  roll_number VARCHAR(20) NOT NULL UNIQUE,
  department_id INT NOT NULL,
  semester INT NOT NULL,
  section VARCHAR(10) NOT NULL,
  admission_year INT NOT NULL,
  cgpa DECIMAL(4,2),
  address TEXT,
  guardian_name VARCHAR(255),
  guardian_phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  INDEX user_id_idx (user_id),
  INDEX department_id_idx (department_id)
);

-- Faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  faculty_code VARCHAR(20) NOT NULL UNIQUE,
  department_id INT NOT NULL,
  designation VARCHAR(100) NOT NULL,
  specialization TEXT,
  joining_date DATE NOT NULL,
  education_details JSON,
  address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  department_id INT NOT NULL,
  credits INT NOT NULL,
  description TEXT,
  syllabus_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
);

-- Course Assignments (Faculty assigned to courses)
CREATE TABLE IF NOT EXISTS course_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  faculty_id INT NOT NULL,
  section VARCHAR(10) NOT NULL,
  semester INT NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  schedule JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
  UNIQUE KEY unique_course_assignment (course_id, faculty_id, section, semester, academic_year)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late') NOT NULL DEFAULT 'absent',
  marked_by INT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_assignment_id) REFERENCES course_assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_attendance (course_assignment_id, student_id, date)
);

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  type ENUM('medical', 'personal', 'family', 'other') NOT NULL,
  document_urls JSON, -- Store array of document URLs
  status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  reviewed_by INT,
  review_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES faculty(id) ON DELETE SET NULL
);
-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_audience JSON NOT NULL, -- Array of roles or departments
  start_date DATE,
  end_date DATE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Holiday Calendar
CREATE TABLE IF NOT EXISTS holidays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type ENUM('national', 'state', 'institute') NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Attendance Policy
CREATE TABLE IF NOT EXISTS attendance_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_id INT NOT NULL,
  min_attendance_percentage INT NOT NULL DEFAULT 75,
  late_count_as_absent INT NOT NULL DEFAULT 3,
  consecutive_leaves_alert INT NOT NULL DEFAULT 3,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'warning', 'success', 'error') NOT NULL,
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSON NOT NULL,
  description TEXT,
  updated_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Token Blacklist for JWT invalidation
CREATE TABLE IF NOT EXISTS token_blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_signature VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  blacklisted_by INT,
  FOREIGN KEY (blacklisted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Initial Data Inserts
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) 
VALUES 
('theme_settings', '{"default": "light", "allowed": ["light", "dark"]}', 'Application theme settings', 1),
('notification_settings', '{"email": true, "push": false}', 'Default notification settings', 1),
('academic_year', '{"current": "2025-26", "start_month": 7}', 'Current academic year settings', 1);

-- Create indexes for better query performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_student_roll ON students(roll_number);
CREATE INDEX idx_faculty_code ON faculty(faculty_code);
CREATE INDEX idx_course_code ON courses(code);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Triggers for data integrity and automation
DELIMITER //

-- Trigger to update user's last_login
CREATE TRIGGER update_last_login_after_auth
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.last_login != OLD.last_login THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
        VALUES (NEW.id, 'login', 'user', NEW.id, JSON_OBJECT('last_login', NEW.last_login));
    END IF;
END//

-- Trigger to log leave request status changes
CREATE TRIGGER log_leave_request_status_change
AFTER UPDATE ON leave_requests
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            (SELECT user_id FROM students WHERE id = NEW.student_id),
            'Leave Request Update',
            CONCAT('Your leave request has been ', LOWER(NEW.status)),
            CASE 
                WHEN NEW.status = 'approved' THEN 'success'
                WHEN NEW.status = 'rejected' THEN 'error'
                ELSE 'info'
            END
        );
    END IF;
END//

-- Trigger to validate leave request dates
CREATE TRIGGER validate_leave_request_dates
BEFORE INSERT ON leave_requests
FOR EACH ROW
BEGIN
    IF NEW.end_date < NEW.start_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'End date cannot be earlier than start date';
    END IF;
END//

DELIMITER ;
-- Insert example department
INSERT INTO departments (name, code, description) 
VALUES ('Computer Engineering', 'CE', 'Department of Computer Engineering');

-- Insert example courses
INSERT INTO courses (code, name, department_id, credits, description)
VALUES 
('CS101', 'Introduction to Programming', 1, 4, 'Fundamentals of programming using Python'),
('CS102', 'Data Structures', 1, 4, 'Basic data structures and algorithms');

-- Insert default admin user (password: AdminPass@123)
INSERT INTO users (email, password, role, name)
VALUES ('admin@ietdavv.edu.in', '$2b$10$xxxxxxxxxxx', 'admin', 'Admin User');