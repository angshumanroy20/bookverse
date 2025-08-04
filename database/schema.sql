CREATE DATABASE IF NOT EXISTS bookverse;

USE bookverse;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  cover VARCHAR(255), -- URL or path to image
  file_path VARCHAR(255) -- Path to the book file (e.g., PDF)
);

-- Sample Data
INSERT INTO books (title, author, cover, file_path) VALUES
('Pride and Prejudice', 'Jane Austen', 'http://example.com/cover1.jpg', '/uploads/pride-and-prejudice.pdf'),
('Moby-Dick', 'Herman Melville', 'http://example.com/cover2.jpg', '/uploads/moby-dick.pdf');

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
