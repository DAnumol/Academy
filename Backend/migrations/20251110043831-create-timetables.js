'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timetables', {
      timetableId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      batchId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'batches',
          key: 'batchId'
        }
      },
      weekStartDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      schedule: {
        type: Sequelize.JSON,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdBy: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timetables');
  }
};
