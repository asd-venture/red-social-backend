const { Router } = require('express');
const router = Router();

const { getLikes, getLikeById, createLike, deleteLike } = require('../controllers/likes.controller');

router.get('/likes', getLikes);
router.get('/likes/:id', getLikeById);
router.post('/likes', createLike);
router.put('/likes/:id', deleteLike);

module.exports = router;