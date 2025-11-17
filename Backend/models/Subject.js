module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    subjectId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    staffId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'staffs',
        key: 'staffId'
      }
    },
     status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'subjects',
    timestamps: true
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.Staff, { foreignKey: 'staffId', as: 'staff' });
    Subject.hasMany(models.QuestionPaper, { foreignKey: 'subjectId', as: 'questionPapers' });
    Subject.hasMany(models.Material, { foreignKey: 'subjectId', as: 'materials' });
  };

  return Subject;
};