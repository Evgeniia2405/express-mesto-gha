const User = require('../models/user');
const { INCORRECT_DATA_ERROR_CODE, DATA_NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/errorCode');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные пользователя' });
    } else if (err.message === 'not found') {
      res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным id не найден' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const editUserInfo = async (req, res) => {
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
    if (!user) throw res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const editUserAvatar = async (req, res) => {
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
    if (!user) throw res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUserInfo,
  editUserAvatar,
};
