module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    examId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    courseId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    qpId: {
      type: DataTypes.STRING(200),
      allowNull: false,
      references: {
        model: 'questionpapers',
        key: 'qpId'
      }
    },
    batchId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'batches',
        key: 'batchId'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'exams',
    timestamps: true
  });
 
  Exam.associate = (models) => {
    Exam.belongsTo(models.QuestionPaper, { foreignKey: 'qpId', as: 'questionPaper' });
    Exam.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
    Exam.hasMany(models.Result, { foreignKey: 'examId', as: 'results' });
  };
 
  return Exam;
};
 