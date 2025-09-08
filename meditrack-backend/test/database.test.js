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

// Define a simple test model
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

// Test suite
describe('Database Connection and Basic Operations', () => {
  beforeAll(async () => {
    // Sync the model with the database
    await TestModel.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  it('should connect to the database', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it('should create a new record', async () => {
    const testData = { name: 'test', value: 42 };
    const record = await TestModel.create(testData);
    
    expect(record).toHaveProperty('id');
    expect(record.name).toBe(testData.name);
    expect(record.value).toBe(testData.value);
  });

  it('should retrieve the created record', async () => {
    const records = await TestModel.findAll();
    expect(records.length).toBeGreaterThan(0);
    expect(records[0].name).toBe('test');
    expect(records[0].value).toBe(42);
  });

  it('should update a record', async () => {
    const record = await TestModel.findOne({ where: { name: 'test' } });
    await record.update({ value: 100 });
    
    const updatedRecord = await TestModel.findByPk(record.id);
    expect(updatedRecord.value).toBe(100);
  });

  it('should delete a record', async () => {
    const record = await TestModel.findOne({ where: { name: 'test' } });
    await record.destroy();
    
    const deletedRecord = await TestModel.findByPk(record.id);
    expect(deletedRecord).toBeNull();
  });
});
