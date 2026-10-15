-- ===================================================
-- SOCIALPULSE AI — PRODUCTION MYSQL DATABASE SCHEMA
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- ===================================================

CREATE DATABASE IF NOT EXISTS socialpulse_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE socialpulse_db;

-- 1. Core Ingested Public Content
CREATE TABLE IF NOT EXISTS content_records (
  id VARCHAR(64) PRIMARY KEY,
  public_text TEXT NOT NULL,
  public_url VARCHAR(512) NULL,
  platform VARCHAR(64) NOT NULL,
  published_at DATETIME NOT NULL,
  language VARCHAR(32) DEFAULT 'English',
  topic VARCHAR(128) NOT NULL,
  media_type ENUM('text_only', 'image_graphic', 'video_clip', 'external_link') DEFAULT 'text_only',
  media_filename VARCHAR(255) NULL,
  extracted_ocr TEXT NULL,
  region VARCHAR(128) DEFAULT 'Global',
  data_provenance ENUM('Synthetic Demo', 'Manual Submission', 'CSV Ingested', 'Public RSS/API') DEFAULT 'Synthetic Demo',
  review_status ENUM('new', 'under_review', 'escalated', 'reviewed', 'resolved') DEFAULT 'new',
  reviewer_notes TEXT NULL,
  reviewed_by VARCHAR(128) NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_platform (platform),
  INDEX idx_review_status (review_status),
  INDEX idx_published_at (published_at)
) ENGINE=InnoDB;

-- 2. Detection Results & Linguistic Heuristics
CREATE TABLE IF NOT EXISTS detection_results (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  content_id VARCHAR(64) NOT NULL,
  risk_score INT NOT NULL,
  category VARCHAR(64) NOT NULL,
  severity ENUM('critical', 'high', 'medium', 'low') NOT NULL,
  explanation TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  evidence_confidence INT DEFAULT 90,
  verification_status VARCHAR(64) DEFAULT 'Unverified',
  has_urgency_language BOOLEAN DEFAULT FALSE,
  has_credential_request BOOLEAN DEFAULT FALSE,
  has_suspicious_link BOOLEAN DEFAULT FALSE,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content_records(id) ON DELETE CASCADE,
  INDEX idx_risk_score (risk_score),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- 3. Alerts & Review Escalations
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  content_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  severity ENUM('critical', 'high', 'medium', 'low') NOT NULL,
  risk_score INT NOT NULL,
  explanation TEXT NOT NULL,
  review_status ENUM('new', 'under_review', 'escalated', 'resolved') DEFAULT 'new',
  reviewer_notes TEXT NULL,
  assigned_to VARCHAR(128) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content_records(id) ON DELETE CASCADE,
  INDEX idx_severity (severity),
  INDEX idx_status (review_status)
) ENGINE=InnoDB;

-- 4. Coordination Clusters (TF-IDF Similarity)
CREATE TABLE IF NOT EXISTS coordination_clusters (
  cluster_id VARCHAR(64) PRIMARY KEY,
  topic VARCHAR(128) NOT NULL,
  similar_post_count INT DEFAULT 1,
  time_window_hours FLOAT DEFAULT 24.0,
  similarity_score FLOAT NOT NULL,
  burst_detected BOOLEAN DEFAULT FALSE,
  review_status VARCHAR(32) DEFAULT 'under_review',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Data Sources Registry
CREATE TABLE IF NOT EXISTS data_sources (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  source_type VARCHAR(64) NOT NULL,
  status ENUM('active', 'degraded', 'standby') DEFAULT 'active',
  rate_limit_info VARCHAR(255) NULL,
  last_sync DATETIME NULL
) ENGINE=InnoDB;
