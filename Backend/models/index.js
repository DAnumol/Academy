const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Student = require('./Student')(sequelize, Sequelize.DataTypes);
db.Staff = require('./Staff')(sequelize, Sequelize.DataTypes);
db.Course = require('./Course')(sequelize, Sequelize.DataTypes);
db.Subject = require('./Subject')(sequelize, Sequelize.DataTypes);
db.Batch = require('./Batch')(sequelize, Sequelize.DataTypes);
db.Class = require('./Class')(sequelize, Sequelize.DataTypes);
db.Timetable = require('./Timetable')(sequelize, Sequelize.DataTypes);
db.QuestionPaper = require('./QuestionPaper')(sequelize, Sequelize.DataTypes);
db.Attendance = require('./Attendance')(sequelize, Sequelize.DataTypes);
db.Material = require('./Material')(sequelize, Sequelize.DataTypes);
db.Exam = require('./Exam')(sequelize, Sequelize.DataTypes);
db.Result = require('./Result')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
db.ThemePreference = require('./ThemePreference')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;