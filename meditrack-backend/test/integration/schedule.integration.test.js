const { Sequelize, DataTypes } = require('sequelize');
const { createToken } = require('../../utils/auth');

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

describe('Schedule Management Integration Tests', () => {
  let doctorToken;
  let staffToken;
  let doctor;
  let staff;

  beforeAll(async () => {
    // Sync all models
    await sequelize.sync({ force: true });
    
    // Create test users
    doctor = await User.create(testDoctor);
    staff = await User.create(testStaff);
    
    // Generate tokens
    doctorToken = createToken({ id: doctor.id, role: 'doctor' });
    staffToken = createToken({ id: staff.id, role: 'staff' });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  describe('Schedule Change Requests', () => {
    it('should create a new schedule change request', async () => {
      const requestData = {
        requestType: 'time_off',
        reason: 'Family vacation',
        startDate: '2023-07-01T09:00:00Z',
        endDate: '2023-07-05T17:00:00Z',
        doctorId: doctor.id,
        notes: 'Out of office'
      };

      const request = await ScheduleChangeRequest.create(requestData);
      
      expect(request).toHaveProperty('id');
      expect(request.requestType).toBe('time_off');
      expect(request.status).toBe('pending');
      expect(request.reason).toBe('Family vacation');
      expect(request.doctorId).toBe(doctor.id);
    });

    it('should retrieve schedule change requests for a doctor', async () => {
      // Create test requests
      await ScheduleChangeRequest.bulkCreate([
        {
          requestType: 'time_off',
          reason: 'Vacation',
          startDate: '2023-07-01T09:00:00Z',
          endDate: '2023-07-05T17:00:00Z',
          doctorId: doctor.id,
          status: 'pending'
        },
        {
          requestType: 'schedule_change',
          reason: 'Doctor appointment',
          startDate: '2023-07-10T13:00:00Z',
          endDate: '2023-07-10T15:00:00Z',
          doctorId: doctor.id,
          status: 'approved'
        }
      ]);

      const requests = await ScheduleChangeRequest.findAll({
        where: { doctorId: doctor.id },
        order: [['createdAt', 'DESC']]
      });

      expect(requests.length).toBeGreaterThanOrEqual(2);
      expect(requests[0].doctorId).toBe(doctor.id);
    });
  });

  describe('Schedule Slots', () => {
    it('should create a new schedule slot', async () => {
      const slotData = {
        date: '2023-07-15',
        startTime: '09:00:00',
        endTime: '10:00:00',
        status: 'available',
        doctorId: doctor.id
      };

      const slot = await ScheduleSlot.create(slotData);
      
      expect(slot).toHaveProperty('id');
      expect(slot.date).toBe('2023-07-15');
      expect(slot.startTime).toBe('09:00:00');
      expect(slot.status).toBe('available');
      expect(slot.doctorId).toBe(doctor.id);
    });

    it('should retrieve available schedule slots for a doctor', async () => {
      // Create test slots
      await ScheduleSlot.bulkCreate([
        {
          date: '2023-07-20',
          startTime: '09:00:00',
          endTime: '10:00:00',
          status: 'available',
          doctorId: doctor.id
        },
        {
          date: '2023-07-20',
          startTime: '10:00:00',
          endTime: '11:00:00',
          status: 'booked',
          doctorId: doctor.id
        },
        {
          date: '2023-07-21',
          startTime: '09:00:00',
          endTime: '10:00:00',
          status: 'available',
          doctorId: doctor.id
        }
      ]);

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

      expect(availableSlots.length).toBeGreaterThanOrEqual(2);
      expect(availableSlots.every(slot => slot.status === 'available')).toBe(true);
    });
  });
});
