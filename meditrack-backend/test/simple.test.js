const { initDatabase, cleanupTestData, closeDatabase } = require('./simple-setup');
const { Op } = require('sequelize');

describe('Simple Database Tests', () => {
  let models;
  let sequelize;

  beforeAll(async () => {
    // Initialize the database and get models
    const db = await initDatabase();
    models = db.models;
    sequelize = db.sequelize;
  });

  afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestData(models);
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await closeDatabase();
  });

  describe('User Model', () => {
    it('should create a new user', async () => {
      const { User } = models;
      
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

  describe('ScheduleChangeRequest Model', () => {
    let doctor;
    let reviewer;

    beforeEach(async () => {
      // Create test users
      doctor = await models.User.create({
        email: 'doctor@example.com',
        password: 'password123',
        role: 'doctor',
        status: 'active'
      });

      reviewer = await models.User.create({
        email: 'reviewer@example.com',
        password: 'password123',
        role: 'staff',
        status: 'active'
      });
    });

    it('should create a new schedule change request', async () => {
      const { ScheduleChangeRequest } = models;
      
      const request = await ScheduleChangeRequest.create({
        requestType: 'time_off',
        status: 'pending',
        reason: 'Doctor needs time off',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-03'),
        doctorId: doctor.id,
        reviewedBy: reviewer.id,
        notes: 'Test notes'
      });

      expect(request).toHaveProperty('id');
      expect(request.requestType).toBe('time_off');
      expect(request.status).toBe('pending');
    });
  });

  describe('ScheduleSlot Model', () => {
    let doctor;

    beforeEach(async () => {
      // Create a test doctor
      doctor = await models.User.create({
        email: 'slotdoctor@example.com',
        password: 'password123',
        role: 'doctor',
        status: 'active'
      });
    });

    it('should create a new schedule slot', async () => {
      const { ScheduleSlot } = models;
      
      const slot = await ScheduleSlot.create({
        date: '2023-06-01',
        startTime: '09:00:00',
        endTime: '10:00:00',
        status: 'available',
        doctorId: doctor.id
      });

      expect(slot).toHaveProperty('id');
      expect(slot.status).toBe('available');
      expect(slot.doctorId).toBe(doctor.id);
    });
  });
});
