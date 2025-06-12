-- Connect to your MySQL database using your preferred MySQL client
-- Then run these SQL commands:

-- Make sure to use the emr database
USE emr;

-- Create admin user if not exists
INSERT INTO Users (email, password, role, status, createdAt, updatedAt)
SELECT 'admin@meditrack.com', 
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password is 'admin123' (hashed)
       'admin',
       'active',
       NOW(),
       NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM Users WHERE email = 'admin@meditrack.com'
);

-- Verify the user was created
SELECT * FROM Users WHERE email = 'admin@meditrack.com';
