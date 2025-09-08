const { Sequelize, DataTypes } = require('sequelize');

// Test database configuration
const testConfig = {
  database: 'meditrack_test',
  username: 'root',
  password: '',
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
};

// Create a new test file that doesn't load any project files
describe('Isolated Database Test', () => {
  let sequelize;
  let TestModel;

  beforeAll(async () => {
    // Create a new Sequelize instance
    sequelize = new Sequelize(
      testConfig.database,
      testConfig.username,
      testConfig.password,
      {
        host: testConfig.host,
        dialect: 'mysql',
        logging: false
      }
    );

    // Define a simple model
    TestModel = sequelize.define('TestModel', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });

    // Sync the model with the database
    await TestModel.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    if (sequelize) {
      await sequelize.close();
    }
  });

  it('should connect to the database', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it('should execute a simple query', async () => {
    const [results] = await sequelize.query('SELECT 1+1 as result');
    expect(results[0].result).toBe(2);
  });

  it('should create a new record', async () => {
    const testData = { name: 'test', value: 42 };
    const record = await TestModel.create(testData);
    
    expect(record).toHaveProperty('id');
    expect(record.name).toBe(testData.name);
    expect(record.value).toBe(testData.value);
  });
});
