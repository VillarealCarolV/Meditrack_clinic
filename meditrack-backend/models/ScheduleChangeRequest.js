'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ScheduleChangeRequest extends Model {
    static associate(models) {
      // Define associations here
      ScheduleChangeRequest.belongsTo(models.User, {
        foreignKey: 'doctorId',
        as: 'doctor'
      });
      
      ScheduleChangeRequest.belongsTo(models.User, {
        foreignKey: 'reviewedBy',
        as: 'reviewedByUser'
      });
    }
  }
  
  ScheduleChangeRequest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    requestType: {
      type: DataTypes.ENUM('UNAVAILABLE', 'TIME_OFF', 'APPOINTMENT_CHANGE'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    requestedBy: {
      type: DataTypes.ENUM('DOCTOR', 'STAFF'),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartTime(value) {
          if (value <= this.startTime) {
            throw new Error('End time must be after start time');
          }
        },
      },
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    conflictResolution: {
      type: DataTypes.ENUM('RESCHEDULE', 'CANCEL', 'KEEP_AS_IS'),
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('metadata');
        return value ? JSON.parse(value) : null;
      },
      set(value) {
        this.setDataValue('metadata', JSON.stringify(value));
      }
    }
  }, {
    sequelize,
    modelName: 'ScheduleChangeRequest',
    tableName: 'schedule_change_requests',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['startTime', 'endTime'],
      },
      {
        fields: ['doctorId'],
      },
      {
        fields: ['status'],
      }
    ],
  });

  return ScheduleChangeRequest;
};
