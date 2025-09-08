const jwt = require('jsonwebtoken');

// Role-based access control middleware
const authorize = (roles = []) => {
  // Convert single role to array for flexibility
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // Authenticate
    (req, res, next) => {
      // Log incoming request for debugging
      console.log(`\n--- New Request: ${req.method} ${req.originalUrl} ---`);
      console.log('Headers:', {
        authorization: req.headers.authorization ? '***token present***' : 'missing',
        'content-type': req.headers['content-type']
      });
      
      const authHeader = req.headers.authorization;
      
      // Check if Authorization header exists
      if (!authHeader) {
        console.log('❌ No Authorization header provided');
        return res.status(401).json({ 
          success: false,
          message: 'Access Denied: No token provided' 
        });
      }

      // Check token format
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.log('❌ Invalid token format');
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token format. Use: Bearer <token>' 
        });
      }

      const token = parts[1];
      
      try {
        console.log('🔐 Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified. User:', {
          id: decoded.id,
          role: decoded.role,
          iat: new Date(decoded.iat * 1000).toISOString(),
          exp: new Date(decoded.exp * 1000).toISOString()
        });
        
        // Attach user to request object
        req.user = decoded;
        next();
      } catch (err) {
        console.error('❌ Token verification failed:', err.message);
        
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            success: false,
            message: 'Session expired. Please log in again.' 
          });
        }
        
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            success: false,
            message: 'Invalid token. Please log in again.' 
          });
        }
        
        return res.status(500).json({ 
          success: false,
          message: 'Authentication failed',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    },
    
    // Authorize based on roles
    (req, res, next) => {
      // If no roles specified, just continue
      if (!roles.length) return next();
      
      // Check if user has required role
      if (roles.includes(req.user.role)) {
        console.log(`✅ User authorized (${req.user.role})`);
        return next();
      }
      
      console.log(`⛔ Unauthorized access. Required roles: ${roles.join(', ')}`);
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Insufficient permissions' 
      });
    }
  ];
};

// Backward compatibility
authorize.authenticate = () => authorize([]);

module.exports = authorize;
