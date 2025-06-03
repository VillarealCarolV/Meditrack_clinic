const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Make sure User model is properly initialized
if (!User || typeof User.findOne !== 'function') {
  console.error('User model is not properly initialized');
  process.exit(1);
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
};

exports.getProfile = (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
};
