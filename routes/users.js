const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/:userId', auth, userCtrl.getOneUser);
router.put('/:userId', auth, userCtrl.modifyUser);
router.delete('/:userId', auth, userCtrl.deleteUser);
router.get('/:userId/post', auth, userCtrl.getPostsWithUserId);
router.put('/:userId/password', auth, userCtrl.modifyUserPassword);
module.exports = router;
