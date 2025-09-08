const request = require('supertest');
const { createToken } = require('../utils/auth');
const { initTestDatabase, closeTestDatabase, cleanupTestData } = require('./test-helper');

// Import models after test database is initialized
let app;

// Mock the app to use the test database
beforeAll(async () => {
  // Initialize test database first
  const { sequelize, models } = await initTestDatabase();
  
  // Now require the app after the test database is set up
  jest.isolateModules(() => {
    // Mock the database connection in the app
    jest.mock('../config/database', () => ({
      sequelize,
      Sequelize: require('sequelize').Sequelize
    }));
    
    // Now require the app with the mocked database
    app = require('../app');
  });
});

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

const testRequest = {
  doctorId: 1, // Will be set in beforeAll
  requestType: 'TIME_OFF',
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
  reason: 'Test reason'
};

describe('Schedule Management API', () => {
  let doctorToken;
  let staffToken;
  let testRequestId;
  let models;

  beforeAll(async () => {
    try {
      // Get models from the test helper
      const { models: testModels } = await initTestDatabase();
      models = testModels;
      
      const { User } = models;
      
      // Create test users
      const doctor = await User.create(testDoctor);
      const staff = await User.create(testStaff);

      // Set the doctor ID for test requests
      testRequest.doctorId = doctor.id;

      // Generate tokens
      doctorToken = createToken({ id: doctor.id, role: 'doctor' });
      staffToken = createToken({ id: staff.id, role: 'staff' });
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });
  
  afterEach(async () => {
    // Clean up test data after each test
    if (models) {
      await cleanupTestData(models);
    }
  });
  
  afterAll(async () => {
    // Close the database connection
    await closeTestDatabase();
  });

  afterAll(async () => {
    // Clean up test data
    await ScheduleSlot.destroy({ where: {}, force: true });
    await ScheduleChangeRequest.destroy({ where: {}, force: true });
    await User.destroy({ where: { email: [testDoctor.email, testStaff.email] } });
  });

  describe('POST /api/schedule/requests', () => {
    it('should create a new schedule change request', async () => {
      const response = await request(app)
        .post('/api/schedule/requests')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(testRequest)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('PENDING');
      expect(response.body.requestType).toBe(testRequest.requestType);
      
      // Save the request ID for later tests
      testRequestId = response.body.id;
    });

    it('should return 400 for invalid request data', async () => {
      const response = await request(app)
        .post('/api/schedule/requests')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          // Missing required fields
          requestType: 'INVALID_TYPE',
          startTime: 'invalid-date',
          endTime: 'invalid-date'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/schedule/requests/pending', () => {
    it('should return pending requests for staff', async () => {
      const response = await request(app)
        .get('/api/schedule/requests/pending')
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 403 for non-staff users', async () => {
      await request(app)
        .get('/api/schedule/requests/pending')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/schedule/requests/:requestId', () => {
    it('should update request status (approve)', async () => {
      const response = await request(app)
        .patch(`/api/schedule/requests/${testRequestId}`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'APPROVED',
          notes: 'Approved for testing'
        })
        .expect(200);

      expect(response.body.status).toBe('APPROVED');
      expect(response.body.notes).toBe('Approved for testing');
      expect(response.body.reviewedBy).toBeDefined();

      // Verify that a schedule slot was created
      const slot = await models.ScheduleSlot.findOne({
        where: { changeRequestId: testRequestId }
      });
      expect(slot).not.toBeNull();
      expect(slot.status).toBe('UNAVAILABLE');
    });
  });

  describe('GET /api/schedule/doctors/:doctorId/slots', () => {
    it('should return doctor\'s schedule slots', async () => {
      const response = await request(app)
        .get(`/api/schedule/doctors/${testRequest.doctorId}/slots`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .query({
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks from now
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Should include the slot we just created
      expect(response.body.some(slot => 
        slot.changeRequestId === testRequestId && 
        slot.status === 'UNAVAILABLE'
      )).toBe(true);
    });
  });
});
