const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserMe,
  // createUser,
  // login,
  editUserInfo,
  editUserAvatar,
} = require('../controllers/users');

// router.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string(),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), createUser);
// router.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), login);
router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserMe);
// router.get('/users/:userId', auth, getUserById);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi),
  }),
}), auth, editUserAvatar);

module.exports = router;
