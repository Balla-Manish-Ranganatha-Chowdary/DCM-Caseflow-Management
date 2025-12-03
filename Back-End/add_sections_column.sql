-- Migration script to add sections column to cases table
-- Run this in phpMyAdmin if you already have the database

USE case_management;

-- Add sections column if it doesn't exist
ALTER TABLE cases 
ADD COLUMN IF NOT EXISTS sections TEXT NULL COMMENT 'Comma-separated legal sections' 
AFTER description;

-- Verify the change
DESCRIBE cases;
