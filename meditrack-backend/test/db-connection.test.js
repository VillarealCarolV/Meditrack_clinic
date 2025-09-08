const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'meditrack_test'
};

// Test database connection and basic operations
async function testDatabase() {
  let connection;
  
  try {
    // Create a connection to the database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Successfully connected to the database.');

    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Test query result:', rows[0].result);

    // Test creating a table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS test_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Test table created or already exists');

    // Test inserting data
    const [insertResult] = await connection.execute(
      'INSERT INTO test_users (email, role) VALUES (?, ?)',
      ['test@example.com', 'doctor']
    );
    console.log('✅ Test data inserted, ID:', insertResult.insertId);

    // Test reading data
    const [users] = await connection.execute('SELECT * FROM test_users');
    console.log('✅ Retrieved test users:', users);

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    // Clean up
    if (connection) {
      try {
        await connection.execute('DROP TABLE IF EXISTS test_users');
        console.log('✅ Test table cleaned up');
      } catch (error) {
        console.error('Error cleaning up test table:', error);
      }
      
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the test
testDatabase();
