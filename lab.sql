CREATE DATABASE medicalLab;

USE medicalLab;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'LABORANT', 'DOCTOR') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE medicalLab;
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  birthday DATE,
  gender ENUM('MALE', 'FEMALE', 'OTHER'),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE medicalLab;
CREATE TABLE user_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  phone VARCHAR(20),
  address VARCHAR(255),
  birthday DATE,
  job_title VARCHAR(100),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

USE medicalLab;
ALTER TABLE users
	ADD COLUMN reset_otp VARCHAR(10),
	ADD COLUMN reset_otp_expires_at DATETIME;
    
USE medicalLab;
ALTER TABLE user_profile
	ADD UNIQUE (user_id);
    
USE medicalLab;
ALTER TABLE users
  DROP COLUMN fullName;
  
USE medicalLab;
DELIMITER $$

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO user_profile (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
END$$

DELIMITER ;

USE medicalLab;
ALTER TABLE users
ADD UNIQUE INDEX unique_email (email);

USE medicalLab;
ALTER TABLE patients
  MODIFY email VARCHAR(100) NOT NULL,
  MODIFY phone VARCHAR(20) NOT NULL,
  ADD personal_number VARCHAR(20) NOT NULL;
  
USE medicalLab;
CREATE TABLE test_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

USE medicalLab;
ALTER TABLE test_categories
	ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 15.00;
    
USE medicalLab;
CREATE TABLE test_panels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES test_categories(id)
);

USE medicalLab;
CREATE TABLE test_parameters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panel_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  unit VARCHAR(20),
  FOREIGN KEY (panel_id) REFERENCES test_panels(id)
);

USE medicalLab;
CREATE TABLE test_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  panel_id INT NOT NULL,
  tested_at DATE NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (panel_id) REFERENCES test_panels(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);


