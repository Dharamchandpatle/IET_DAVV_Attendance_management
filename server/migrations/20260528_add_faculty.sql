-- Migration: add faculty table if missing
-- Run this against your database or include it in your migration runner.

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

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE,

  FOREIGN KEY (department_id)
  REFERENCES departments(id)
  ON DELETE SET NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
