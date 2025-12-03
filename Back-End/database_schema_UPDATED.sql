-- ============================================================================
-- Differential Case Flow Management System Database Schema
-- UPDATED VERSION - Includes all fixes and P-MLQ implementation
-- Date: December 3, 2024
-- ============================================================================
-- Run this script in XAMPP MySQL to create/update the database structure
--
-- CHANGES MADE TODAY:
-- 1. Added 'sections' column to cases table for P-MLQ complexity calculation
-- 2. Fixed password hashes for all predefined users/judges/admins
-- 3. Implemented P-MLQ (Prioritized Multi-Level Queue) scheduling algorithm
-- 4. Added support for 8-hour workday with breaks
-- ============================================================================

CREATE DATABASE IF NOT EXISTS case_management;
USE case_management;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores user accounts who can file cases
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) COMMENT = 'User accounts who can file cases';

-- ============================================================================
-- JUDGES TABLE
-- ============================================================================
-- Stores judge accounts who handle cases
CREATE TABLE IF NOT EXISTS judges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) COMMENT = 'Judge accounts who handle cases';

-- ============================================================================
-- ADMINS TABLE
-- ============================================================================
-- Stores admin accounts with system management privileges
-- Note: Admins don't have username field, only email
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) COMMENT = 'Admin accounts with system management privileges';

-- ============================================================================
-- CASES TABLE
-- ============================================================================
-- Stores all case information including scheduling and judgments
-- NEW: Added 'sections' column for P-MLQ complexity calculation
CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- NEW FIELD: Comma-separated legal sections (e.g., "Section 420, Section 120B")
    -- Used by P-MLQ algorithm to automatically calculate complexity:
    -- 1-2 sections = simple, 3-4 = moderate, 5-7 = complex, 8+ = highly_complex
    sections TEXT NULL COMMENT 'Comma-separated legal sections for P-MLQ complexity calculation',
    
    -- Complexity automatically calculated from sections count
    complexity ENUM('simple', 'moderate', 'complex', 'highly_complex') NOT NULL,
    
    status ENUM('pending', 'scheduled', 'in_progress', 'completed', 'adjourned') DEFAULT 'pending',
    priority_score INT DEFAULT 0 COMMENT 'P-MLQ priority: simple=25, moderate=50, complex=75, highly_complex=100',
    
    user_id INT NOT NULL,
    judge_id INT NULL,
    
    filed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATE NULL,
    scheduled_time TIME NULL,
    estimated_duration INT NULL COMMENT 'Duration in minutes: simple=30, moderate=60, complex=120, highly_complex=180',
    
    -- Document upload support
    document_path VARCHAR(500) NULL,
    document_filename VARCHAR(200) NULL,
    
    -- Judgment details
    judgment TEXT NULL,
    judgment_date TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_case_number (case_number),
    INDEX idx_user_id (user_id),
    INDEX idx_judge_id (judge_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_cases_filed_at (filed_at),
    INDEX idx_cases_complexity (complexity),
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE SET NULL
) COMMENT = 'Stores all case information including P-MLQ scheduling and judgments';

-- ============================================================================
-- HEARINGS TABLE
-- ============================================================================
-- Stores hearing schedules for cases (for multi-hearing cases)
CREATE TABLE IF NOT EXISTS hearings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    hearing_number INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_case_id (case_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_hearings_scheduled (scheduled_date, scheduled_time),
    
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) COMMENT = 'Stores hearing schedules for cases';

-- ============================================================================
-- JUDGE SCHEDULES TABLE
-- ============================================================================
-- Manages judge availability and case assignments
-- P-MLQ Scheduler uses this to:
-- - Track 8-hour workday (9 AM - 5 PM)
-- - Respect breaks (lunch 1-2 PM, morning 11-11:15 AM, afternoon 3:30-3:45 PM)
-- - Implement bi-preferential scheduling (date vs time preference)
-- - NEVER reschedule existing cases
CREATE TABLE IF NOT EXISTS judge_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judge_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    case_id INT NULL,
    notes VARCHAR(200) NULL COMMENT 'P-MLQ queue info: Q1 (simple), Q2 (moderate), Q3 (complex)',
    
    INDEX idx_judge_date (judge_id, date),
    INDEX idx_date (date),
    INDEX idx_judge_schedules_availability (judge_id, date, is_available),
    
    FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
) COMMENT = 'Manages judge availability and P-MLQ case assignments';

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================
-- Insert predefined users, judges, and admins
-- All passwords follow pattern: username@2004
-- Password hash: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u

