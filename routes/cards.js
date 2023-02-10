const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

const {
  objectCardValidator,
  objectCardIdValidator,
} = require('../validators/cardsCelebrate');

router.get('/cards', getCards);

router.post('/cards', objectCardValidator, createCard);

router.delete('/cards/:cardId', objectCardIdValidator, deleteCard);

router.put('/cards/:cardId/likes', objectCardIdValidator, addLikeCard);

router.delete('/cards/:cardId/likes', objectCardIdValidator, removeLikeCard);

module.exports = router;
