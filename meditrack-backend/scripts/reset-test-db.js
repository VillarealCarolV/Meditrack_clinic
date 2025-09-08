const { sequelize } = require('../config/database');

async function resetTestDatabase() {
  try {
    // Drop the test database
    await sequelize.query('DROP DATABASE IF EXISTS meditrack_test');
    
    // Recreate the test database
    await sequelize.query('CREATE DATABASE meditrack_test');
    
    console.log('Test database reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting test database:', error);
    process.exit(1);
  }
}

resetTestDatabase();
