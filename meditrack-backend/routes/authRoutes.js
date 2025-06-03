const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.post('/login', login);
router.get('/me', auth, getProfile);

module.exports = router;
