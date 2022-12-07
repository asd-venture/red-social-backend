const { Router } = require('express');
const router = Router();

const { getComments, getCommentById, getCommentsByUserId, getCommentsByPostId, createComment, updateComment, deleteComment } = require('../controllers/comments.controller');

router.get('/comments', getComments);
router.get('/comments/user/:userid', getCommentsByUserId);
router.get('/comments/post/:postid', getCommentsByPostId);
router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

module.exports = router;