const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

// const PARKS_API_KEY = process.env.PARKS_API_KEY;


const app = express();
app.use(cors());


const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

app.get('/health', handleHealthRequest);
function handleHealthRequest(req, res) {
  console.log(handleHealthRequest);
  const ejsObject = { teacher: 'nicholas', course: '301d71', funFactor: 7 };
  res.render('pages/index.ejs', ejsObject);
}

app.get('/books', handleGetBooks);
function handleGetBooks(req, res) {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=search+inauthor`)
    .then(booksData => {
      console.log(booksData.body.items);
      const booksArray = booksData.body.items.map(newBook => new Book(newBook));
      res.render('./pages/searches/new.ejs', booksArray);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error loading books data');
    });
}
function Book(object) {
  this.title = object.title;
  this.author = object.authors;
}


app.listen(PORT, () => console.log(`app is alive ${PORT}`));
