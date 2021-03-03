DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(100),
  title VARCHAR(255),
  isbn VARCHAR(50),
  image_url VARCHAR(300),
  description TEXT
);
