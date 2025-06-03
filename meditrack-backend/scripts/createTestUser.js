const bcrypt = require('bcryptjs');
const { User } = require('../models');

const createTestUser = async () => {
  try {
    const email = 'admin@example.com';
    const password = 'password123';
    const role = 'admin';
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', existingUser.toJSON());
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      status: 'active'
    });
    
    console.log('Test user created successfully:', user.toJSON());
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit();
  }
};

createTestUser();
