'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create schedule_change_requests table
    await queryInterface.createTable('schedule_change_requests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Foreign key constraint will be added in a separate migration
      },
      requestType: {
        type: Sequelize.ENUM('UNAVAILABLE', 'TIME_OFF', 'APPOINTMENT_CHANGE'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
      },
      requestedBy: {
        type: Sequelize.ENUM('DOCTOR', 'STAFF'),
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      conflictResolution: {
        type: Sequelize.ENUM('RESCHEDULE', 'CANCEL', 'KEEP_AS_IS'),
        allowNull: true,
      },
      reviewedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added in a separate migration
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create schedule_slots table
    await queryInterface.createTable('schedule_slots', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Foreign key constraint will be added in a separate migration
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE'),
        defaultValue: 'AVAILABLE',
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added in a separate migration
      },
      changeRequestId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // Foreign key constraint will be added in a separate migration
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('schedule_change_requests', ['doctorId']);
    await queryInterface.addIndex('schedule_change_requests', ['status']);
    await queryInterface.addIndex('schedule_change_requests', ['startTime', 'endTime']);
    await queryInterface.addIndex('schedule_slots', ['doctorId']);
    await queryInterface.addIndex('schedule_slots', ['status']);
    await queryInterface.addIndex('schedule_slots', ['startTime', 'endTime']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('schedule_slots');
    await queryInterface.dropTable('schedule_change_requests');
  }
};
