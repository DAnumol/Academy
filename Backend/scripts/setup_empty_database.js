require('dotenv').config();
const { sequelize } = require('../models');

(async () => {
  try {
    console.log('Dropping all tables...');
    await sequelize.drop();
    
    console.log('Creating all tables...');
    await sequelize.sync({ force: true });
    
    console.log('✅ Empty database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
