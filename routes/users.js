const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  editUserInfo,
  editUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', editUserInfo);
router.patch('/users/me/avatar', editUserAvatar);

module.exports = router;
