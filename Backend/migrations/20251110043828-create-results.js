'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('results', {
      resultId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      studentId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'students',
          key: 'studentId'
        }
      },
      examId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'exams',
          key: 'examId'
        }
      },
      totalMarks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      obtainedMarks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      grade: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      studentAnswers: {
        type: Sequelize.JSON,
        allowNull: true
      },
      violations: {
        type: Sequelize.JSON,
        allowNull: true
      },
      violationCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('results');
  }
};
