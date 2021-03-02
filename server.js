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
app.set('view engine', 'ejs');

// Sanity check page
// app.get('/health', handleHealthRequest);
// function handleHealthRequest(req, res) {
//   console.log(handleHealthRequest);
//   const ejsObject = { teacher: 'nicholas', course: '301d71', funFactor: 7 };
//   res.render('pages/index.ejs', ejsObject);
// }

app.get('/books', renderSearchPage);
app.post('/search', handleGetBooks);
function renderSearchPage(req, res){
  res.render('pages/searches/new.ejs');
}
function handleGetBooks(req, res) {
  const searchQuery = req.body.type;
  const searchType = req.body.type;
  console.log('this is the body', req.body);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if(searchType === 'title'){
    url += `intitle=${searchQuery}`;
  }
  if(searchType === 'author'){
    url += `inauthor=${searchQuery}`;
  }
  console.log(url);
  superagent.get(url)
    .then(booksData => {
      const bookArray = booksData.body.items;
      const finalBooksArray = bookArray.map(newBook => new Book(newBook.volumeInfo));
      console.log(bookArray + 'book array here');
      res.render('pages/searches/show.ejs', {finalBooksArray: finalBooksArray});
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error loading books data');
    });
}
function Book(object) {
  this.title = object.title;
  this.author = object.authors;
  this.description = object.description;
  this.image = object.imageLinks.thumbnail;
  console.log(this.description);
}


app.listen(PORT, () => console.log(`app is alive ${PORT}`));
