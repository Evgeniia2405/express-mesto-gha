const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const IncorrectError = require('../errors/incorrect-err');
const NotFoundError = require('../errors/not-found-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate('owner likes');
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    await card.populate('owner likes');
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new IncorrectError('Переданы некорректные данные при создании карточки');
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) throw new NotFoundError('Карточка с указанным _id не найдена');
    if (card.owner._id.toString() !== req.user._id) throw new ForbiddenError('Это карточка другого пользователя, вы не можете ее удалить');
    await card.delete();
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные карточки'));
    }
    next(err);
  }
};

const addLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).populate('owner likes');
    if (!card) throw new NotFoundError('Передан несуществующий _id карточки');
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные карточки'));
    }
    next(err);
  }
};

const removeLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate('owner likes');
    if (!card) throw new NotFoundError('Карточка с указанным _id не найдена');
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectError('Переданы некорректные данные карточки'));
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};
