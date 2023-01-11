const { Router } = require('express');
const router = Router();
const fileUpload = require('express-fileupload');

const { getPosts, getPostById, getPostsByUserId, createPost, updatePost, deletePost } = require('../controllers/posts.controller');

router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:userid', getPostsByUserId);
router.post('/posts', fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}), createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router;