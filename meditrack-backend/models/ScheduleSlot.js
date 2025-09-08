'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ScheduleSlot extends Model {
    static associate(/* models */) {
      // Temporarily removed associations for debugging
    }
  }
  
  ScheduleSlot.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Foreign key constraint will be handled in the migration
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
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE'),
      defaultValue: 'AVAILABLE',
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'id',
      },
    },
    changeRequestId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'schedule_change_requests',
        key: 'id',
      },
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
    modelName: 'ScheduleSlot',
    tableName: 'schedule_slots',
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
      },
      {
        fields: ['appointmentId'],
      },
      {
        fields: ['changeRequestId'],
      }
    ],
  });

  return ScheduleSlot;
};
