-- Fix passwords for all predefined users
-- Run this in phpMyAdmin SQL tab

USE case_management;

-- The password hash for all passwords (username@2004)
-- This is bcrypt hash of the password
SET @password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u';

-- Update Users
UPDATE users SET password = @password_hash WHERE email = 'rasesh@example.com';
UPDATE users SET password = @password_hash WHERE email = 'samarth@example.com';
UPDATE users SET password = @password_hash WHERE email = 'bully@example.com';

-- Update Judges
UPDATE judges SET password = @password_hash WHERE email = 'manish@example.com';
UPDATE judges SET password = @password_hash WHERE email = 'vade@example.com';
UPDATE judges SET password = @password_hash WHERE email = 'venki@example.com';

-- Update Admins
UPDATE admins SET password = @password_hash WHERE email = 'ruthvik@example.com';
UPDATE admins SET password = @password_hash WHERE email = 'mahesh@example.com';
UPDATE admins SET password = @password_hash WHERE email = 'vimal@example.com';

-- Verify the updates
SELECT 'Users:' as Type, email, username FROM users;
SELECT 'Judges:' as Type, email, username FROM judges;
SELECT 'Admins:' as Type, email, 'N/A' as username FROM admins;
