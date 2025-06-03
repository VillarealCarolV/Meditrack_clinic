// Usage: node seedUser.js
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const User = require('./models/User');

async function seed() {
  await sequelize.sync();
  const adminPassword = await bcrypt.hash('admin123', 10);
  const ownerPassword = await bcrypt.hash('owner123', 10);
  // Admin
  try {
    await User.create({
      email: 'admin@emr.com',
      password: adminPassword,
      role: 'admin',
      status: 'active'
    });
    console.log('Seeded admin user: admin@emr.com / admin123');
  } catch (e) {
    console.log('Admin already exists, skipping.');
  }
  // Owner
  const existingOwner = await User.findOne({ where: { email: 'owner@emr.com' } });
  if (!existingOwner) {
    await User.create({
      email: 'owner@emr.com',
      password: ownerPassword,
      role: 'owner',
      status: 'active'
    });
    console.log('Seeded owner user: owner@emr.com / owner123');
  } else {
    console.log('Owner already exists, skipping.');
  }
  process.exit();
}

seed();
