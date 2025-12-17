// module.exports = (sequelize, DataTypes) => {
//   const Student = sequelize.define('Student', {
//     studentId: {
//       type: DataTypes.STRING(10),
//       primaryKey: true,
//       allowNull: false
//     },
//     userId: {
//       type: DataTypes.STRING(10),
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'userId'
//       }
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false
//     },
//     dob: {
//       type: DataTypes.DATEONLY,
//       allowNull: false
//     },
//     gender: {
//       type: DataTypes.ENUM('Male', 'Female', 'Other'),
//       allowNull: false
//     },
//     address: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     phone: {
//       type: DataTypes.STRING(15),
//       allowNull: false
//     },
//     email: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       validate: {
//         isEmail: true
//       }
//     },
//     batchId: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//       references: {
//         model: 'batches',
//         key: 'batchId'
//       }
//     },
//     courseId: {
//       type: DataTypes.STRING(10),
//       allowNull: true,
//       references: {
//         model: 'courses',
//         key: 'courseId'
//       }
//     },
//     rollNo: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//       unique: true
//     },
//     profilePic: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'inactive'),
//       defaultValue: 'active'
//     }
//   }, {
//     tableName: 'students',
//     timestamps: true
//   });

//   Student.associate = (models) => {
//     Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
//     Student.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
//     Student.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
//     Student.hasMany(models.Result, { foreignKey: 'studentId', as: 'results' });
//   };

//   return Student;
// };

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    batchId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'batches',
        key: 'batchId'
      }
    },
    courseId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    rollNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    profilePic: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    specialFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'students',
    timestamps: true
  });
 
  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Student.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
    Student.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    Student.hasMany(models.Result, { foreignKey: 'studentId', as: 'results' });
    Student.hasMany(models.FeePayment, { foreignKey: 'studentId', as: 'feePayments' });
  };
 
  return Student;
};
 