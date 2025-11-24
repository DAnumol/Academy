module.exports = (sequelize, DataTypes) => {
  const ThemePreference = sequelize.define('ThemePreference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      primary: '#0ea5e9',
      secondary: '#d946ef',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      border: '#e5e7eb',
      sidebar: '#1e293b',
      header: '#ffffff'
    }
  },
  typography: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      fontFamily: 'Inter',
      fontSize: 'medium',
      fontWeight: 'normal'
    }
  },
  layout: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      borderRadius: 'medium',
      spacing: 'medium',
      shadows: 'medium'
    }
  },
  mode: {
    type: DataTypes.ENUM('light', 'dark', 'system'),
    defaultValue: 'system'
  }
  }, {
    tableName: 'theme_preferences',
    timestamps: true
  });

  ThemePreference.associate = (models) => {
    ThemePreference.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return ThemePreference;
};
