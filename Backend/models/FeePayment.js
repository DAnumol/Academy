module.exports = (sequelize, DataTypes) => {
  const FeePayment = sequelize.define('FeePayment', {
    paymentId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    },
    courseId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque'),
      allowNull: false,
      defaultValue: 'Cash'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    collectedBy: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'fee_payments',
    timestamps: true
  });

  FeePayment.associate = (models) => {
    FeePayment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    FeePayment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    FeePayment.belongsTo(models.User, { foreignKey: 'collectedBy', as: 'collector' });
  };

  return FeePayment;
};
