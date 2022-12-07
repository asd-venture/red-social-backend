const { Router } = require('express');
const router = Router();

const { getLikes, getLikeById, getLikesByUserId, getLikesByPostId, createLike, deleteLike } = require('../controllers/likes.controller');

router.get('/likes', getLikes);
router.get('/likes/user/:userid', getLikesByUserId);
router.get('/likes/post/:postid', getLikesByPostId);
router.post('/likes', createLike);
router.delete('/likes/:id', deleteLike);

module.exports = router;