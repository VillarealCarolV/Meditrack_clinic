const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { 
  validateCreateRequest, 
  validateUpdateStatus, 
  validateQueryParams,
  authorizeDoctorAccess,
  canApproveRequests
} = require('../middlewares/scheduleValidation');
const { authenticate } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new schedule change request
router.post('/requests', validateCreateRequest, scheduleController.createRequest);

// Get all pending schedule change requests (staff/admin only)
router.get('/requests/pending', canApproveRequests, scheduleController.getPendingRequests);

// Update request status (approve/reject)
router.patch('/requests/:requestId', validateUpdateStatus, canApproveRequests, scheduleController.updateRequestStatus);

// Get doctor's schedule slots
router.get('/doctors/:doctorId/slots', validateQueryParams, authorizeDoctorAccess, scheduleController.getDoctorSchedule);

// Get schedule change requests for a specific doctor
router.get('/doctors/:doctorId/requests', validateQueryParams, authorizeDoctorAccess, scheduleController.getDoctorRequests);

module.exports = router;
