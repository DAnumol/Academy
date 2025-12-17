'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fee_payments', {
      paymentId: {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      courseId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'courses',
          key: 'courseId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'),
        allowNull: false,
        defaultValue: 'Cash'
      },
      transactionId: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      receiptNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      collectedBy: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        }
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fee_payments');
  }
};
