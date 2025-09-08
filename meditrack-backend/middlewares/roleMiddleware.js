const { User } = require('../models');

// Role-based access control middleware
const checkRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Get user ID from the authenticated request
      const userId = req.user.id;
      
      // Find the user in the database
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has one of the required roles
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Insufficient permissions'
        });
      }

      // Attach user object to the request for further use
      req.user = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking user role',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

module.exports = checkRole;
