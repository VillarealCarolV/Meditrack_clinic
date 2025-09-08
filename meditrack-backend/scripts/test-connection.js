const { sequelize } = require('../config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to the database has been established successfully.');
    
    // Test query
    const [results] = await sequelize.query('SELECT 1+1 as result');
    console.log('✅ Test query result:', results[0].result);
    
    // List databases
    const [databases] = await sequelize.query('SHOW DATABASES');
    console.log('\n📊 Available databases:');
    databases.forEach(db => console.log(`- ${db.Database}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();
