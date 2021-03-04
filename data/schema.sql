DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(100),
  title VARCHAR(255),
  isbn VARCHAR(50),
  image_url VARCHAR(300),
  description TEXT
);

INSERT INTO books (author, title, isbn, image_url, description)  VALUES ('Dr Katrin Berndt', 'Heroism in the Harry Potter Series', '9781409478416', 'https://books.google.com/books/content?id=o-QCOFDHmPEC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 'Taking up the various conceptions of heroism that are conjured in the Harry Potter series, this collection examines the ways fictional heroism in the twenty-first century challenges the idealized forms of a somewhat simplistic masculinity associated with genres like the epic, romance and classic adventure story. The collections three sections address broad issues related to genre, Harry Potters development as the central heroic character and the question of who qualifies as a hero in the Harry Potter series. Among the topics are Harry Potter as both epic and postmodern hero, the series as a modern-day example of psychomachia, the series indebtedness to the Gothic tradition, Harrys development in the first six film adaptations, Harry Potter and the idea of the English gentleman, Hermione Grangers explicitly female version of heroism, adult role models in Harry Potter, and the complex depictions of heroism exhibited by the series minor characters. Together, the essays suggest that the Harry Potter novels rely on established generic, moral and popular codes to develop new and genuine ways of expressing what a globalized world has applauded as ethically exemplary models of heroism based on responsibility, courage, humility and kindness.');

INSERT INTO books (author, title, isbn, image_url, description)  VALUES ('S. Gunelius', 'Harry Potter', '9780230594104', 'https://books.google.com/books/content?id=abYKXvCwEToC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 'The Harry Potter books are the bestselling books of all time. In this fascinating study, Susan Gunelius analyzes every aspect of the brand phenomenon that is Harry Potter. Delving into price wars, box office revenue, and brand values, amongst other things, this is the story of the most incredible brand success there has ever been.');

INSERT INTO books (author, title, isbn, image_url, description)  VALUES ('Daniel H. Nexon', 'Harry Potter and International Relations', '0742539598', 'https://books.google.com/books/content?id=DKcWE3WXoj8C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api','Drawing on a range of historical and sociological sources, this work shows how aspects of Harrys world contain aspects of our own. It also includes chapters on the political economy of the franchise, and on the problems of studying popular culture.');