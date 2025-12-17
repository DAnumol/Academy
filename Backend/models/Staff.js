module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    staffId: {
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
    subjectExpertise: {
      type: DataTypes.JSON,
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
    qualification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    experience: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
   batchId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'batches',
        key: 'batchId'
      }
    },
    profilePic: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    // status: {
    //   type: DataTypes.ENUM('active', 'inactive'),
    //   defaultValue: 'active'
    // }
     status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'staffs',
    timestamps: true
  });

  Staff.associate = (models) => {
    Staff.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Staff.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
    Staff.hasMany(models.QuestionPaper, { foreignKey: 'createdBy', as: 'questionPapers' });
    Staff.hasMany(models.Material, { foreignKey: 'uploadedBy', as: 'materials' });
  };

  return Staff;
};