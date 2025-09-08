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
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
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
async function runTests() {
  console.log('🚀 Starting isolated database tests...\n');
  
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Successfully connected to the database');

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
    
    // Test update
    await record.update({ value: 100 });
    const updated = await TestModel.findByPk(record.id);
    console.log('✅ Test record updated. New value:', updated.value);
    
    // Test delete
    await record.destroy();
    const deleted = await TestModel.findByPk(record.id);
    console.log('✅ Test record deleted:', !deleted ? 'Success' : 'Failed');
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the tests
runTests();
