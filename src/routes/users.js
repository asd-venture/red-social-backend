const { Router } = require('express');
const router = Router();

const { getUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser } = require('../controllers/users.controller');

router.get('/users', getUsers);
router.get('/users/id/:id', getUserById);
router.get('/users/email/:email', getUserByEmail)
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;