const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Log incoming request headers for debugging
  console.log('Auth Middleware - Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Auth Middleware - No Authorization header');
    return res.status(401).json({ 
      success: false,
      message: 'Access Denied: No token provided' 
    });
  }

  // Check if the token is in the correct format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Auth Middleware - Invalid token format');
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token format. Use: Bearer <token>' 
    });
  }

  const token = parts[1];
  
  try {
    console.log('Auth Middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware - Token decoded:', decoded);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth Middleware - Token verification failed:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired. Please log in again.' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please log in again.' 
      });
    }
    
    // For any other errors
    return res.status(500).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};
