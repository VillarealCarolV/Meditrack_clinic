const { Sequelize, DataTypes } = require('sequelize');
const testConfig = require('../config/test');

// Test database connection
describe('Database Connection', () => {
  let sequelize;

  beforeAll(async () => {
    // Create a new Sequelize instance for testing
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
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  it('should connect to the test database', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it('should be able to execute a simple query', async () => {
    const [results] = await sequelize.query('SELECT 1+1 as result');
    expect(results[0].result).toBe(2);
  });
});

// Test User model
describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(async () => {
    // Create a new Sequelize instance for testing
    sequelize = new Sequelize(
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

    // Define the User model
    User = sequelize.define('User', {
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { 
        type: DataTypes.ENUM('admin', 'owner', 'staff', 'doctor', 'nurse', 'patient'),
        allowNull: false 
      },
      status: { 
        type: DataTypes.ENUM('pending', 'active', 'rejected'),
        defaultValue: 'pending' 
      }
    });

    // Sync the model with the database
    await User.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  it('should create a new user', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'doctor',
      status: 'active'
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('doctor');
    expect(user.status).toBe('active');
  });
});
