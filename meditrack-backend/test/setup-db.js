const { Sequelize } = require('sequelize');
const testConfig = require('../config/test-db').testConfig;

// Create a connection to the MySQL server (without specifying a database)
const adminConnection = new Sequelize('mysql', testConfig.username, testConfig.password, {
  host: testConfig.host,
  dialect: 'mysql',
  logging: false
});

// Function to create the test database
const createTestDatabase = async () => {
  try {
    // Create the test database if it doesn't exist
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${testConfig.database}`);
    console.log(`Test database '${testConfig.database}' is ready.`);
    return true;
  } catch (error) {
    console.error('Error creating test database:', error);
    return false;
  } finally {
    await adminConnection.close();
  }
};

// Run the setup
createTestDatabase().then(success => {
  if (success) {
    console.log('Test database setup completed successfully.');
    process.exit(0);
  } else {
    console.error('Failed to set up test database.');
    process.exit(1);
  }
});
