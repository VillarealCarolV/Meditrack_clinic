const { Sequelize } = require('sequelize');

const testConfig = {
  username: process.env.TEST_DB_USER || 'root',
  password: process.env.TEST_DB_PASS || '',
  database: process.env.TEST_DB_NAME || 'emr',
  host: process.env.TEST_DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
};

// Create a Sequelize instance for testing
const sequelize = new Sequelize(
  testConfig.database,
  testConfig.username,
  testConfig.password,
  {
    ...testConfig,
    logging: false
  }
);

module.exports = {
  sequelize,
  testConfig,
  connect: async () => {
    try {
      await sequelize.authenticate();
      console.log('Test database connection has been established successfully.');
      return true;
    } catch (error) {
      console.error('Unable to connect to the test database:', error);
      return false;
    }
  },
  close: async () => {
    await sequelize.close();
  },
  sync: async (options = {}) => {
    return sequelize.sync(options);
  }
};
