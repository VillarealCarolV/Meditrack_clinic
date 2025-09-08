// This is a completely isolated test file that doesn't depend on project structure
const { Sequelize, DataTypes } = require('sequelize');

// Test database configuration
const config = {
  database: 'meditrack_test',
  username: 'root',
  password: '',
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
};

// Create a new Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

// Define a simple model
const TestModel = sequelize.define('TestModel', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Run the test
async function runTest() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // Sync the model
    await TestModel.sync({ force: true });
    console.log('✅ Test model synchronized');

    // Test create
    const testData = { name: 'test', value: 42 };
    const record = await TestModel.create(testData);
    console.log('✅ Test record created:', record.toJSON());

    // Test find
    const found = await TestModel.findByPk(record.id);
    console.log('✅ Test record found:', found ? 'Found' : 'Not found');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
    console.log('✅ Connection closed');
  }
}

// Run the test
runTest();
