'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('materials', {
      materialId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      subjectId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'subjectId'
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
      fileUrl: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      uploadedBy: {
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
    await queryInterface.dropTable('materials');
  }
};
