const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
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
      console.log('Email: admin@meditrack.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
      console.log('Email: admin@meditrack.com');
      console.log('You can reset the password if needed.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
