const { Sequelize } = require('sequelize');
const config = require('../config/config');

async function copyDatabaseStructure() {
  try {
    // Connect to source database (emr)
    const sourceDb = new Sequelize({
      database: 'emr',
      username: config.test.username,
      password: config.test.password,
      host: config.test.host,
      port: config.test.port,
      dialect: 'mysql',
      logging: console.log
    });

    // Connect to target database (meditrack_test)
    const targetDb = new Sequelize({
      database: 'meditrack_test',
      username: config.test.username,
      password: config.test.password,
      host: config.test.host,
      port: config.test.port,
      dialect: 'mysql',
      logging: console.log
    });

    // Get all tables from source database
    const [tables] = await sourceDb.query('SHOW TABLES');
    
    for (const table of tables) {
      const tableName = table[`Tables_in_emr`];
      console.log(`\nProcessing table: ${tableName}`);
      
      // Get create table statement
      const [createTable] = await sourceDb.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createStatement = createTable[0]['Create Table'];
      
      try {
        // Drop table if exists
        await targetDb.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        
        // Create table in target database
        await targetDb.query(createStatement);
        console.log(`✅ Created table: ${tableName}`);
        
      } catch (error) {
        console.error(`❌ Error processing table ${tableName}:`, error.message);
      }
    }
    
    console.log('\n✅ Database structure copied successfully!');
    
  } catch (error) {
    console.error('❌ Error copying database structure:', error);
  } finally {
    process.exit(0);
  }
}

copyDatabaseStructure();
