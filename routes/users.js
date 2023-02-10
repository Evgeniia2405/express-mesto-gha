const router = require('express').Router();

const {
  getUsers,
  getUserMe,
  getUserById,
  editUserInfo,
  editUserAvatar,
} = require('../controllers/users');

const {
  objectUserIdValidator,
  objectUserValidator,
  objectUserAvatarValidator,
} = require('../validators/usersCelebrate');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);
router.get('/users/:userId', objectUserIdValidator, getUserById);

router.patch('/users/me', objectUserValidator, editUserInfo);

router.patch('/users/me/avatar', objectUserAvatarValidator, editUserAvatar);

module.exports = router;
