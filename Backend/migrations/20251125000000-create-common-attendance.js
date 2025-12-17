'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('common_attendance', {
      commonAttendanceId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      batchId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'batches',
          key: 'batchId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      records: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'Active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('common_attendance');
  }
};
