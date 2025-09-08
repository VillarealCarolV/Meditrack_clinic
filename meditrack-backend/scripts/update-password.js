const { sequelize } = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database.');

    // Find the user
    const user = await User.findOne({ where: { email: 'staff@meditrack.com' } });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash('staff123', 10);
    
    // Update the password
    user.password = hashedPassword;
    await user.save();
    
    console.log('Password updated successfully');
    console.log('New password hash:', user.password);
    
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}

updatePassword();
