const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();
const port = 3000;


app.set('view engine', 'pug'); // pug as a template engine
app.set('views', './views'); 

app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));// view static

app.get('/', (req, res) => {
  res.render('index', { title: 'JJB TEAM'});
});
app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
