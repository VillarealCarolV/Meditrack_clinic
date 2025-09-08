const { body, param, query } = require('express-validator');
const { Op } = require('sequelize');
const ScheduleChangeRequest = require('../models/ScheduleChangeRequest');

// Common validation rules for date ranges
exports.validateDateRange = [
  body('startTime')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Start time must be in the future');
      }
      return true;
    }),
  
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
];

// Validation for creating a schedule change request
exports.validateCreateRequest = [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isUUID()
    .withMessage('Invalid doctor ID format'),
    
  body('requestType')
    .isIn(['UNAVAILABLE', 'TIME_OFF', 'APPOINTMENT_CHANGE'])
    .withMessage('Invalid request type'),
    
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ max: 1000 })
    .withMessage('Reason cannot exceed 1000 characters'),
    
  ...this.validateDateRange,
];

// Validation for updating request status
exports.validateUpdateStatus = [
  param('requestId')
    .isUUID()
    .withMessage('Invalid request ID format')
    .custom(async (value) => {
      const request = await ScheduleChangeRequest.findByPk(value);
      if (!request) {
        throw new Error('Request not found');
      }
      return true;
    }),
    
  body('status')
    .isIn(['APPROVED', 'REJECTED'])
    .withMessage('Status must be either APPROVED or REJECTED'),
    
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

// Validation for query parameters
exports.validateQueryParams = [
  query('start')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
    
  query('end')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.query.start && new Date(value) <= new Date(req.query.start)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
    
  query('status')
    .optional()
    .isIn(['PENDING', 'APPROVED', 'REJECTED'])
    .withMessage('Invalid status value'),
];

// Middleware to check if the user is authorized to access the resource
exports.authorizeDoctorAccess = (req, res, next) => {
  // Allow admins and staff to access any doctor's data
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    return next();
  }
  
  // Doctors can only access their own data
  if (req.user.role === 'doctor' && req.user.id === req.params.doctorId) {
    return next();
  }
  
  return res.status(403).json({ error: 'Unauthorized access' });
};

// Middleware to check if the user can approve/reject requests
exports.canApproveRequests = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    return next();
  }
  
  return res.status(403).json({ error: 'Insufficient permissions' });
};
