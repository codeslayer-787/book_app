const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
// const { res } = require('express');


// const PARKS_API_KEY = process.env.PARKS_API_KEY;


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

// Sets Index.ejs as our homepage
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM books;';
  client.query(sql)
    .then(result => {
      let allBooks = result.rows;
      res.render('./pages/index.ejs', { bookList: allBooks });
    });
});

app.get('/books', renderSearchPage);
app.post('/search', handleGetBooks);
app.get('/books/:id', singleBookDetails);

app.get(`*`, handleError);
function renderSearchPage(req, res) {
  res.render('pages/searches/new.ejs');
}
function handleGetBooks(req, res) {
  const searchQuery = req.body.input;
  const searchType = req.body.type;
  console.log('this is the body', req.body);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (searchType === 'title') {
    url += `intitle=${searchQuery}`;
  }
  if (searchType === 'author') {
    url += `inauthor=${searchQuery}`;
  }
  console.log(url);
  superagent.get(url)
    .then(booksData => {
      const bookArray = booksData.body.items;
      const finalBooksArray = bookArray.map(newBook => new Book(newBook.volumeInfo));
      console.log(bookArray + 'book array here');
      res.render('pages/searches/show.ejs', { finalBooksArray: finalBooksArray });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error loading books data');
    });
}

function handleError(error, res) {
  console.log(error);
  res.render('pages/error', { error: error });

}
function singleBookDetails(req, res) {
  const id = req.params.id;
  console.log('single book details: ', id);
  const sql = 'SELECT * FROM books WHERE id=$1;';
  const storedValues = [id];
  client.query(sql, storedValues).then((results) => {
    console.log(results.rows[0]);
    const chosenOne = results.rows[0];
    res.render('pages/books/detail', { chosenOne: chosenOne });
  });
}



function Book(object) {
  this.title = object.title;
  this.author = object.authors;
  this.description = object.description;
  this.image = object.imageLinks.thumbnail;
  this.isbn = object.industryIdentifiers[0].identifier;
  console.log(this.isbn, 'need isbn');
}

client.connect().then(() => {
  app.listen(PORT, () => console.log(`app is alive ${PORT}`));
});
