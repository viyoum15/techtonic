import React, { useState } from 'react';
import { DataSourceStatus } from '../../types';
import { api } from '../../api/client';
import {
  Settings,
  Database,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Check,
  Copy,
  Layers
} from 'lucide-react';

interface SettingsSchemaProps {
  sources: DataSourceStatus[];
}

export const SettingsSchema: React.FC<SettingsSchemaProps> = ({ sources }) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCmds, setCopiedCmds] = useState(false);
  const [reseeded, setReseeded] = useState(false);

  const mysqlSchemaCode = `-- ===================================================
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

-- 5. Ingestion Jobs
CREATE TABLE IF NOT EXISTS ingestion_jobs (
  job_id VARCHAR(64) PRIMARY KEY,
  source_name VARCHAR(128) NOT NULL,
  records_received INT DEFAULT 0,
  records_processed INT DEFAULT 0,
  records_flagged INT DEFAULT 0,
  errors_encountered INT DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;`;

  const windowsSetupGuide = `# ===================================================
# SOCIALPULSE AI — WINDOWS & VS CODE SETUP GUIDE
# ===================================================

# 1. Clone or Open Project in VS Code
cd socialpulse-ai

# 2. Setup MySQL Database
# Start MySQL Service (via XAMPP, MySQL Workbench, or Service Manager)
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql

# 3. Setup Python Virtual Environment (Flask Backend Mode)
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt

# 4. Setup Environment Variables
copy .env.example .env
# Edit .env to set:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=socialpulse_db

# 5. Run Development Servers
# Terminal A (Flask Backend on port 5000 or Express Full-stack):
python app.py
# or: npm run dev

# Terminal B (React Frontend):
npm install
npm run dev

# 6. Access in Browser:
# http://localhost:3000`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(mysqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyCmds = () => {
    navigator.clipboard.writeText(windowsSetupGuide);
    setCopiedCmds(true);
    setTimeout(() => setCopiedCmds(false), 2000);
  };

  const handleReseed = async () => {
    try {
      await api.reseedDatabase();
      setReseeded(true);
      setTimeout(() => setReseeded(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#DCE4DE]">
        <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
          Settings, Database Architecture & Setup Guide
        </h1>
        <p className="text-xs text-[#303B3B]/80 mt-1">
          Complete MySQL production schema, Windows laptop VS Code instructions, data source status, and baseline controls.
        </p>
      </div>

      {/* Data Source Registry */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#203B3A] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#829B8B]" />
          <span>Active Data Sources & Ingestion Connectors</span>
        </h2>

        <div className="divide-y divide-[#DCE4DE]/50">
          {sources.map(src => (
            <div key={src.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-[#203B3A] block">{src.name}</span>
                <span className="text-[11px] text-[#829B8B] font-mono">{src.type} · Rate: {src.rateLimitNote}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#303B3B]/70 font-mono">
                  Processed 24h: {src.recordsProcessed24h}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] font-bold border border-[#829B8B]/40 uppercase">
                  {src.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Windows & VS Code Setup Instructions */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE4DE]">
          <h2 className="text-sm font-bold text-[#203B3A] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#829B8B]" />
            <span>Windows & VS Code Local Startup Guide</span>
          </h2>
          <button
            onClick={handleCopyCmds}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#203B3A] bg-[#F0EBDD] hover:bg-[#DCE4DE] rounded-md transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedCmds ? 'Copied Commands!' : 'Copy Commands'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#203B3A] text-[#F0EBDD] rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
          {windowsSetupGuide}
        </pre>
      </div>

      {/* MySQL Production Schema Code */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE4DE]">
          <h2 className="text-sm font-bold text-[#203B3A] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#829B8B]" />
            <span>MySQL Schema DDL (`db/schema.sql`)</span>
          </h2>
          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#203B3A] bg-[#F0EBDD] hover:bg-[#DCE4DE] rounded-md transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#F8F6F0] border border-[#DCE4DE] text-[#203B3A] rounded-lg text-xs font-mono overflow-x-auto max-h-72 leading-relaxed">
          {mysqlSchemaCode}
        </pre>
      </div>

      {/* Baseline Reseed Controls */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-[#203B3A] uppercase tracking-wider">
          Reset Synthetic Demo Baseline
        </h3>
        <p className="text-xs text-[#303B3B]/80">
          Restore initial hackathon baseline posts, cybercrime alerts, and coordination clusters.
        </p>
        <button
          onClick={handleReseed}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#203B3A] bg-[#F0EBDD] hover:bg-[#DCE4DE] rounded-lg border border-[#829B8B]/40 transition-colors"
        >
          {reseeded ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#203B3A]" />
              <span>Synthetic Baseline Reseeded!</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-[#203B3A]" />
              <span>Reseed Demo Dataset</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
