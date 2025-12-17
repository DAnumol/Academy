module.exports = (sequelize, DataTypes) => {
  const CommonAttendance = sequelize.define('CommonAttendance', {
    commonAttendanceId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    batchId: {
      type: DataTypes.STRING(20),
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
    records: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'common_attendance',
    timestamps: true
  });

  CommonAttendance.associate = (models) => {
    CommonAttendance.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
  };

  return CommonAttendance;
};
