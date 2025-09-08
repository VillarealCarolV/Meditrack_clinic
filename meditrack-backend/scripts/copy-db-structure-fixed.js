const { Sequelize } = require('sequelize');
const config = require('../config/config');

async function copyDatabaseStructure() {
  let sourceDb, targetDb;
  
  try {
    // Connect to databases
    sourceDb = new Sequelize({
      database: 'emr',
      username: config.test.username,
      password: config.test.password,
      host: config.test.host,
      port: config.test.port,
      dialect: 'mysql',
      logging: console.log
    });

    targetDb = new Sequelize({
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
    const tableNames = tables.map(t => t[`Tables_in_emr`]);
    
    // Sort tables to handle dependencies
    const sortedTables = [];
    const added = new Set();
    
    // First pass: add tables without foreign keys first
    for (const tableName of tableNames) {
      const [createTable] = await sourceDb.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createStatement = createTable[0]['Create Table'];
      
      if (!createStatement.includes('FOREIGN KEY')) {
        sortedTables.push({ tableName, createStatement });
        added.add(tableName);
      }
    }
    
    // Second pass: add remaining tables
    for (const tableName of tableNames) {
      if (!added.has(tableName)) {
        const [createTable] = await sourceDb.query(`SHOW CREATE TABLE \`${tableName}\``);
        const createStatement = createTable[0]['Create Table'];
        sortedTables.push({ tableName, createStatement });
      }
    }
    
    // Process each table
    for (const { tableName, createStatement } of sortedTables) {
      console.log(`\nProcessing table: ${tableName}`);
      
      try {
        // Disable foreign key checks
        await targetDb.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Drop table if exists
        await targetDb.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        
        // Create table
        await targetDb.query(createStatement);
        console.log(`✅ Created table: ${tableName}`);
        
        // Re-enable foreign key checks
        await targetDb.query('SET FOREIGN_KEY_CHECKS = 1');
        
      } catch (error) {
        console.error(`❌ Error processing table ${tableName}:`, error.message);
        // Re-enable foreign key checks in case of error
        await targetDb.query('SET FOREIGN_KEY_CHECKS = 1');
      }
    }
    
    console.log('\n✅ Database structure copied successfully!');
    
  } catch (error) {
    console.error('❌ Error copying database structure:', error);
  } finally {
    // Ensure connections are closed
    if (sourceDb) await sourceDb.close();
    if (targetDb) await targetDb.close();
    process.exit(0);
  }
}

copyDatabaseStructure();
