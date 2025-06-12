const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const createStaff = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('staff123', salt);

    // Create staff user
    const [user, created] = await User.findOrCreate({
      where: { email: 'staff@meditrack.com' },
      defaults: {
        email: 'staff@meditrack.com',
        password: hashedPassword,
        role: 'staff',
        status: 'active'
      }
    });

    if (created) {
      console.log('Staff user created successfully!');
    } else {
      // Update existing user to ensure it has staff privileges
      user.password = hashedPassword;
      user.role = 'staff';
      user.status = 'active';
      await user.save();
      console.log('Existing staff user updated!');
    }
    
    console.log('Email: staff@meditrack.com');
    console.log('Password: staff123');
    
  } catch (error) {
    console.error('Error creating staff user:', error);
  } finally {
    await sequelize.close();
  }
};

createStaff();
