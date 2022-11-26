const { Router } = require('express');
const router = Router();

const { getComments, getCommentById, createComment, deleteComment, updateComment } = require('../controllers/comments.controller');

router.get('/comment', getComments);
router.get('/comment/:id', getCommentById);
router.post('/comment', createComment);
router.put('/comment/:id', deleteComment);
router.delete('/comment/:id', updateComment);

module.exports = router;