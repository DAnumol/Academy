module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    courseId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    courseName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subjectIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    syllabusUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    eligibility: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
     status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    }
  }, {
    tableName: 'courses',
    timestamps: true
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    Course.hasMany(models.Student, { foreignKey: 'courseId', as: 'students' });
    Course.hasMany(models.Batch, { foreignKey: 'courseId', as: 'batches' });
    Course.hasMany(models.FeePayment, { foreignKey: 'courseId', as: 'feePayments' });
  };

  return Course;
};