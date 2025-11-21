'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exams', {
      examId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      courseId: {
        type: Sequelize.STRING(10),
        allowNull: true,
        references: {
          model: 'courses',
          key: 'courseId'
        }
      },
      qpId: {
        type: Sequelize.STRING(200),
        allowNull: false,
        references: {
          model: 'questionpapers',
          key: 'qpId'
        }
      },
      batchId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'batches',
          key: 'batchId'
        }
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('exams');
  }
};
