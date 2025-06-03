const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUserStatus } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, getAllUsers); // GET /api/users
router.post('/', auth, createUser); // POST /api/users
router.patch('/:id/status', auth, updateUserStatus); // PATCH /api/users/:id/status

module.exports = router;
