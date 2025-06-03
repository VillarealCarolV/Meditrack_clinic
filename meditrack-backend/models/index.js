const { sequelize } = require('../config/db');
const User = require('./User');

// Initialize models
const models = {
  User: User(sequelize, require('sequelize').DataTypes),
  // Add other models here when needed
};

// Run associations if any
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize: require('sequelize'),
};

module.exports = db;
