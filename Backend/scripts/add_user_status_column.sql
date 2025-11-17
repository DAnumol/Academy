-- Add status column to users table
ALTER TABLE users 
ADD COLUMN status ENUM('Active', 'Inactive', 'Pending') 
NOT NULL DEFAULT 'Active';

-- Update existing users to have Active status
UPDATE users SET status = 'Active' WHERE status IS NULL;