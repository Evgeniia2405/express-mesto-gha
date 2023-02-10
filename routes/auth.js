const router = require('express').Router();

const {
  createUser,
  login,
} = require('../controllers/users');

const {
  objectSignUpValidator,
  objectSignInValidator,
} = require('../validators/authCelebrate');

router.post('/signup', objectSignUpValidator, createUser);

router.post('/signin', objectSignInValidator, login);

module.exports = router;
