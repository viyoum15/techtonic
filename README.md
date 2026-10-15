# SocialPulse AI — Social Media Threat Intelligence & Public Discourse Monitoring

SocialPulse AI is an AI and explainable rule-based platform designed to monitor publicly available social-media discourse and early indicators of:
- **Misinformation & Sensational Claims** (fear-based urgency, unsupported certainty, lack of statutory gazettes)
- **Cybercrime Signals** (phishing, fake banking SMS requesting 6-digit OTPs, lookalike domains, subsidy lures)
- **Coordinated Inauthentic Activity** (TF-IDF lexical similarity, temporal bursts, copy-paste clusters)
- **Emerging Topics & Keyword Velocity** (sudden volume spikes exceeding 14-day rolling statistical baselines)

---

## 1. Colour Palette (Mineral & Botanical Tones)

The UI avoids dark hacker themes and purple AI gradients, utilizing a human-centered light palette:
- **Deep Mineral Teal (`#203B3A`)**: Top bar, primary navigation, emphasis
- **Muted Eucalyptus (`#829B8B`)**: Secondary badges, subtle dividers, informational icons
- **Warm Parchment (`#F0EBDD`)**: Surface cards, stat panels, interactive buttons
- **Dusty Terracotta (`#C47F68`)**: Warnings and medium/high alerts
- **Desaturated Citron (`#C5C77A`)**: Positive indicators and verified status
- **Slate Charcoal (`#303B3B`)**: High-contrast body text
- **Soft Mist (`#DCE4DE`)**: Card borders and hairline dividers
- **Muted Rose (`#B96D70`)**: Critical threats and cybercrime indicators

---

## 2. Architecture & Modules

### 10 Navigation Modules:
1. **Overview Dashboard**: Processed counts, flagged alerts, category breakdown, volume over time, topic velocity, recent activity, source distribution.
2. **Content Explorer**: Searchable, paginated repository with filters (Category, Severity, Review Status, Platform), drawer view, and formula-injection-safe CSV export.
3. **Misinformation Analysis**: Linguistic urgency and certainty heuristics, verification status, and pluggable fact-check registry lookup.
4. **Cybercrime Signals**: Phishing detector, lookalike URL scanner, sandboxed link analysis, and the required fake bank OTP message scenario.
5. **Coordination Monitor**: TF-IDF lexical similarity clustering, burst analysis, shared link detection, and sample cluster records.
6. **Emerging Topics**: 14-day baseline velocity multipliers (+12.2x spikes), top keyword frequency, and recurring phrases.
7. **Trends & Geography**: Temporal diurnal 24h hourly distribution, risk category share, and privacy-preserving macro-regional aggregation.
8. **Alerts & Review**: Human-in-the-loop triage queue, investigator assignments, review notes, and resolution actions.
9. **Reports & Export**: Executive intelligence dossiers, printable view, and CSV export.
10. **Settings & Schema**: MySQL DDL, Windows setup guide, and active connector status.

---

## 3. Local Setup Instructions for Windows & VS Code

### Prerequisites:
- Node.js (v18+)
- Python (3.10+)
- MySQL Server (via XAMPP, MySQL Installer, or Docker)

### Step 1: Clone and Open
```bash
git clone https://github.com/example/socialpulse-ai.git
cd socialpulse-ai
code .
```

### Step 2: Initialize MySQL Database
```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

### Step 3: Run the Application
In VS Code terminal:
```bash
# Install dependencies
npm install

# Start full-stack server (includes Express REST API + Vite Client):
npm run dev
```

Visit in browser: **http://localhost:3000**

---

## 4. API Endpoints Reference

- `GET /api/health`: Health status & operational modes.
- `GET /api/dashboard/summary`: Calculated metrics from stored records.
- `GET /api/content`: Search and filter monitored public posts.
- `POST /api/content`: Ingest public post with instant detection pipeline.
- `POST /api/content/import`: Batch import posts via CSV.
- `POST /api/content/:id/review`: Record human reviewer notes & update status.
- `POST /api/analyze`: Ad-hoc text evaluation for threat scoring.
- `GET /api/alerts`: Triage queue of generated alerts.
- `PATCH /api/alerts/:id`: Update alert status, assignee, and review notes.
- `GET /api/topics`: Emerging topics with statistical velocity ratios.
- `GET /api/trends`: Time-series trends and category distributions.
- `GET /api/coordination`: TF-IDF similarity clusters.
- `GET /api/reports/summary`: Executive report metrics.
- `GET /api/sources`: Status of public intake adapters.
- `POST /api/reseed`: Restore initial synthetic dataset.

---

## 5. Hackathon End-to-End Presentation Script

1. **Overview Dashboard**: Show real-time KPI tiles, 7-day volume chart, and emerging topic velocity (+12.2x spike in Banking Panic).
2. **Manual Ingestion**: Click **"+ Ingest Post"** in top bar. Submit:
   `"URGENT: Your bank account is locked! Enter 6-digit OTP at http://bank-auth.cc to verify."`
3. **Detection Rationale**: Watch the explainable engine flag it as **Critical (94/100) — Cybercrime Phishing**, citing the OTP request and lookalike domain.
4. **Alert Queue**: Navigate to **Alerts & Review**, open the new alert, assign an investigator, add review notes, and escalate.
5. **Content Explorer**: Filter by `Cybercrime Phishing`, inspect the record drawer, and click **Export Filtered CSV** to demonstrate safe spreadsheet export.
6. **Coordination Monitor**: Review the **Banking Liquidity Panic** cluster showing 91% lexical similarity across 18 accounts in 3.5 hours.
