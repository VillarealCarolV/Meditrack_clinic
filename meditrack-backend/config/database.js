const { Sequelize } = require('sequelize');
const config = require('./config');

// Create a test database connection
const sequelize = new Sequelize(
  config.test.database,
  config.test.username,
  config.test.password,
  {
    host: config.test.host,
    port: 3306, // Default MySQL port
    dialect: 'mysql',
    logging: console.log, // Enable logging for debugging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      max: 3,
      timeout: 30000
    }
  }
);

module.exports = {
  sequelize,
  Sequelize
};
