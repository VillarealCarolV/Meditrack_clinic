const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');
const basename = path.basename(__filename);

// Define models in the correct order to handle dependencies
const modelDefiners = {
  // Core models
  User: require('./User')(sequelize, DataTypes),
  
  // Other models that don't have dependencies
  // ...
  
  // Models with dependencies
  ScheduleChangeRequest: require('./ScheduleChangeRequest')(sequelize, DataTypes),
  ScheduleSlot: require('./ScheduleSlot')(sequelize, DataTypes),
  Notification: require('./Notification')(sequelize, DataTypes)
};

// Run associations
Object.values(modelDefiners).forEach(model => {
  if (model.associate) {
    model.associate(modelDefiners);
  }
});

// Add sequelize and Sequelize to the exported object
const db = {
  ...modelDefiners,
  sequelize,
  Sequelize: require('sequelize')
};

module.exports = db;
