'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the status column already exists in the users table
    const [results] = await queryInterface.sequelize.query(
      `SHOW COLUMNS FROM users LIKE 'status'`
    );

    // If status column exists, we'll remove the problematic migration from SequelizeMeta
    if (results.length > 0) {
      console.log('Status column already exists in users table, skipping migration');
      
      // Remove the problematic migration from SequelizeMeta if it exists
      await queryInterface.sequelize.query(
        `DELETE FROM SequelizeMeta WHERE name = '20250602-add-status-to-users.js'`
      );
      return;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No need to do anything in the down migration
    return Promise.resolve();
  }
};
