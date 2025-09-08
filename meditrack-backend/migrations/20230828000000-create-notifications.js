'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, ensure the Users table exists
    const [results] = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'Users'"
    );
    
    if (results.length === 0) {
      throw new Error('Users table does not exist. Please run user migrations first.');
    }

    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        // Foreign key constraint will be handled in the model
      },
      type: {
        type: Sequelize.ENUM(
          'SCHEDULE_REQUEST',
          'SCHEDULE_APPROVED',
          'SCHEDULE_REJECTED',
          'APPOINTMENT_CONFIRMED',
          'APPOINTMENT_CANCELLED'
        ),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      metadata: {
        type: Sequelize.TEXT, // Changed from JSONB to TEXT for MariaDB compatibility
        allowNull: true,
        get() {
          const value = this.getDataValue('metadata');
          return value ? JSON.parse(value) : null;
        },
        set(value) {
          this.setDataValue('metadata', JSON.stringify(value));
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: 'CURRENT_TIMESTAMP'
      }
    });

    // Add index for faster lookups
    await queryInterface.addIndex('notifications', ['userId', 'isRead']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
    // No need to drop enum type as it's defined at column level
  }
};
