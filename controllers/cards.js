const Card = require('../models/card');
const { INCORRECT_DATA_ERROR_CODE, DATA_NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/errorCode');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate('owner');
    res.send(cards);
  } catch {
    res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) throw res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные карточки' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const addLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) throw res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные карточки' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const removeLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) throw res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные карточки' });
    } else {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};
