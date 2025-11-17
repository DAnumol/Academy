module.exports = (sequelize, DataTypes) => {
  const QuestionPaper = sequelize.define('QuestionPaper', {
    qpId: {
      type: DataTypes.STRING(10),
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
    subjectId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'subjectId'
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
    createdBy: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'staffs',
        key: 'staffId'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    examDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    questionSet: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'questionpapers',
    timestamps: true
  });

  QuestionPaper.associate = (models) => {
    QuestionPaper.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    QuestionPaper.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
    QuestionPaper.belongsTo(models.Staff, { foreignKey: 'createdBy', as: 'creator' });
    QuestionPaper.hasMany(models.Exam, { foreignKey: 'qpId', as: 'exams' });
  };

  return QuestionPaper;
};