const { sequelize, User, Notification } = require('../models');

// Configure Sequelize to use camelCase for timestamps
sequelize.options.define = {
  timestamps: true,
  underscored: false
};

async function testNotificationFlow() {
  try {
    console.log('🚀 Starting notification system test...');
    
    // 1. Create a test user (doctor)
    console.log('\n1. Creating test user...');
    const doctor = await User.create({
      email: `test.doctor.${Date.now()}@example.com`,
      password: 'test123', // In a real app, hash this password
      role: 'doctor',
      status: 'active'
      // Timestamps will be handled automatically by Sequelize
    });
    console.log(`✅ Created test doctor (ID: ${doctor.id}, Email: ${doctor.email})`);

    // 2. Create a notification for the user
    console.log('\n2. Creating test notification...');
    const notification = await Notification.create({
      id: require('crypto').randomUUID(),
      userId: doctor.id,
      type: 'APPOINTMENT_CONFIRMED',
      title: 'Appointment Confirmed',
      message: 'Your appointment has been confirmed for tomorrow at 2:00 PM',
      isRead: false,
      metadata: JSON.stringify({
        appointmentId: 123,
        date: '2025-08-29T14:00:00.000Z'
      })
    });
    console.log('✅ Created notification:', {
      id: notification.id,
      type: notification.type,
      title: notification.title
    });

    // 3. Retrieve unread notifications for the user
    console.log('\n3. Fetching unread notifications...');
    const unreadNotifications = await Notification.findAll({
      where: {
        userId: doctor.id,
        isRead: false
      },
      order: [['createdAt', 'DESC']]
    });
    console.log(`📨 Found ${unreadNotifications.length} unread notifications`);
    console.log(JSON.stringify(
      unreadNotifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt
      })), 
      null, 
      2
    ));

    // 4. Mark notification as read
    if (unreadNotifications.length > 0) {
      console.log('\n4. Marking notification as read...');
      const notificationToUpdate = unreadNotifications[0];
      await notificationToUpdate.update({ isRead: true });
      console.log('✅ Notification marked as read');
      
      // Verify the update
      const updatedNotification = await Notification.findByPk(notificationToUpdate.id);
      console.log('🔍 Notification status:', {
        id: updatedNotification.id,
        isRead: updatedNotification.isRead,
        updatedAt: updatedNotification.updatedAt
      });
    }

    console.log('\n🎉 Notification system test completed successfully!');

  } catch (error) {
    console.error('❌ Error during notification test:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testNotificationFlow();
