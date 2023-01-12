const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { DATA_NOT_FOUND_ERROR_CODE } = require('./utils/errorCode');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT = 3000 } = process.env;
const app = express();
// const path = require('path');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

const userId = {
  _id: '63bffb2e5c1e251375b979ea',
};

// app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = userId;

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Ошибка 404: несуществующая страница' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
