'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance', {
      attendanceId: {
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
      subjectId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'subjectId'
        }
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      records: {
        type: Sequelize.JSON,
        allowNull: false
      },
      markedBy: {
        type: Sequelize.STRING(20),
        allowNull: true,
        references: {
          model: 'staffs',
          key: 'staffId'
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
    await queryInterface.dropTable('attendance');
  }
};
