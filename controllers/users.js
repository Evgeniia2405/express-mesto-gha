const bcrypt = require('bcrypt'); // импортируем bcrypt
const User = require('../models/user');

const { generateToken } = require('../utils/jwt');

const ConflictError = require('../errors/conflict-err');
const IncorrectError = require('../errors/incorrect-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const {
  SOLT_ROUNDS,
} = require('../utils/constants');

const {
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../utils/errorCode');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные пользователя'));
    }
    if (err.message === 'not found') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    }
    next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные пользователя'));
    }
    if (err.message === 'not found') {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const userNew = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.send({
      name: userNew.name,
      about: userNew.about,
      avatar: userNew.avatar,
      email: userNew.email,
      id: userNew._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new IncorrectError('Переданы некорректные данные при создании пользователя'));
    }
    if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // хеши не совпали — отклоняем промис
      throw new UnauthorizedError('Неправильные почта или пароль');
    }
    // аутентификация успешна
    const token = generateToken({ _id: user._id });
    res.send({ message: 'Всё верно!', token });
  } catch (err) {
    next(err);
  }
};

const editUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new IncorrectError('Переданы некорректные данные при обновлении профиля'));
    }
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные при обновлении профиля'));
    }
    next(err);
  }
};

const editUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new IncorrectError('Переданы некорректные данные при обновлении аватара'));
    }
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные при обновлении аватара'));
    }
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserMe,
  createUser,
  login,
  editUserInfo,
  editUserAvatar,
};
