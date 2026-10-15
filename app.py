"""
SocialPulse AI — Flask REST Backend
College Hackathon Project Engine
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
import datetime
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# In-Memory Incident Store for Local / Demo Execution
DEMO_STORE = {
    "content": [
        {
            "id": "REC-2026-001",
            "publicText": "URGENT SECURITY ALERT: Your national savings banking account has been temporarily suspended due to unusual activity. Click immediately http://bank-secure-auth.cc/verify to confirm your 6-digit OTP code and unlock funds.",
            "publicUrl": "https://social.example/posts/991204",
            "platform": "Telegram",
            "timestamp": "2026-10-14T10:15:00Z",
            "language": "English",
            "topic": "Banking Security Fraud",
            "mediaType": "external_link",
            "region": "North America / Multi-Region",
            "detection": {
                "riskScore": 94,
                "category": "cybercrime_phishing",
                "severity": "critical",
                "matchedIndicators": [
                    "High-urgency language ('URGENT', 'immediately', 'suspended')",
                    "Direct request for OTP / two-factor code",
                    "Disposable top-level domain (.cc)"
                ],
                "explanation": "Solicits 6-digit OTP code through lookalike banking domain using fear-based urgency.",
                "recommendedAction": "Submit domain to blacklist; escalate to fraud operations.",
                "verificationStatus": "Disputed"
            },
            "reviewStatus": "escalated",
            "reviewerNotes": "Reported to registrar abuse contact.",
            "dataProvenance": "Synthetic Demo"
        },
        {
            "id": "REC-2026-002",
            "publicText": "BREAKING: Central Reserve Bank has ordered an emergency $500 ATM withdrawal cap nationwide starting Friday due to currency shortages. Withdraw all cash now!",
            "publicUrl": "https://social.example/posts/882103",
            "platform": "X (Twitter)",
            "timestamp": "2026-10-14T08:30:00Z",
            "language": "English",
            "topic": "Financial Panic Rumor",
            "mediaType": "text_only",
            "region": "National Capital Region",
            "detection": {
                "riskScore": 86,
                "category": "misinformation",
                "severity": "critical",
                "matchedIndicators": [
                    "Unsupported extraordinary liquidity freeze claim",
                    "Urgency coercion ('Withdraw all cash now')",
                    "Absence of statutory gazette notice"
                ],
                "explanation": "Sensational cash withdrawal restriction claim lacking official corroboration.",
                "recommendedAction": "Cross-reference official releases; publish fact-check debunk.",
                "verificationStatus": "Disputed"
            },
            "reviewStatus": "under_review",
            "reviewerNotes": "Central bank issued public rebuttal bulletin.",
            "dataProvenance": "Synthetic Demo"
        }
    ],
    "alerts": [
        {
            "id": "ALT-1001",
            "title": "Active Phishing Campaign: Banking Credential & OTP Harvest",
            "category": "cybercrime_phishing",
            "severity": "critical",
            "riskScore": 94,
            "timestamp": "2026-10-14T10:18:00Z",
            "relatedContentId": "REC-2026-001",
            "relatedContentSnippet": "URGENT SECURITY ALERT: Your national savings banking account has been temporarily suspended...",
            "explanation": "High-urgency lure soliciting 6-digit OTP codes via unauthorized domain.",
            "recommendedReviewAction": "Submit domain to CERT and blocklist.",
            "reviewStatus": "escalated",
            "assignedTo": "Alex Rivera"
        }
    ]
}

def run_detection_pipeline(text: str):
    lower = text.lower()
    matched = []
    score = 0

    # 1. Urgency / Coercion
    urgency = ['urgent', 'immediately', 'suspended', 'withdraw now', 'act now', 'emergency', 'freeze']
    if any(w in lower for w in urgency):
        matched.append("High-urgency / coercive phrasing detected")
        score += 25

    # 2. OTP / Credential Prompts
    cred = ['otp', 'password', '6-digit', 'pin', 'account details', 'login details', 'verify identity']
    if any(w in lower for w in cred):
        matched.append("Direct solicitation of credentials or OTPs")
        score += 40

    # 3. Suspicious Links & Domains
    has_url = bool(re.search(r'https?://[^\s]+', text))
    suspicious_tld = any(tld in lower for tld in ['.cc', '.xyz', '.top', '.click', '.tk'])
    has_link_kw = any(k in lower for k in ['claim', 'verify', 'secure-auth', 'portal'])
    is_suspicious_link = has_url and (suspicious_tld or has_link_kw)

    if is_suspicious_link:
        matched.append("Suspicious URL structure with lookalike domain or high-risk TLD")
        score += 30
    elif has_url:
        matched.append("Contains external URL requiring review")
        score += 10

    # 4. Categorization
    category = "benign_public"
    if any(w in lower for w in cred) and is_suspicious_link:
        category = "cybercrime_phishing"
    elif is_suspicious_link or "grant" in lower or "rebate" in lower or "lottery" in lower:
        category = "cybercrime_scam"
    elif any(w in lower for w in urgency) and ("bank" in lower or "limit" in lower):
        category = "misinformation"
    elif "protest" in lower or "blockade" in lower:
        category = "emerging_tension"

    final_score = min(99, max(5, score))
    severity = "low"
    if final_score >= 80:
        severity = "critical"
    elif final_score >= 60:
        severity = "high"
    elif final_score >= 35:
        severity = "medium"

    return {
        "riskScore": final_score,
        "category": category,
        "severity": severity,
        "matchedIndicators": matched,
        "explanation": f"Classified as {category} based on {len(matched)} explainable linguistic markers.",
        "recommendedAction": "Triage according to severity index.",
        "verificationStatus": "Needs Review" if severity in ["high", "critical"] else "Supported by Available Evidence"
    }

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "SocialPulse AI Flask Backend",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "mode": "demo_ready"
    })

@app.route('/api/dashboard/summary', methods=['GET'])
def summary():
    return jsonify({
        "totalPostsProcessed": len(DEMO_STORE["content"]) + 1240,
        "itemsFlaggedForReview": 46,
        "potentialCybercrimeCount": 21,
        "emergingTopicsCount": 3,
        "highPriorityAlertsCount": len(DEMO_STORE["alerts"]),
        "dataFreshnessTimestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "isDemoData": True
    })

@app.route('/api/content', methods=['GET', 'POST'])
def content_handler():
    if request.method == 'POST':
        data = request.get_json() or {}
        text = data.get('publicText', '').strip()
        if len(text) < 5:
            return jsonify({"error": "Post text too short"}), 400

        detection = run_detection_pipeline(text)
        rec_id = f"REC-FLASK-{int(datetime.datetime.utcnow().timestamp())}"
        new_rec = {
            "id": rec_id,
            "publicText": text,
            "platform": data.get('platform', 'Web Forum'),
            "topic": data.get('topic', 'General Public Discourse'),
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "detection": detection,
            "reviewStatus": "new" if detection["severity"] in ["critical", "high"] else "reviewed",
            "dataProvenance": "Manual Submission"
        }
        DEMO_STORE["content"].insert(0, new_rec)

        if detection["severity"] in ["critical", "high"]:
            alt_id = f"ALT-{int(datetime.datetime.utcnow().timestamp())}"
            DEMO_STORE["alerts"].insert(0, {
                "id": alt_id,
                "title": f"{detection['category'].upper()}: {text[:50]}...",
                "category": detection["category"],
                "severity": detection["severity"],
                "riskScore": detection["riskScore"],
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "relatedContentId": rec_id,
                "relatedContentSnippet": text[:100],
                "explanation": detection["explanation"],
                "recommendedReviewAction": detection["recommendedAction"],
                "reviewStatus": "new"
            })

        return jsonify(new_rec), 201

    return jsonify(DEMO_STORE["content"])

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json() or {}
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Text is required"}), 400
    res = run_detection_pipeline(text)
    return jsonify({"originalText": text, **res})

@app.route('/api/alerts', methods=['GET'])
def alerts_handler():
    return jsonify(DEMO_STORE["alerts"])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
