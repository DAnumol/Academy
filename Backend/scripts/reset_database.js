require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Disabling foreign key checks...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');

  console.log('Dropping all tables...');
  const [tables] = await conn.query('SHOW TABLES');
  for (const table of tables) {
    const tableName = Object.values(table)[0];
    await conn.query(`DROP TABLE IF EXISTS ${tableName}`);
    console.log(`Dropped table: ${tableName}`);
  }

  console.log('Re-enabling foreign key checks...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  await conn.end();
  console.log('\nDatabase reset complete. Now run: npx sequelize-cli db:migrate');
})();
