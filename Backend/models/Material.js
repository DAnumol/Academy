module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('Material', {
    materialId: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    subjectId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'subjectId'
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
    fileUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
     status: {
       type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // uploadedBy: {
    //   type: DataTypes.STRING(20),
    //   allowNull: false,
    //   references: {
    //     model: 'staffs',
    //     key: 'staffId'
    //   }
    // }
  }, {
    tableName: 'materials',
    timestamps: true
  });

  Material.associate = (models) => {
    Material.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Material.belongsTo(models.Staff, { foreignKey: 'uploadedBy', as: 'uploader' });
  };

  return Material;
};