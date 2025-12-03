-- ============================================================================
-- Differential Case Flow Management System Database Schema
-- UPDATED: December 3, 2024 - Includes P-MLQ Implementation
-- ============================================================================
-- Run this script in XAMPP MySQL to create the database structure
--
-- RECENT CHANGES:
-- 1. Added 'sections' column for P-MLQ complexity calculation
-- 2. Fixed password hashes for all users/judges/admins
-- 3. Added P-MLQ scheduling support with 8-hour workday and breaks
-- ============================================================================

CREATE DATABASE IF NOT EXISTS case_management;
USE case_management;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Judges table
CREATE TABLE judges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Cases table
-- P-MLQ Implementation: Complexity calculated from sections count
-- 1-2 sections=simple(30min), 3-4=moderate(60min), 5-7=complex(120min), 8+=highly_complex(180min)
CREATE TABLE cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    sections TEXT NULL COMMENT 'Comma-separated legal sections (e.g., Section 420, Section 120B)',
    complexity ENUM('simple', 'moderate', 'complex', 'highly_complex') NOT NULL,
    status ENUM('pending', 'scheduled', 'in_progress', 'completed', 'adjourned') DEFAULT 'pending',
    priority_score INT DEFAULT 0 COMMENT 'P-MLQ: simple=25, moderate=50, complex=75, highly_complex=100',
    user_id INT NOT NULL,
    judge_id INT NULL,
    filed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_date DATE NULL,
    scheduled_time TIME NULL,
    estimated_duration INT NULL COMMENT 'Duration in minutes based on complexity',
    document_path VARCHAR(500) NULL,
    document_filename VARCHAR(200) NULL,
    judgment TEXT NULL,
    judgment_date TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    INDEX idx_case_number (case_number),
    INDEX idx_user_id (user_id),
    INDEX idx_judge_id (judge_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE SET NULL
);

-- Hearings table
CREATE TABLE hearings (
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
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Judge Schedules table
-- P-MLQ: Tracks 8-hour workday (9 AM-5 PM) with breaks
-- Breaks: Lunch 1-2 PM, Morning 11-11:15 AM, Afternoon 3:30-3:45 PM
CREATE TABLE judge_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judge_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    case_id INT NULL,
    notes VARCHAR(200) NULL COMMENT 'P-MLQ queue: Q1 (simple), Q2 (moderate), Q3 (complex)',
    INDEX idx_judge_date (judge_id, date),
    INDEX idx_date (date),
    FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
);

-- Insert sample data
INSERT INTO users (username, email, password) VALUES
('rasesh', 'rasesh@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'), -- rasesh@2004
('samarth', 'samarth@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'), -- samarth@2004
('bully', 'bully@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'); -- bully@2004

INSERT INTO judges (username, email, password) VALUES
('manish', 'manish@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'), -- manish@2004
('vade', 'vade@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'), -- vade@2004
('venki', 'venki@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'); -- venki@2004

INSERT INTO admins (email, password) VALUES
('ruthvik@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'), -- ruthvik@2004
('mahesh@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'), -- mahesh@2004
('vimal@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u'); -- vimal@2004

-- Create views for analytics
CREATE VIEW case_analytics AS
SELECT 
    COUNT(*) as total_cases,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_cases,
    SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled_cases,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_cases,
    SUM(CASE WHEN DATE(filed_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as cases_last_30_days
FROM cases;

CREATE VIEW judge_workload AS
SELECT 
    j.id,
    j.username,
    j.email,
    COUNT(c.id) as total_cases,
    SUM(CASE WHEN c.status IN ('pending', 'scheduled', 'in_progress') THEN 1 ELSE 0 END) as active_cases,
    SUM(CASE WHEN c.status = 'completed' THEN 1 ELSE 0 END) as completed_cases
FROM judges j
LEFT JOIN cases c ON j.id = c.judge_id
GROUP BY j.id, j.username, j.email;

-- Indexes for performance
CREATE INDEX idx_cases_filed_at ON cases(filed_at);
CREATE INDEX idx_cases_complexity ON cases(complexity);
CREATE INDEX idx_hearings_scheduled ON hearings(scheduled_date, scheduled_time);
CREATE INDEX idx_judge_schedules_availability ON judge_schedules(judge_id, date, is_available);

-- Comments
ALTER TABLE cases COMMENT = 'Stores all case information with P-MLQ scheduling';
ALTER TABLE hearings COMMENT = 'Stores hearing schedules for cases';
ALTER TABLE judge_schedules COMMENT = 'Manages judge availability with 8-hour workday and breaks';
ALTER TABLE users COMMENT = 'User accounts who can file cases';
ALTER TABLE judges COMMENT = 'Judge accounts who handle cases';
ALTER TABLE admins COMMENT = 'Admin accounts with system management privileges';

-- ============================================================================
-- LOGIN CREDENTIALS (All passwords: username@2004)
-- ============================================================================
-- Users: rasesh@example.com, samarth@example.com, bully@example.com
-- Judges: manish@example.com, vade@example.com, venki@example.com  
-- Admins: ruthvik@example.com, mahesh@example.com, vimal@example.com
-- ============================================================================