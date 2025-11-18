module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('Timetable', {
    timetableId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    batchId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'batches',
        key: 'batchId'
      }
    },
    weekStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    schedule: {
      type: DataTypes.JSON,
      allowNull: false
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
    tableName: 'timetables',
    timestamps: true
  });

  Timetable.associate = (models) => {
    Timetable.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
    Timetable.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Timetable;
};