// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

// Mock console methods to keep test output clean
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up global test timeout
jest.setTimeout(30000);

const { Sequelize, DataTypes } = require('sequelize');
const testConfig = require('../config/test');
const path = require('path');

// Create test database if it doesn't exist
const createTestDatabase = async () => {
  const adminConnection = new Sequelize('mysql', testConfig.username, testConfig.password, {
    host: testConfig.host,
    dialect: 'mysql',
    logging: false
  });

  try {
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${testConfig.database}`);
  } finally {
    await adminConnection.close();
  }
};

// Initialize models
const initModels = (sequelize) => {
  const User = require('../models/User')(sequelize, DataTypes);
  const ScheduleChangeRequest = require('../models/ScheduleChangeRequest')(sequelize, DataTypes);
  const ScheduleSlot = require('../models/ScheduleSlot')(sequelize, DataTypes);

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

// Global setup
beforeAll(async () => {
  try {
    // Create test database
    await createTestDatabase();
    
    // Initialize Sequelize with test config
    const sequelize = new Sequelize(
      testConfig.database,
      testConfig.username,
      testConfig.password,
      {
        ...testConfig,
        define: {
          ...testConfig.define,
          timestamps: true,
          underscored: true,
        },
      }
    );

    // Initialize models
    const models = initModels(sequelize);
    
    // Sync all models
    await sequelize.sync({ force: true });
    
    // Store for use in tests
    global.sequelize = sequelize;
    global.models = models;
    global.DataTypes = DataTypes;
    
  } catch (error) {
    console.error('Test setup error:', error);
    throw error;
  }
});

afterAll(async () => {
  // Close database connection
  if (global.sequelize) {
    await global.sequelize.close();
  }
});
