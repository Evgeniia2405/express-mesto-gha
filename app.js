const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
dotenv.config();

const app = express();
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

app.use(cors);

app.use(requestLogger); // подключаем логгер запросов

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(limiter);

mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Ошибка 404: несуществующая страница'));
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(centralErrorHandler);

async function connect() {
  await mongoose.connect(MONGO_URL, {});
  console.log(`Server connect db ${MONGO_URL}`);
  await app.listen(PORT);
  console.log(`Server listen port ${PORT}`);
}

connect();
