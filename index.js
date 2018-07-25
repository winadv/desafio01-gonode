const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});
app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

const idadeMiddleware = (req, res, next) => {
  const { nome, nascimento } = req.query;
  if (!nome || !nascimento) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { nome, nascimento } = req.body;
  const idade = moment().diff(nascimento, 'years', true);

  if (idade >= 18) {
    res.redirect(`/major?nome=${nome}&nascimento=${nascimento}`);
  } else {
    res.redirect(`/minor?nome=${nome}&nascimento=${nascimento}`);
  }
});
app.get('/major', idadeMiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('major', { nome });
});

app.get('/minor', idadeMiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('minor', { nome });
});

app.listen(3000);
