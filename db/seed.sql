-- ===================================================
-- SOCIALPULSE AI — BASELINE SEED DATA
-- ===================================================

USE socialpulse_db;

INSERT INTO content_records (id, public_text, public_url, platform, published_at, language, topic, media_type, region, data_provenance, review_status)
VALUES 
('REC-2026-001', 'URGENT SECURITY ALERT: Your national savings banking account has been temporarily suspended due to unusual activity. Click immediately http://bank-secure-auth.cc/verify to confirm your 6-digit OTP code and unlock funds.', 'https://social.example/posts/991204', 'Telegram', '2026-10-14 10:15:00', 'English', 'Banking Security Fraud', 'external_link', 'North America / Multi-Region', 'Synthetic Demo', 'escalated'),
('REC-2026-002', 'BREAKING: Central Reserve Bank has ordered an emergency $500 ATM withdrawal cap nationwide starting Friday due to currency shortages. Withdraw all cash now!', 'https://social.example/posts/882103', 'X (Twitter)', '2026-10-14 08:30:00', 'English', 'Financial Panic Rumor', 'text_only', 'National Capital Region', 'Synthetic Demo', 'under_review'),
('REC-2026-003', 'Department of Transportation publishes Line 4 passenger timetable. High-speed rail revenue service opens November 15.', 'https://social.example/posts/771920', 'Reddit', '2026-10-13 16:20:00', 'English', 'Civic Infrastructure', 'text_only', 'Metropolitan District', 'Synthetic Demo', 'reviewed'),
('REC-2026-004', 'Apply now for government $1,200 emergency utility grant rebate! Everyone is eligible! Enter account details here: http://claim-energy-relief.xyz/apply', 'https://social.example/posts/662018', 'Facebook', '2026-10-13 14:10:00', 'English', 'Utility Subsidy Scam', 'external_link', 'Western Provinces', 'Synthetic Demo', 'new');

INSERT INTO detection_results (content_id, risk_score, category, severity, explanation, recommended_action, has_urgency_language, has_credential_request, has_suspicious_link)
VALUES
('REC-2026-001', 94, 'cybercrime_phishing', 'critical', 'Urgency coercion soliciting 6-digit OTP code via lookalike .cc domain.', 'Escalate to cyber-fraud unit; submit hostname to Safe Browsing blacklist.', TRUE, TRUE, TRUE),
('REC-2026-002', 86, 'misinformation', 'critical', 'Sensational claim alleging an emergency withdrawal freeze without gazette documentation.', 'Cross-reference with statutory monetary releases; distribute verified fact-check debunk.', TRUE, FALSE, FALSE),
('REC-2026-003', 12, 'benign_public', 'low', 'Factual civic infrastructure update aligning with public government records.', 'No review necessary; nominal public communication.', FALSE, FALSE, FALSE),
('REC-2026-004', 89, 'cybercrime_scam', 'critical', 'Fraudulent utility subsidy lure redirecting users to an unverified .xyz data collection form.', 'Add URL to threat watch list; publish consumer protection advisory.', TRUE, TRUE, TRUE);

INSERT INTO alerts (id, content_id, title, category, severity, risk_score, explanation, review_status, assigned_to)
VALUES
('ALT-1001', 'REC-2026-001', 'Active Phishing Campaign: Banking Credential & OTP Harvest', 'cybercrime_phishing', 'critical', 94, 'High-urgency lure soliciting 6-digit OTP code via unauthorized web portal.', 'escalated', 'Alex Rivera'),
('ALT-1002', 'REC-2026-002', 'High-Velocity Bank Run Disinformation Rumor', 'misinformation', 'critical', 86, 'Unsubstantiated claim of nationwide ATM cash restriction with high spread velocity.', 'under_review', 'Maya Chen'),
('ALT-1003', 'REC-2026-004', 'Coordinated Utility Subsidy Phishing Ring', 'cybercrime_scam', 'high', 89, 'Multiple accounts detected broadcasting identical scam URL targeting household subsidy seekers.', 'new', NULL);