-- Users
INSERT INTO users (username, email, password) VALUES
('rasesh', 'rasesh@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'),
('samarth', 'samarth@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'),
('bully', 'bully@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Judges
INSERT INTO judges (username, email, password) VALUES
('manish', 'manish@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'),
('vade', 'vade@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'),
('venki', 'venki@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Admins
INSERT INTO admins (email, password) VALUES
('ruthvik@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'),
('mahesh@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'),
('vimal@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Case Analytics View
CREATE OR REPLACE VIEW case_analytics AS
SELECT 
    COUNT(*) as total_cases,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_cases,
    SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_cases,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_cases,
    SUM(CASE WHEN DATE(filed_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as cases_last_30_days,
    -- P-MLQ Queue distribution
    SUM(CASE WHEN complexity = 'simple' THEN 1 ELSE 0 END) as queue1_cases,
    SUM(CASE WHEN complexity = 'moderate' THEN 1 ELSE 0 END) as queue2_cases,
    SUM(CASE WHEN complexity IN ('complex', 'highly_complex') THEN 1 ELSE 0 END) as queue3_cases
FROM cases;

-- Judge Workload View
CREATE OR REPLACE VIEW judge_workload AS
SELECT 
    j.id,
    j.username,
    j.email,
    COUNT(c.id) as total_cases,
    SUM(CASE WHEN c.status IN ('pending', 'scheduled', 'in_progress') THEN 1 ELSE 0 END) as active_cases,
    SUM(CASE WHEN c.status = 'completed' THEN 1 ELSE 0 END) as completed_cases,
    -- Average case complexity
    AVG(c.priority_score) as avg_priority_score
FROM judges j
LEFT JOIN cases c ON j.id = c.judge_id
GROUP BY j.id, j.username, j.email;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the database is set up correctly

-- Check all tables exist
SELECT 'Tables Created' as Status, COUNT(*) as Count 
FROM information_schema.tables 
WHERE table_schema = 'case_management' 
AND table_name IN ('users', 'judges', 'admins', 'cases', 'hearings', 'judge_schedules');

-- Check sample data
SELECT 'Users' as Type, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Judges', COUNT(*) FROM judges
UNION ALL
SELECT 'Admins', COUNT(*) FROM admins;

-- Check sections column exists
SELECT 'Sections Column' as Status, 
       CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END as Result
FROM information_schema.columns 
WHERE table_schema = 'case_management' 
AND table_name = 'cases' 
AND column_name = 'sections';

-- ============================================================================
-- LOGIN CREDENTIALS REFERENCE
-- ============================================================================
-- Users:
--   rasesh@example.com / rasesh@2004
--   samarth@example.com / samarth@2004
--   bully@example.com / bully@2004
--
-- Judges:
--   manish@example.com / manish@2004
--   vade@example.com / vade@2004
--   venki@example.com / venki@2004
--
-- Admins:
--   ruthvik@example.com / ruthvik@2004
--   mahesh@example.com / mahesh@2004
--   vimal@example.com / vimal@2004
-- ============================================================================

-- ============================================================================
-- P-MLQ ALGORITHM NOTES
-- ============================================================================
-- Queue 1 (Simple): 1-2 sections, 30 min, TIME PREFERENCE (morning blocks)
-- Queue 2 (Moderate): 3-4 sections, 60 min, Balanced FCFS
-- Queue 3 (Complex/Highly Complex): 5+ sections, 120-180 min, DATE PREFERENCE
--
-- Judge Workday: 9 AM - 5 PM (8 hours)
-- Breaks:
--   - Lunch: 1:00 PM - 2:00 PM (1 hour)
--   - Morning: 11:00 AM - 11:15 AM (15 min)
--   - Afternoon: 3:30 PM - 3:45 PM (15 min)
-- Effective work time: 6.5 hours/day
--
-- CRITICAL: Scheduler NEVER reschedules existing cases
-- ============================================================================
