CREATE TABLE TEACHERS (
  id INT PRIMARY KEY AUTO_INCREMENT,
  last_name VARCHAR(40),
  first_name VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SESSIONS (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  description VARCHAR(2000),
  date TIMESTAMP,
  teacher_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE USERS (
  id INT PRIMARY KEY AUTO_INCREMENT,
  last_name VARCHAR(40),
  first_name VARCHAR(40),
  admin BOOLEAN NOT NULL DEFAULT false,
  email VARCHAR(255),
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PARTICIPATE (
  user_id INT,
  session_id INT
);