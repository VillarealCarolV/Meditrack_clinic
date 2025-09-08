require('dotenv').config();
const { sequelize } = require('../models');
const NotificationService = require('../services/notificationService');

async function testNotifications() {
  try {
    // Test user ID - replace with an actual user ID from your database
    const testUserId = '00000000-0000-0000-0000-000000000001';
    
    console.log('Testing notification system...');
    
    // Test creating a notification
    console.log('\n1. Creating test notification...');
    const notification = await NotificationService.createNotification(
      testUserId,
      'TEST_NOTIFICATION',
      'Test Notification',
      'This is a test notification',
      { test: true, timestamp: new Date().toISOString() }
    );
    console.log('Notification created:', JSON.stringify(notification.toJSON(), null, 2));
    
    // Test getting unread notifications
    console.log('\n2. Fetching unread notifications...');
    const unread = await NotificationService.getUnreadNotifications(testUserId);
    console.log(`Found ${unread.length} unread notifications`);
    
    if (unread.length > 0) {
      // Test marking notifications as read
      console.log('\n3. Marking notifications as read...');
      const notificationIds = unread.map(n => n.id);
      await NotificationService.markAsRead(notificationIds, testUserId);
      console.log(`Marked ${notificationIds.length} notifications as read`);
      
      // Verify notifications are marked as read
      const updatedUnread = await NotificationService.getUnreadNotifications(testUserId);
      console.log(`Now there are ${updatedUnread.length} unread notifications`);
    }
    
    console.log('\nNotification system test completed successfully!');
  } catch (error) {
    console.error('Error testing notification system:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the test
testNotifications();
