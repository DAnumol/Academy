module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    attendanceId: {
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
    subjectId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'subjectId'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    records: {
      type: DataTypes.JSON,
      allowNull: false
    },
    // markedBy: {
    //   type: DataTypes.STRING(10),
    //   allowNull: false,
    //   references: {
    //     model: 'staffs',
    //     key: 'staffId'
    //   }
    // }
  }, {
    tableName: 'attendance',
    timestamps: true
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
    Attendance.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Attendance.belongsTo(models.Staff, { foreignKey: 'markedBy', as: 'staff' });
  };

  return Attendance;
};