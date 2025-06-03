require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Import database connection
const { sequelize, testConnection } = require('./config/db');
const db = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection and sync models
const initializeDatabase = async () => {
  try {
    // Test the connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return false;
    }
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Meditrack API is running');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Stack:', err.stack);
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    ...err
  });
  
  // Handle specific error types
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ 
      message: 'Database error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Database operation failed'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  // Default error response
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Initialize the database and start the server
const startServer = async () => {
  console.log('Starting server initialization...');
  
  const dbInitialized = await initializeDatabase();
  
  if (!dbInitialized) {
    console.error('Failed to initialize database. Exiting...');
    process.exit(1);
  }
  
  const PORT = process.env.PORT || 5050;
  
  // Only start the server if not in test mode
  if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  }
  
  return app;
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Protected route example (requires authentication)
// This is just an example - most protected routes should be in their respective route files
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = { app, startServer, authMiddleware };
