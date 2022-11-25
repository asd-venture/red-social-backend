const { Router } = require('express');
const router = Router();

const { getPosts, createPost, getPostsById } = require('../controllers/posts.controller');

router.get('/posts', getPosts);
router.get('/posts/:id', getPostsById);
router.post('/posts', createPost);

module.exports = router;