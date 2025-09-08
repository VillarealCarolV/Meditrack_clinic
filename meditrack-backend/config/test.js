module.exports = {
  username: process.env.TEST_DB_USER || 'root',
  password: process.env.TEST_DB_PASS || '',
  database: process.env.TEST_DB_NAME || 'meditrack_test',
  host: process.env.TEST_DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
