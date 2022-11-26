const { Router } = require('express');
const router = Router();

const { getPosts, createPost, getPostsById, updatePost, deletePost } = require('../controllers/posts.controller');

router.get('/posts', getPosts);
router.get('/posts/:id', getPostsById);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router;