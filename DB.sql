CREATE DATABASE Login_user;
USE Login_user;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,

  role ENUM('admin', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER //

-- CREATE
CREATE PROCEDURE create_user (
  IN p_name VARCHAR(100),
  IN p_email VARCHAR(150),
  IN p_password VARCHAR(255),
  IN p_role ENUM('admin','user')
)
BEGIN
  INSERT INTO users (name, email, password, role)
  VALUES (p_name, p_email, p_password, p_role);
END //

-- READ ALL
CREATE PROCEDURE get_all_users ()
BEGIN
  SELECT * FROM users;
END //

-- READ ONE
CREATE PROCEDURE get_user_by_id (
  IN p_id INT
)
BEGIN
  SELECT * FROM users WHERE id = p_id;
END //

-- UPDATE ✅ FIXED
CREATE PROCEDURE update_user (
  IN p_id INT,
  IN p_role ENUM('admin','user'),
  IN p_status ENUM('active','inactive','blocked')
)
BEGIN
  UPDATE users
  SET 
    role = p_role,
    status = p_status
  WHERE id = p_id;
END //

-- DELETE
CREATE PROCEDURE delete_user (
  IN p_id INT
)
BEGIN
  DELETE FROM users WHERE id = p_id;
END //

DELIMITER ;