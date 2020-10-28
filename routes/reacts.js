const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const reactCtrl = require('../controllers/reacts');

router.post('/:postId/react', auth, reactCtrl.createReact);
router.get('/:postId/react', auth, reactCtrl.getAllReacts);
router.get('/:postId/react/:reactId', auth, reactCtrl.getOneReact);
router.delete('/:postId/react/:reactId', auth, reactCtrl.deleteReact);
router.put('/:postId/react/:reactId', auth, reactCtrl.modifyReact);

module.exports = router;
