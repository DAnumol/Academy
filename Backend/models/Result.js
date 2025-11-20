module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('Result', {
    resultId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    studentId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'students',
        key: 'studentId'
      }
    },
    examId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'exams',
        key: 'examId'
      }
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    obtainedMarks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'results',
    timestamps: true
  });

  Result.associate = (models) => {
    Result.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Result.belongsTo(models.Exam, { foreignKey: 'examId', as: 'exam' });
  };

  return Result;
};