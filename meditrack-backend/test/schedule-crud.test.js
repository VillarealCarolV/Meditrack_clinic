// This test file verifies the database connection and basic CRUD operations for the schedule management system
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

// Define models
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

// Test data
const testDoctor = {
  email: 'testdoctor@example.com',
  password: 'password123',
  role: 'doctor',
  status: 'active'
};

const testStaff = {
  email: 'teststaff@example.com',
  password: 'password123',
  role: 'staff',
  status: 'active'
};

// Run the tests
async function runTests() {
  console.log('🚀 Starting Schedule Management CRUD tests...\n');
  
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');
    
    // Create test users
    const doctor = await User.create(testDoctor);
    const staff = await User.create(testStaff);
    console.log('✅ Test users created');
    
    // Test 1: Create a schedule change request
    const requestData = {
      requestType: 'time_off',
      reason: 'Family vacation',
      startDate: new Date('2023-07-01T09:00:00Z'),
      endDate: new Date('2023-07-05T17:00:00Z'),
      doctorId: doctor.id,
      notes: 'Out of office'
    };
    
    const request = await ScheduleChangeRequest.create(requestData);
    console.log('✅ Schedule change request created:', {
      id: request.id,
      type: request.requestType,
      status: request.status,
      reason: request.reason
    });
    
    // Test 2: Create schedule slots
    const slot1 = await ScheduleSlot.create({
      date: '2023-07-10',
      startTime: '09:00:00',
      endTime: '10:00:00',
      status: 'available',
      doctorId: doctor.id
    });
    
    const slot2 = await ScheduleSlot.create({
      date: '2023-07-10',
      startTime: '10:00:00',
      endTime: '11:00:00',
      status: 'available',
      doctorId: doctor.id
    });
    
    console.log('✅ Schedule slots created:', [
      { id: slot1.id, time: `${slot1.startTime}-${slot1.endTime}` },
      { id: slot2.id, time: `${slot2.startTime}-${slot2.endTime}` }
    ]);
    
    // Test 3: Find available slots
    const availableSlots = await ScheduleSlot.findAll({
      where: {
        doctorId: doctor.id,
        status: 'available',
        date: {
          [Sequelize.Op.gte]: new Date()
        }
      },
      order: [
        ['date', 'ASC'],
        ['startTime', 'ASC']
      ]
    });
    
    console.log('✅ Available slots:', availableSlots.map(slot => ({
      id: slot.id,
      date: slot.date,
      time: `${slot.startTime}-${slot.endTime}`
    })));
    
    // Test 4: Update a schedule slot
    await slot1.update({ status: 'booked' });
    const updatedSlot = await ScheduleSlot.findByPk(slot1.id);
    console.log(`✅ Slot ${updatedSlot.id} status updated to:`, updatedSlot.status);
    
    // Test 5: Find schedule change requests for doctor
    const doctorRequests = await ScheduleChangeRequest.findAll({
      where: { doctorId: doctor.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('✅ Doctor schedule change requests:', doctorRequests.map(req => ({
      id: req.id,
      type: req.requestType,
      status: req.status,
      dateRange: `${req.startDate.toISOString().split('T')[0]} to ${req.endDate.toISOString().split('T')[0]}`
    })));
    
    // Test 6: Approve a request (staff action)
    if (doctorRequests.length > 0) {
      const requestToApprove = doctorRequests[0];
      await requestToApprove.update({ 
        status: 'approved',
        reviewedBy: staff.id
      });
      
      const approvedRequest = await ScheduleChangeRequest.findByPk(requestToApprove.id, {
        include: [
          { model: User, as: 'doctor', attributes: ['email'] },
          { model: User, as: 'reviewer', attributes: ['email'] }
        ]
      });
      
      console.log('✅ Request approved:', {
        id: approvedRequest.id,
        status: approvedRequest.status,
        doctor: approvedRequest.doctor.email,
        reviewedBy: approvedRequest.reviewer ? approvedRequest.reviewer.email : 'N/A'
      });
    }
    
    console.log('\n🎉 All Schedule Management CRUD tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the tests
runTests();
