require('dotenv').config();
const mysql = require('mysql2/promise');

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');

    // Connect to MySQL without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'neet_academy';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created successfully`);

    await connection.end();
    console.log('✅ Database setup completed');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

module.exports = setupDatabase;

// Run setup if called directly
if (require.main === module) {
  setupDatabase().then(() => process.exit(0));
}