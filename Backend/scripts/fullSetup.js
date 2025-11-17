const setupDatabase = require('./setupDatabase');
const seedData = require('../seeders/seedData');

const fullSetup = async () => {
  try {
    console.log('🚀 Starting full setup...\n');
    
    // Step 1: Setup database
    await setupDatabase();
    
    // Step 2: Seed data
    console.log('\n🌱 Starting data seeding...');
    await seedData();
    
    console.log('\n🎉 Full setup completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@neetacademy.com / admin123');
    console.log('Staff: priya.sharma@neetacademy.com / staff123');
    console.log('Student: arun.patel@student.neetacademy.com / student123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  fullSetup().then(() => process.exit(0));
}