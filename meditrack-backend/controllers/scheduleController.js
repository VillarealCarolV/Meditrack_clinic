const { Op } = require('sequelize');
const ScheduleChangeRequest = require('../models/ScheduleChangeRequest');
const ScheduleSlot = require('../models/ScheduleSlot');
const NotificationService = require('../services/notificationService');
const { validationResult } = require('express-validator');

// Helper function to check for scheduling conflicts
async function hasSchedulingConflict(doctorId, startTime, endTime, excludeRequestId = null) {
  const conditions = {
    doctorId,
    [Op.or]: [
      // Existing slot starts during new slot
      { startTime: { [Op.lt]: endTime, [Op.gte]: startTime } },
      // Existing slot ends during new slot
      { endTime: { [Op.gt]: startTime, [Op.lte]: endTime } },
      // New slot completely contains existing slot
      { 
        [Op.and]: [
          { startTime: { [Op.gte]: startTime } },
          { endTime: { [Op.lte]: endTime } }
        ]
      }
    ]
  };

  if (excludeRequestId) {
    conditions.id = { [Op.ne]: excludeRequestId };
  }

  const conflict = await ScheduleChangeRequest.findOne({
    where: {
      ...conditions,
      status: 'APPROVED'
    }
  });

  return !!conflict;
}

// Create a new schedule change request
exports.createRequest = async (req, res) => {
  try {
    const { doctorId, requestType, startTime, endTime, reason } = req.body;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check for scheduling conflicts
    const conflict = await hasSchedulingConflict(doctorId, new Date(startTime), new Date(endTime));
    if (conflict) {
      return res.status(409).json({ error: 'Scheduling conflict detected' });
    }

    const request = await ScheduleChangeRequest.create({
      doctorId,
      requestType,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      reason,
      requestedBy: req.user.role === 'doctor' ? 'DOCTOR' : 'STAFF',
      status: 'PENDING',
      requestedById: req.user.id
    });

    // Notify staff about new schedule request
    const notificationTitle = 'New Schedule Change Request';
    const notificationMessage = `New ${requestType} request from ${req.user.name} for ${new Date(startTime).toLocaleString()}`;
    
    // In a real app, you would fetch staff users who should be notified
    // For now, we'll assume there's a system user or admin to receive notifications
    const adminUserId = '00000000-0000-0000-0000-000000000001'; // Replace with actual admin/staff user ID
    
    await NotificationService.createNotification(
      adminUserId,
      'SCHEDULE_REQUEST',
      notificationTitle,
      notificationMessage,
      { requestId: request.id, doctorId, startTime, endTime }
    );

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating schedule change request:', error);
    res.status(500).json({ error: 'Failed to create schedule change request' });
  }
};

// Get all pending schedule change requests
exports.getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const requests = await ScheduleChangeRequest.findAll({
      where: { status: 'PENDING' },
      order: [['createdAt', 'ASC']]
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};

// Update request status (approve/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { requestId } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const request = await ScheduleChangeRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request has already been processed' });
    }

    request.status = status;
    request.reviewedBy = req.user.id;
    request.notes = notes;
    
    if (status === 'APPROVED') {
      // Create an unavailable slot for the approved time off/unavailable request
      await ScheduleSlot.create({
        doctorId: request.doctorId,
        startTime: request.startTime,
        endTime: request.endTime,
        status: 'UNAVAILABLE',
        changeRequestId: request.id
      });
    }

    await request.save();

    // Send notification to the requester
    const notificationType = status === 'APPROVED' ? 'SCHEDULE_APPROVED' : 'SCHEDULE_REJECTED';
    const notificationTitle = `Schedule Request ${status}`;
    const notificationMessage = `Your schedule change request has been ${status.toLowerCase()}${notes ? ': ' + notes : ''}`;
    
    await NotificationService.createNotification(
      request.requestedById,
      notificationType,
      notificationTitle,
      notificationMessage,
      { 
        requestId: request.id, 
        status: request.status,
        startTime: request.startTime,
        endTime: request.endTime,
        notes: request.notes
      }
    );

    res.json(request);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};

// Get doctor's schedule slots
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { start, end } = req.query;

    // Default to current week if no date range provided
    const startDate = start ? new Date(start) : new Date();
    const endDate = end ? new Date(end) : new Date();
    endDate.setDate(endDate.getDate() + 7); // Default to one week

    const slots = await ScheduleSlot.findAll({
      where: {
        doctorId,
        startTime: {
          [Op.gte]: startDate,
        },
        endTime: {
          [Op.lte]: endDate,
        },
      },
      order: [['startTime', 'ASC']],
    });

    res.json(slots);
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    res.status(500).json({ error: 'Failed to fetch doctor schedule' });
  }
};

// Get schedule change requests for a doctor
exports.getDoctorRequests = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, start, end } = req.query;

    const where = { doctorId };
    
    if (status) {
      where.status = status;
    }

    if (start && end) {
      where.startTime = {
        [Op.between]: [new Date(start), new Date(end)]
      };
    }

    const requests = await ScheduleChangeRequest.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching doctor requests:', error);
    res.status(500).json({ error: 'Failed to fetch doctor requests' });
  }
};
