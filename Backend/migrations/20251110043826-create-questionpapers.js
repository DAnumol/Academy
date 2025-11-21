'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questionpapers', {
      qpId: {
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
      subjectId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'subjectId'
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
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      examDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      totalMarks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fileUrl: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      questionSet: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.STRING(20),
        allowNull: true,
        references: {
          model: 'staffs',
          key: 'staffId'
        }
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
    await queryInterface.dropTable('questionpapers');
  }
};
