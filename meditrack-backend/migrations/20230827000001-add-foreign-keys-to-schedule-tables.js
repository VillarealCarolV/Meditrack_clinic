'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, ensure the Users table exists
    const [results] = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'users'"
    );
    
    if (results.length === 0) {
      throw new Error('Users table does not exist. Please run user migrations first.');
    }
    
    // Add foreign key for schedule_change_requests.doctorId -> users.id
    await queryInterface.addConstraint('schedule_change_requests', {
      fields: ['doctorId'],
      type: 'foreign key',
      name: 'fk_schedule_change_requests_doctor',
      references: {
        table: 'users', // Using lowercase table name
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Add foreign key for schedule_change_requests.reviewedBy -> users.id
    await queryInterface.addConstraint('schedule_change_requests', {
      fields: ['reviewedBy'],
      type: 'foreign key',
      name: 'fk_schedule_change_requests_reviewer',
      references: {
        table: 'users', // Using lowercase table name
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });

    // Add foreign key for schedule_slots.doctorId -> users.id
    await queryInterface.addConstraint('schedule_slots', {
      fields: ['doctorId'],
      type: 'foreign key',
      name: 'fk_schedule_slots_doctor',
      references: {
        table: 'users', // Using lowercase table name
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Add foreign key for schedule_slots.changeRequestId -> schedule_change_requests.id
    await queryInterface.addConstraint('schedule_slots', {
      fields: ['changeRequestId'],
      type: 'foreign key',
      name: 'fk_schedule_slots_change_request',
      references: {
        table: 'schedule_change_requests',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all foreign key constraints in reverse order
    await queryInterface.removeConstraint('schedule_slots', 'fk_schedule_slots_change_request');
    await queryInterface.removeConstraint('schedule_slots', 'fk_schedule_slots_doctor');
    await queryInterface.removeConstraint('schedule_change_requests', 'fk_schedule_change_requests_reviewer');
    await queryInterface.removeConstraint('schedule_change_requests', 'fk_schedule_change_requests_doctor');
  }
};
