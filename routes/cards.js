const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addLikeCard);
router.delete('/cards/:cardId/likes', removeLikeCard);

module.exports = router;
