module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'owner', 'staff', 'doctor', 'nurse', 'patient'), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'active', 'rejected'), defaultValue: 'pending' }
  });

  return User;
};
