const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const reactCtrl = require('../controllers/reacts');

router.post('/:postId/react', reactCtrl.createReact);
router.get('/:postId/react', reactCtrl.getAllReacts);
router.get('/:postId/react/:reactId', reactCtrl.getOneReact);
router.delete('/:postId/react/:reactId', reactCtrl.deleteReact);
router.put('/:postId/react/:reactId', reactCtrl.modifyReact);

module.exports = router;
