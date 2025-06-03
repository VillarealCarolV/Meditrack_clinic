const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');
    const users = await User.findAll({ 
      attributes: ['id', 'email', 'role', 'status'],
      raw: true // Return plain objects instead of Sequelize instances
    });
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('Error in getAllUsers:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// POST /api/users - create user (admin/owner only)
exports.createUser = async (req, res) => {
  if (!['admin', 'owner'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  try {
    const hash = await require('bcryptjs').hash(password, 10);
    const user = await User.create({ email, password: hash, role, status: 'pending' });
    res.status(201).json({ id: user.id, email: user.email, role: user.role, status: user.status });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// PATCH /api/users/:id/status - owner approves/rejects
exports.updateUserStatus = async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  const { status } = req.body;
  if (!['active', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = status;
    await user.save();
    res.json({ id: user.id, status: user.status });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};
