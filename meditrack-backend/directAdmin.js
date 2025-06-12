const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');
const { User } = require('./models');
const config = require('./config/config.json').development;

const createAdmin = async () => {
  try {
    // Force sync to ensure tables exist
    await sequelize.sync({ force: false });
    
    console.log('Connection to database has been established successfully.');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@meditrack.com' },
      defaults: {
        email: 'admin@meditrack.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      }
    });

    if (created) {
      console.log('Admin user created successfully!');
    } else {
      // Update existing user to ensure it has admin privileges
      user.password = hashedPassword;
      user.role = 'admin';
      user.status = 'active';
      await user.save();
      console.log('Existing admin user updated!');
    }
    
    console.log('Email: admin@meditrack.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
