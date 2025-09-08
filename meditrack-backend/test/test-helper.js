const { Sequelize, DataTypes } = require('sequelize');
const testConfig = require('../config/test-db').testConfig;

// Initialize Sequelize instance
const sequelize = new Sequelize(
  testConfig.database,
  testConfig.username,
  testConfig.password,
  {
    host: testConfig.host,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Import model definitions
const initUserModel = require('../models/User');
const initScheduleChangeRequestModel = require('../models/ScheduleChangeRequest');
const initScheduleSlotModel = require('../models/ScheduleSlot');

// Initialize models
const initModels = () => {
  const User = initUserModel(sequelize, DataTypes);
  const ScheduleChangeRequest = initScheduleChangeRequestModel(sequelize, DataTypes);
  const ScheduleSlot = initScheduleSlotModel(sequelize, DataTypes);

  // Set up associations
  User.hasMany(ScheduleChangeRequest, { foreignKey: 'doctorId' });
  ScheduleChangeRequest.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
  
  User.hasMany(ScheduleChangeRequest, { foreignKey: 'reviewedBy' });
  ScheduleChangeRequest.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewedBy' });
  
  User.hasMany(ScheduleSlot, { foreignKey: 'doctorId' });
  ScheduleSlot.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
  
  ScheduleChangeRequest.hasMany(ScheduleSlot, { foreignKey: 'changeRequestId' });
  ScheduleSlot.belongsTo(ScheduleChangeRequest, { foreignKey: 'changeRequestId' });

  return { User, ScheduleChangeRequest, ScheduleSlot };
};

// Initialize test database
const initTestDatabase = async () => {
  try {
    // Connect to the test database
    await sequelize.authenticate();
    console.log('Test database connection has been established successfully.');
    
    // Initialize models
    const models = initModels();
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Test database synchronized.');
    
    return { sequelize, models };
  } catch (error) {
    console.error('Unable to initialize test database:', error);
    throw error;
  }
};

// Close database connection
const closeTestDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed.');
  } catch (error) {
    console.error('Error closing test database connection:', error);
    throw error;
  }
};

// Clean up test data
const cleanupTestData = async (models) => {
  try {
    const { User, ScheduleChangeRequest, ScheduleSlot } = models;
    
    await ScheduleSlot.destroy({ where: {}, truncate: true, force: true });
    await ScheduleChangeRequest.destroy({ where: {}, truncate: true, force: true });
    await User.destroy({ where: {}, truncate: true, force: true });
    
    console.log('Test data cleaned up.');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
};

// Export the sequelize instance and models for testing
module.exports = {
  sequelize,
  testConfig,
  initTestDatabase: async () => {
    try {
      await sequelize.authenticate();
      console.log('Test database connection has been established successfully.');
      
      // Initialize models
      const models = initModels();
      
      // Sync all models
      await sequelize.sync({ force: true });
      console.log('Test database synchronized.');
      
      return { sequelize, models };
    } catch (error) {
      console.error('Unable to initialize test database:', error);
      throw error;
    }
  },
  closeTestDatabase: async () => {
    try {
      await sequelize.close();
      console.log('Test database connection closed.');
    } catch (error) {
      console.error('Error closing test database connection:', error);
      throw error;
    }
  },
  cleanupTestData: async (models) => {
    try {
      const { User, ScheduleChangeRequest, ScheduleSlot } = models;
      
      await ScheduleSlot.destroy({ where: {}, truncate: true, force: true });
      await ScheduleChangeRequest.destroy({ where: {}, truncate: true, force: true });
      await User.destroy({ where: {}, truncate: true, force: true });
      
      console.log('Test data cleaned up.');
    } catch (error) {
      console.error('Error cleaning up test data:', error);
      throw error;
    }
  }
};
