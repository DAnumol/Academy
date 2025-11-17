module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    classId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    className: {
      type: DataTypes.STRING(100),
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
    staffIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    studentIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    subjectIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'classes',
    timestamps: true
  });

  Class.associate = (models) => {
    Class.belongsTo(models.Batch, { foreignKey: 'batchId', as: 'batch' });
  };

  return Class;
};