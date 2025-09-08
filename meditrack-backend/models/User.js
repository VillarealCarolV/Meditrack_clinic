module.exports = (sequelize, DataTypes) => {
  class User extends require('sequelize').Model {
    static associate(models) {
      // Define association to Notifications
      User.hasMany(models.Notification, {
        foreignKey: 'userId',
        as: 'notifications'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: { 
      type: DataTypes.STRING, 
      unique: true, 
      allowNull: false 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    role: { 
      type: DataTypes.ENUM('admin', 'owner', 'staff', 'doctor', 'nurse', 'patient'), 
      allowNull: false 
    },
    status: { 
      type: DataTypes.ENUM('pending', 'active', 'rejected'), 
      defaultValue: 'pending' 
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: false
  });

  return User;
};
