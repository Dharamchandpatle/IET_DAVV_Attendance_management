-- Migration: 2026-05-20
-- Adds enrollment_no to students, employee_number to faculty,
-- removes profile_image from users, and ensures attendance_records has metadata columns.

-- Remove profile_image from users if present
ALTER TABLE users DROP COLUMN IF EXISTS profile_image;

-- Add enrollment_no to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_no VARCHAR(50) UNIQUE;

-- Add employee_number to faculty
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS employee_number VARCHAR(50) DEFAULT NULL;

-- Create attendance_records table if it does not exist (normalized attendance storage)
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
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_attendance (course_assignment_id, student_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add missing columns to attendance_records if table pre-exists
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS course_id INT DEFAULT NULL;
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS faculty_id INT DEFAULT NULL;
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS semester INT DEFAULT NULL;
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS academic_year VARCHAR(9) DEFAULT NULL;

-- Note: Foreign key constraints are not added automatically by this migration to avoid failing on existing data.
-- After running this migration, you may add FK constraints manually if desired, for example:
-- ALTER TABLE attendance_records ADD CONSTRAINT fk_att_rec_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

COMMIT;
