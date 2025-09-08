const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all notifications for the current user
router.get('/', notificationController.getNotifications);

// Mark notifications as read
router.post('/mark-read', notificationController.markAsRead);

// Get notification statistics (unread count)
router.get('/stats', notificationController.getNotificationStats);

module.exports = router;
