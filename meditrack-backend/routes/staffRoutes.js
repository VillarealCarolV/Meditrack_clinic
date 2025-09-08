const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/staff/dashboard
 * @desc    Get staff dashboard data
 * @access  Private (Staff & Admin only)
 */
router.get('/dashboard', auth('staff', 'admin'), async (req, res) => {
  try {
    // Get additional staff data here if needed
    const staffData = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name,
      permissions: getStaffPermissions(req.user.role)
    };

    res.json({
      success: true,
      message: 'Welcome to the Staff Dashboard',
      user: staffData,
      dashboard: {
        stats: {
          // Add relevant staff dashboard statistics
          appointments: 12,
          patients: 45,
          tasks: 5
        },
        recentActivity: [
          // Add recent activity
        ]
      }
    });
  } catch (error) {
    console.error('Staff dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accessing staff dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to determine staff permissions based on role
function getStaffPermissions(role) {
  const permissions = {
    staff: [
      'view_appointments',
      'view_patients',
      'update_patient_info',
      'schedule_appointments'
    ],
    admin: [
      'view_appointments',
      'manage_appointments',
      'view_patients',
      'manage_patients',
      'manage_staff',
      'view_reports',
      'manage_settings'
    ]
  };

  return permissions[role] || [];
}

module.exports = router;
