const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Make sure User model is properly initialized
if (!User || typeof User.findOne !== 'function') {
  console.error('User model is not properly initialized');
  process.exit(1);
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Debug logging
    console.log('Login attempt for email:', email);
    console.log('Raw password (first 2 chars):', password ? password.substring(0, 2) + '...' : 'empty');
    
    const user = await User.findOne({ where: { email } });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User password in DB (first 10 chars):', user.password ? user.password.substring(0, 10) + '...' : 'empty');
    console.log('Full password hash:', user.password);
    console.log('Password is hashed:', user.password && user.password.startsWith('$2a$') ? 'Yes' : 'No');
    
    // Test bcrypt hash verification
    if (user.password && user.password.startsWith('$2a$')) {
      try {
        const testHash = await bcrypt.hash('staff123', user.password.substring(0, 30));
        console.log('Test hash with same salt:', testHash.startsWith(user.password.substring(0, 30)) ? 'Matches' : 'Mismatch');
      } catch (e) {
        console.error('Error testing hash:', e.message);
      }
    }

    // Check if the password is hashed (starts with $2a$)
    const isHashed = user.password && user.password.startsWith('$2a$');
    let isValidPassword = false;

    if (isHashed) {
      console.log('Comparing with bcrypt...');
      console.log('Input password:', password);
      console.log('Stored hash:', user.password);
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Bcrypt comparison result:', isValidPassword);
        if (!isValidPassword) {
          console.log('Bcrypt comparison failed. Possible reasons:');
          console.log('1. Wrong password');
          console.log('2. Incorrect hash format');
          console.log('3. Different bcrypt version');
        }
      } catch (e) {
        console.error('Bcrypt compare error:', e.message);
      }
    } else {
      console.log('Comparing plain text...');
      isValidPassword = password === user.password;
      console.log('Plain text comparison result:', isValidPassword);
      
      if (isValidPassword) {
        console.log('Upgrading password to hashed version...');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload with user data
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
    };

    // Generate token with user data
    const token = jwt.sign(
      userData,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Set secure cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    // Return user data and token
    res.status(200).json({
      success: true,
      user: userData,
      token,
      expiresIn: 8 * 60 * 60 * 1000 // 8 hours in milliseconds
    });
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      isJwtError: error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError',
      envVars: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(500).json({ 
        success: false,
        message: 'JWT configuration error',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProfile = (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
};
