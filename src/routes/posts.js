const { Router } = require('express');
const router = Router();

const { getPosts, getPostsById, getPostsByUserId, createPost, updatePost, deletePost } = require('../controllers/posts.controller');

router.get('/posts', getPosts);
router.get('/posts/:id', getPostsById);
router.get('/posts/user/:userid', getPostsByUserId);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router;