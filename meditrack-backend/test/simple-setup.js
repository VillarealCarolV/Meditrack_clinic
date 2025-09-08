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

// Initialize Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Initialize models
const initModels = () => {
  // User model
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'owner', 'staff', 'doctor', 'nurse', 'patient'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'rejected'),
      defaultValue: 'pending'
    }
  });

  // ScheduleChangeRequest model
  const ScheduleChangeRequest = sequelize.define('ScheduleChangeRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    requestType: {
      type: DataTypes.ENUM('time_off', 'schedule_change', 'shift_swap'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: DataTypes.TEXT
  });

  // ScheduleSlot model
  const ScheduleSlot = sequelize.define('ScheduleSlot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'booked', 'unavailable'),
      defaultValue: 'available'
    }
  });

  // Set up associations
  User.hasMany(ScheduleChangeRequest, { foreignKey: 'doctorId' });
  ScheduleChangeRequest.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
  
  User.hasMany(ScheduleChangeRequest, { foreignKey: 'reviewedBy' });
  ScheduleChangeRequest.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewedBy' });
  
  User.hasMany(ScheduleSlot, { foreignKey: 'doctorId' });
  ScheduleSlot.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

  return { User, ScheduleChangeRequest, ScheduleSlot };
};

// Initialize database
const initDatabase = async () => {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Initialize models
    const models = initModels();
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');
    
    return { sequelize, models };
  } catch (error) {
    console.error('❌ Error initializing database:', error);
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
    
    console.log('✅ Test data cleaned up');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
    throw error;
  }
};

// Close database connection
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  initDatabase,
  cleanupTestData,
  closeDatabase
};
