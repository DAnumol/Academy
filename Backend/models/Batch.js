module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define('Batch', {
    batchId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    batchName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    courseId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'courses',
        key: 'courseId'
      }
    },
    staffIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    studentIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'batches',
    timestamps: true
  });

  Batch.associate = (models) => {
    Batch.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    Batch.hasMany(models.Student, { foreignKey: 'batchId', as: 'students' });
    Batch.hasMany(models.Timetable, { foreignKey: 'batchId', as: 'timetables' });
  };

  return Batch;
};