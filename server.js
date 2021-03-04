const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const methodOverride = require('method-override');

const app = express();
app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.log(error));
//Line above makes sure an error message shows up for any errors.

const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); //Changes the setting of how we render html to use ejs.
app.use(methodOverride('_method'));

// Sets Index.ejs as our homepage
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM books;';
  client.query(sql)
    .then(result => {
      let allBooks = result.rows;
      // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', allBooks);
      res.render('./pages/index.ejs', { bookList: allBooks });
    });
});

app.get('/search', renderSearchResults);
app.post('/searches', handleGetBooks);
app.get('/books/:id', singleBookDetails);
app.post('/books', savedBooks);
app.put('/books/:id', updateBooks);
app.delete('/books/:id', deleteBooks);
app.get(`*`, handleError);

function handleGetBooks(req, res) {
  const searchQuery = req.body.input;
  const searchType = req.body.type;
  // console.log('this is the body', req.body);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (searchType === 'title') {
    url += `intitle=${searchQuery}`;
  }
  if (searchType === 'author') {
    url += `inauthor=${searchQuery}`;
  }
  superagent.get(url)
    .then(booksData => {
      const bookArray = booksData.body.items;
      const finalBooksArray = bookArray.map(newBook => new Book(newBook.volumeInfo));
      console.log(' ????????????????????????????????????????????????????????????????????????', finalBooksArray);
      res.render('pages/searches/show.ejs', { finalBooksArray: finalBooksArray });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error loading books data');
    });
}

function renderSearchResults(req, res) {
  res.render('pages/searches/new.ejs');
}

function handleError(error, res) {
  // console.log(error);
  res.render('pages/error.ejs', { error: error });

}
function singleBookDetails(req, res) {
  const id = req.params.id;
  // console.log('single book details: ', id);
  const sql = 'SELECT * FROM books WHERE id=$1;';
  const storedValues = [id];
  client.query(sql, storedValues).then((results) => {
    const chosenOne = results.rows[0];
    res.render('pages/books/detail', { chosenOne: chosenOne });
  });
}
function savedBooks(req, res) {
  const { author, title, isbn, image_url, description } = req.body;
  // console.log('Anything HERE', req.body);
  const sql = 'INSERT INTO books (author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
  const storedValues = [author, title, isbn, image_url, description];
  client.query(sql, storedValues)
    .then(results => {
      const id = results.rows[0].id;
      // console.log('This data from savedBooks function', results);
      res.redirect(`books/${results.rows[0].id}`);
    });
}
function updateBooks(req, res) {
  const id = req.params.id;
  const {author, title, isbn, image_url, description} = req.body;
  let sql = 'UPDATE books SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5 WHERE id=$6';
  let storedValues = [author, title, isbn, image_url, description, id];
  client.query(sql, storedValues);
  res.status(200).redirect(`/books${id}`);
}

function deleteBooks(req, res) {
  const id = req.params.id;
  let sql = 'DELETE FROM books WHERE id=$1';
  let storedValues = [id];
  client.query(sql, storedValues);
  res.status(200).redirect('../');
}

function Book(object) {
  this.title = object.title;
  this.author = object.authors;
  this.description = object.description;
  this.image = object.imageLinks.thumbnail || 'no image found';
  this.isbn = object.industryIdentifiers[0].identifier;
}

client.connect().then(() => {
  app.listen(PORT, () => console.log(`app is alive ${PORT}`));
});
