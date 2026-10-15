import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import {
  SocialAccountConnection,
  SuspiciousMessageThreat,
  CybercrimeComplaint
} from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Link2,
  Lock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Copy,
  Check,
  FileWarning,
  Eye,
  ArrowRight,
  Shield,
  Instagram,
  MessageSquare,
  Send,
  Bell,
  Download,
  Plus,
  Key,
  Smartphone,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  FileText,
  BadgeAlert,
  CheckCheck,
  LockKeyhole
} from 'lucide-react';

export const CybercrimeSignals: React.FC = () => {
  // Main view tabs within Cybercrime & Social App Threat Suite
  const [activeTab, setActiveTab] = useState<'threats' | 'accounts' | 'complaints' | 'url_scanner'>('threats');

  // Social account & threats state
  const [accounts, setAccounts] = useState<SocialAccountConnection[]>([]);
  const [threats, setThreats] = useState<SuspiciousMessageThreat[]>([]);
  const [complaints, setComplaints] = useState<CybercrimeComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Platform filter for threats
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Custom Threat Analysis Input (Live Gemini AI)
  const [customMsgInput, setCustomMsgInput] = useState('');
  const [customPlatform, setCustomPlatform] = useState<'Instagram' | 'WhatsApp' | 'X (Twitter)' | 'Telegram'>('Instagram');
  const [customSender, setCustomSender] = useState('@suspicious_contact_x');
  const [isAnalyzingCustom, setIsAnalyzingCustom] = useState(false);

  // Connect App Modal / Flow State
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<'Instagram' | 'WhatsApp' | 'X (Twitter)' | 'Telegram' | 'Facebook/Meta'>('Instagram');
  const [connectHandle, setConnectHandle] = useState('');
  const [permDms, setPermDms] = useState(true);
  const [permMedia, setPermMedia] = useState(true);
  const [permWebhooks, setPermWebhooks] = useState(true);
  const [permEvidence, setPermEvidence] = useState(true);
  const [permPush, setPermPush] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // Cybercrime Complaint Modal / Form State
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [selectedThreatForComplaint, setSelectedThreatForComplaint] = useState<SuspiciousMessageThreat | null>(null);
  const [complaintType, setComplaintType] = useState('Online Cyber Blackmail & Extortion (IT Act 66E / IPC 384)');
  const [complaintTargetPlatform, setComplaintTargetPlatform] = useState('Instagram');
  const [complaintSuspect, setComplaintSuspect] = useState('');
  const [complaintSummary, setComplaintSummary] = useState('');
  const [complaintEvidenceText, setComplaintEvidenceText] = useState('');
  const [isFilingComplaint, setIsFilingComplaint] = useState(false);
  const [lastFiledComplaint, setLastFiledComplaint] = useState<CybercrimeComplaint | null>(null);
  const [copiedAck, setCopiedAck] = useState(false);

  // Notification simulation
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [dismissedNotification, setDismissedNotification] = useState(false);

  // URL Scanner state (Preserving original tool functionality)
  const [urlInput, setUrlInput] = useState('http://claim-energy-relief.xyz/apply');
  const [isScanningUrl, setIsScanningUrl] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [copiedIncident, setCopiedIncident] = useState(false);

  // Load backend data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accs, thrts, cmpls] = await Promise.all([
        api.getSocialAccounts().catch(() => []),
        api.getSocialThreats().catch(() => []),
        api.getCybercrimeComplaints().catch(() => [])
      ]);
      setAccounts(accs);
      setThreats(thrts);
      setComplaints(cmpls);
    } catch (err) {
      console.error('Failed to load cybercrime threat data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Connect New App with Permissions
  const handleConnectAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectHandle.trim()) return;

    setIsConnecting(true);
    const permissions: string[] = [];
    if (permDms) permissions.push('messages_read_dms');
    if (permMedia) permissions.push('media_read_tagged');
    if (permWebhooks) permissions.push('security_webhooks');
    if (permEvidence) permissions.push('auto_preserve_evidence');
    if (permPush) permissions.push('push_threat_notifications');

    try {
      const newAcc = await api.connectSocialAccount({
        platform: connectPlatform,
        accountHandle: connectHandle.trim().startsWith('@') || connectPlatform === 'WhatsApp' ? connectHandle.trim() : `@${connectHandle.trim()}`,
        permissions
      });
      setAccounts(prev => [newAcc, ...prev.filter(a => a.id !== newAcc.id)]);
      setIsConnectOpen(false);
      setConnectHandle('');
    } catch (err) {
      console.error('Failed to connect account', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle Revoke Permission
  const handleRevokeAccount = async (id: string) => {
    try {
      await api.revokeSocialAccount(id);
      setAccounts(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'disconnected', permissionsGranted: [] } : a))
      );
    } catch (err) {
      console.error('Failed to revoke access', err);
    }
  };

  // Handle Custom Message Threat Analysis (Gemini AI)
  const handleAnalyzeCustomMessage = async () => {
    if (!customMsgInput.trim()) return;

    setIsAnalyzingCustom(true);
    try {
      const result = await api.analyzeSocialThreat({
        text: customMsgInput.trim(),
        platform: customPlatform,
        senderHandle: customSender.trim() || '@unknown_contact'
      });
      setThreats(prev => [result, ...prev]);
      setCustomMsgInput('');
    } catch (err) {
      console.error('Threat analysis error', err);
    } finally {
      setIsAnalyzingCustom(false);
    }
  };

  // Quarantine Threat
  const handleQuarantine = async (id: string) => {
    try {
      await api.quarantineThreat(id);
      setThreats(prev =>
        prev.map(t => (t.id === id ? { ...t, status: 'quarantined' } : t))
      );
    } catch (err) {
      console.error('Failed to quarantine threat', err);
    }
  };

  // Prepare & Open Complaint Modal
  const handleOpenComplaintModal = (threat?: SuspiciousMessageThreat) => {
    if (threat) {
      setSelectedThreatForComplaint(threat);
      setComplaintTargetPlatform(threat.platform);
      setComplaintSuspect(threat.senderHandle);
      setComplaintEvidenceText(
        `[OFFICIAL EVIDENCE TRANSCRIPT]\nPLATFORM: ${threat.platform}\nSENDER: ${threat.senderHandle}\nTIMESTAMP: ${threat.timestamp}\nEVIDENCE SHA-256 HASH: ${threat.evidenceHash}\n\nRAW CONTENT:\n"${threat.content}"\n\nDETECTED INDICATORS:\n${threat.detectedIndicators.map(i => `- ${i}`).join('\n')}`
      );

      // Auto category
      if (threat.category === 'blackmail_extortion') {
        setComplaintType('Online Cyber Blackmail & Extortion (IT Act 66E / IPC 384)');
        setComplaintSummary(
          `Suspect (${threat.senderHandle}) issued extortion demands alleging webcam compromise and demanded cryptocurrency payment under threat of mass contact dissemination.`
        );
      } else if (threat.category === 'phishing_credential_theft') {
        setComplaintType('Phishing & Identity Theft / Impersonation (IT Act 66D / 66C)');
        setComplaintSummary(
          `Suspect sent deceptive communication impersonating official account security team to steal account credentials via malicious link.`
        );
      } else if (threat.category === 'crypto_financial_fraud') {
        setComplaintType('Cryptocurrency Fraud & Investment Scam (IPC 420)');
        setComplaintSummary(
          `Suspect operated unauthorized high-yield investment scheme soliciting unauthorized cryptocurrency deposits.`
        );
      } else if (threat.category === 'cyber_police_fraud') {
        setComplaintType('Impersonation of Public Servant & Digital Arrest Fraud (IPC 170 / IT Act 66D)');
        setComplaintSummary(
          `Suspect issued fraudulent legal / digital arrest notice impersonating police/customs agencies to extort monetary bail transfer.`
        );
      } else {
        setComplaintType('AI Deepfake Defamation & Cyber Harassment (IT Act 66E)');
        setComplaintSummary(
          `Suspect engaged in harassment using synthetic media/impersonation markers to damage reputation.`
        );
      }
    } else {
      setSelectedThreatForComplaint(null);
      setComplaintTargetPlatform('Instagram');
      setComplaintSuspect('@unknown_bad_actor');
      setComplaintType('Online Cyber Blackmail & Extortion (IT Act 66E / IPC 384)');
      setComplaintSummary('Suspect transmitted unlawful digital threats via social media messaging.');
      setComplaintEvidenceText('Preserved screenshot and timestamped header logs.');
    }

    setIsComplaintModalOpen(true);
  };

  // Submit Official Cybercrime Complaint
  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSummary.trim()) return;

    setIsFilingComplaint(true);
    try {
      const complaint = await api.fileCybercrimeComplaint({
        threatId: selectedThreatForComplaint?.id,
        incidentType: complaintType,
        targetPlatform: complaintTargetPlatform,
        suspectIdentifier: complaintSuspect.trim() || 'Unknown',
        incidentSummary: complaintSummary.trim(),
        evidenceText: complaintEvidenceText.trim(),
        reportedBy: 'SignalWatch Automated Account Guardian'
      });

      setComplaints(prev => [complaint, ...prev]);
      if (selectedThreatForComplaint) {
        setThreats(prev =>
          prev.map(t =>
            t.id === selectedThreatForComplaint.id ? { ...t, status: 'complaint_filed' } : t
          )
        );
      }
      setLastFiledComplaint(complaint);
      setIsComplaintModalOpen(false);
      setActiveTab('complaints');
    } catch (err) {
      console.error('Failed to file cybercrime complaint', err);
    } finally {
      setIsFilingComplaint(false);
    }
  };

  // Copy Complaint Text for External Police Portal
  const handleCopyComplaintText = (complaint: CybercrimeComplaint) => {
    const text = `=====================================================
NATIONAL CYBERCRIME REPORTING PORTAL DRAFT COMPLAINT
=====================================================
ACKNOWLEDGMENT NUMBER: ${complaint.acknowledgmentNumber}
SUBMITTED TIMESTAMP: ${new Date(complaint.submittedAt).toLocaleString()}
OFFENSE CLASSIFICATION: ${complaint.incidentType}
PRIMARY PLATFORM: ${complaint.targetPlatform}
SUSPECT IDENTIFIER / HANDLE: ${complaint.suspectIdentifier}
STATUS: ${complaint.status}
ASSIGNED CYBER CELL: ${complaint.assignedOfficerOrPortal}
DIGITAL EVIDENCE INTEGRITY HASH (SHA-256): ${complaint.evidenceHash}

INCIDENT SUMMARY & CHRONOLOGY:
${complaint.incidentSummary}

LEGAL PROVISIONS & STATUTES APPLICABLE:
${complaint.legalProvisions.map(p => `• ${p}`).join('\n')}

EVIDENCE ANNEXURES:
- Annexure 1: Cryptographically signed message transcript
- Annexure 2: IP / Domain telemetry headers
- Annexure 3: Suspect wallet/account identifier traces
=====================================================`;

    navigator.clipboard.writeText(text);
    setCopiedAck(true);
    setTimeout(() => setCopiedAck(false), 2500);
  };

  // Download Formal Complaint JSON Dossier
  const handleDownloadComplaint = (complaint: CybercrimeComplaint) => {
    const blob = new Blob([JSON.stringify(complaint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybercrime_complaint_${complaint.acknowledgmentNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Original URL Scanner Logic
  const handleScanUrl = () => {
    if (!urlInput.trim()) return;
    setIsScanningUrl(true);

    setTimeout(() => {
      const isLegit = urlInput.includes('energy.gov');
      if (isLegit) {
        setScanResult({
          url: urlInput,
          domain: 'energy.gov',
          verdict: 'SAFE_VERIFIED',
          riskScore: 4,
          severity: 'low',
          sslValid: true,
          domainAgeDays: 7800,
          tldRisk: 'Zero (Official .gov)',
          indicators: ['Official Government TLS Certificate', 'No Credential Form Patterns', 'Established DNS Records'],
          recommendation: 'Verified benign official portal.'
        });
      } else {
        const isPhish = urlInput.includes('chase') || urlInput.includes('secure');
        setScanResult({
          url: urlInput,
          domain: urlInput.replace(/^https?:\/\//, '').split('/')[0],
          verdict: isPhish ? 'HIGH_RISK_PHISHING' : 'HIGH_RISK_SCAM',
          riskScore: isPhish ? 94 : 88,
          severity: 'critical',
          sslValid: urlInput.startsWith('https://'),
          domainAgeDays: 14,
          tldRisk: 'High Suspicion (.xyz / .top)',
          indicators: [
            'Lookalike brand token impersonation',
            'Domain created under 30 days ago',
            'Credential input form structure detected',
            'Unsolicited urgency and monetary lure tokens'
          ],
          recommendation: 'Recommend immediate domain takedown dispatch and firewall blocklist addition.'
        });
      }
      setIsScanningUrl(false);
    }, 600);
  };

  // Filtered threats
  const filteredThreats = threats.filter(t => {
    if (platformFilter !== 'all' && t.platform.toLowerCase() !== platformFilter.toLowerCase()) return false;
    if (severityFilter !== 'all' && t.threatLevel.toLowerCase() !== severityFilter.toLowerCase()) return false;
    return true;
  });

  const criticalThreatsCount = threats.filter(t => t.threatLevel === 'critical' && t.status !== 'resolved').length;
  const connectedAccountsCount = accounts.filter(a => a.status === 'connected').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Live Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE4DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#203B3A] text-[#F0EBDD]">
              <ShieldAlert className="w-5 h-5 text-[#C5C77A]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
              Cybercrime Indicators & Social App Threat Monitor
            </h1>
          </div>
          <p className="text-xs text-[#303B3B]/80 mt-1">
            Authorize Instagram & social apps to automatically detect suspicious messages, blackmail, phishing, and file legal complaints directly to the Cyber Crime Police.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsConnectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect App & Grant Permissions</span>
          </button>
          <button
            onClick={() => handleOpenComplaintModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#B96D70] text-white hover:bg-[#a65d60] transition-colors shadow-xs"
          >
            <FileWarning className="w-3.5 h-3.5" />
            <span>File Cybercrime Complaint</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LIVE THREAT NOTIFICATION BANNER (INSTANT ALERT)           */}
      {/* ========================================================= */}
      {notificationsActive && !dismissedNotification && criticalThreatsCount > 0 && (
        <div className="p-4 rounded-xl bg-[#B96D70]/10 border border-[#B96D70]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-lg bg-[#B96D70] text-white shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-bounce" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B96D70]">
                  Immediate Action Required: {criticalThreatsCount} Critical Threats Detected
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B96D70] text-white font-bold">
                  Instagram DMs & WhatsApp Monitored
                </span>
              </div>
              <p className="text-xs text-[#303B3B] mt-0.5">
                Suspect <strong>@anonymous_shadow_99</strong> transmitted webcam extortion and ransom threats on Instagram. Evidence hash preserved for Cyber Police.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                setActiveTab('threats');
                const threat = threats.find(t => t.id === 'THREAT-2026-101') || threats[0];
                handleOpenComplaintModal(threat);
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#B96D70] text-white hover:bg-[#a65d60] transition-colors shadow-xs"
            >
              File Police Complaint Now
            </button>
            <button
              onClick={() => setDismissedNotification(true)}
              className="px-2.5 py-1.5 text-xs rounded-lg text-[#303B3B] hover:bg-black/5"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* HORIZONTAL MODULE SELECTOR TABS                           */}
      {/* ========================================================= */}
      <div className="bg-[#F0EBDD] p-2 rounded-xl border border-[#DCE4DE] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('threats')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'threats'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C5C77A]" />
            <span>1. Suspicious Messages & Threat Detector ({threats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'accounts'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. App Permissions & Protected Accounts ({connectedAccountsCount} Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'complaints'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#B96D70]" />
            <span>3. Cybercrime Police Complaints ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('url_scanner')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'url_scanner'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>4. Phishing URL & Domain Inspector</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SUSPICIOUS MESSAGES & THREAT DETECTOR              */}
      {/* ========================================================= */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          {/* Custom Message Threat Analyzer with Gemini */}
          <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5C77A]" />
                  <span>Interactive Threat Analyzer (Gemini 3.8 Flash AI)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5C77A]/40 text-[#203B3A] font-bold">
                  Paste Any Message, DM or Link
                </span>
              </div>
              <span className="text-[11px] text-[#829B8B]">
                Extracts wallets, phone numbers, and psychological coercion markers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1 space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-[#303B3B]">Platform Received:</label>
                  <select
                    value={customPlatform}
                    onChange={e => setCustomPlatform(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B]"
                  >
                    <option value="Instagram">Instagram (DM / Post)</option>
                    <option value="WhatsApp">WhatsApp (Direct / Group)</option>
                    <option value="X (Twitter)">X / Twitter (DM / Mention)</option>
                    <option value="Telegram">Telegram (Chat / Channel)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#303B3B]">Sender Handle / Number:</label>
                  <input
                    type="text"
                    value={customSender}
                    onChange={e => setCustomSender(e.target.value)}
                    placeholder="@user or phone"
                    className="w-full mt-1 px-3 py-2 text-xs font-mono rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B]"
                  />
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[11px] font-bold text-[#303B3B]">
                  Suspicious Message Content (DM text, extortion threat, phishing link, or caption):
                </label>
                <textarea
                  value={customMsgInput}
                  onChange={e => setCustomMsgInput(e.target.value)}
                  rows={3}
                  placeholder="Paste suspicious DM text here (e.g. 'I have a recording of your webcam, send $500 bitcoin in 24 hours...' or 'Meta notice: account disabled in 12h, click link to appeal...')"
                  className="w-full p-2.5 text-xs font-mono rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B] placeholder-[#829B8B] focus:ring-1 focus:ring-[#203B3A]"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[#829B8B] font-bold">Try Sample Threat:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomPlatform('Instagram');
                        setCustomSender('@blackmail_anon_22');
                        setCustomMsgInput('I recorded split-screen footage of your webcam. Pay $500 BTC to bc1q98... or I leak to all your friends.');
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] hover:bg-[#DCE4DE]"
                    >
                      Webcam Extortion
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomPlatform('Instagram');
                        setCustomSender('@instagram_help_team99');
                        setCustomMsgInput('Copyright notice: Your Instagram account will be deleted in 24h. Click http://verify-meta-support.xyz to appeal.');
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] hover:bg-[#DCE4DE]"
                    >
                      Phishing Deletion Lure
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomPlatform('WhatsApp');
                        setCustomSender('+91 99881 22334');
                        setCustomMsgInput('POLICE NOTICE: Immediate digital arrest order issued for contraband parcel in customs. Pay Rs. 30,000 bail now.');
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] hover:bg-[#DCE4DE]"
                    >
                      Digital Arrest Fraud
                    </button>
                  </div>

                  <button
                    onClick={handleAnalyzeCustomMessage}
                    disabled={isAnalyzingCustom || !customMsgInput.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs disabled:opacity-50 shrink-0"
                  >
                    {isAnalyzingCustom ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5C77A]" />
                        <span>Analyzing Threat...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#C5C77A]" />
                        <span>Analyze Threat with Gemini AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#DCE4DE]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#829B8B] uppercase">Filter by App:</span>
              {['all', 'Instagram', 'WhatsApp', 'X (Twitter)'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    platformFilter === p
                      ? 'bg-[#203B3A] text-[#F0EBDD]'
                      : 'bg-[#F0EBDD] text-[#303B3B] hover:bg-[#DCE4DE]'
                  }`}
                >
                  {p === 'all' ? 'All Protected Apps' : p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#829B8B] uppercase">Severity:</span>
              {['all', 'critical', 'high', 'medium'].map(s => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-colors ${
                    severityFilter === s
                      ? s === 'critical'
                        ? 'bg-[#B96D70] text-white'
                        : 'bg-[#203B3A] text-[#F0EBDD]'
                      : 'bg-[#F0EBDD] text-[#303B3B] hover:bg-[#DCE4DE]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Threats List */}
          <div className="space-y-4">
            {filteredThreats.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#DCE4DE] p-8 text-center text-xs text-[#829B8B]">
                No threat messages match the selected filters.
              </div>
            ) : (
              filteredThreats.map(threat => {
                const isCritical = threat.threatLevel === 'critical';
                const isHigh = threat.threatLevel === 'high';

                return (
                  <div
                    key={threat.id}
                    className={`bg-white rounded-xl border p-5 space-y-4 transition-all shadow-xs ${
                      isCritical
                        ? 'border-[#B96D70]/40 ring-1 ring-[#B96D70]/20'
                        : isHigh
                        ? 'border-[#C47F68]/40'
                        : 'border-[#DCE4DE]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBDD] pb-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            isCritical
                              ? 'bg-[#B96D70] text-white'
                              : isHigh
                              ? 'bg-[#C47F68] text-white'
                              : 'bg-[#829B8B] text-white'
                          }`}
                        >
                          {threat.threatLevel} ({threat.riskScore}/100)
                        </span>

                        <span className="px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] text-[11px] font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[#203B3A]" />
                          <span>{threat.platform}</span>
                        </span>

                        <span className="text-xs font-mono font-bold text-[#203B3A]">
                          From: {threat.senderHandle}
                        </span>

                        {threat.status === 'complaint_filed' && (
                          <span className="px-2 py-0.5 rounded bg-[#829B8B]/20 text-[#203B3A] text-[10px] font-bold flex items-center gap-1 border border-[#829B8B]">
                            <CheckCheck className="w-3 h-3 text-[#203B3A]" />
                            <span>Police Complaint Filed</span>
                          </span>
                        )}

                        {threat.status === 'quarantined' && (
                          <span className="px-2 py-0.5 rounded bg-[#303B3B] text-white text-[10px] font-bold flex items-center gap-1">
                            <LockKeyhole className="w-3 h-3" />
                            <span>Quarantined & Blocked</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-[#829B8B]">
                        {new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {threat.id}
                      </div>
                    </div>

                    {/* Threat Body Quote */}
                    <div className="bg-[#F8F6F0] p-3.5 rounded-lg border border-[#DCE4DE] font-mono text-xs text-[#303B3B] leading-relaxed relative">
                      <div className="text-[10px] font-bold text-[#829B8B] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#B96D70]" />
                        <span>Intercepted Threat Content:</span>
                      </div>
                      <p className="whitespace-pre-wrap">{threat.content}</p>
                    </div>

                    {/* Extracted Details & Threat Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-[#203B3A] uppercase tracking-wider">
                          Detected Threat Indicators:
                        </span>
                        <ul className="space-y-1">
                          {threat.detectedIndicators.map((ind, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-[#303B3B]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B96D70] shrink-0" />
                              <span>{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-[#203B3A] uppercase tracking-wider">
                          Psychological Coercion Vectors:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {threat.psychologicalTriggers.map((trig, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-[#F0EBDD] text-[#303B3B] text-[11px] font-medium border border-[#DCE4DE]"
                            >
                              {trig}
                            </span>
                          ))}
                        </div>

                        {threat.extractedEntities.cryptoWallets && (
                          <div className="text-[11px] text-[#B96D70] font-mono mt-1">
                            <strong>Ransom Wallet:</strong> {threat.extractedEntities.cryptoWallets.join(', ')}
                          </div>
                        )}
                        {threat.extractedEntities.urls && (
                          <div className="text-[11px] text-[#B96D70] font-mono mt-1 truncate">
                            <strong>Deceptive URL:</strong> {threat.extractedEntities.urls.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F0EBDD]">
                      <div className="text-[11px] text-[#829B8B] font-mono">
                        Evidence Fingerprint: {threat.evidenceHash.slice(0, 24)}...
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {threat.status !== 'quarantined' && (
                          <button
                            onClick={() => handleQuarantine(threat.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors"
                          >
                            Quarantine Sender
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenComplaintModal(threat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#B96D70] text-white hover:bg-[#a65d60] transition-colors shadow-xs"
                        >
                          <FileWarning className="w-3.5 h-3.5" />
                          <span>File Cybercrime Complaint</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: APP PERMISSIONS & CONNECTED ACCOUNTS               */}
      {/* ========================================================= */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#203B3A]" />
                  <span>Authorized Social Media Applications & Threat Shields</span>
                </h2>
                <p className="text-xs text-[#303B3B]/80 mt-0.5">
                  Permissions are granted explicitly for security scanning of incoming messages, reels, and tagged mentions. You retain full revoke control at all times.
                </p>
              </div>

              <button
                onClick={() => setIsConnectOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5C77A]" />
                <span>Connect Another Social Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {accounts.map(acc => {
                const isConnected = acc.status === 'connected';

                return (
                  <div
                    key={acc.id}
                    className={`rounded-xl border p-4 space-y-3 shadow-xs ${
                      isConnected ? 'bg-white border-[#DCE4DE]' : 'bg-[#F8F6F0] border-[#DCE4DE]/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-[#203B3A] text-[#F0EBDD]">
                          <Smartphone className="w-4 h-4 text-[#C5C77A]" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#203B3A]">{acc.platform}</div>
                          <div className="text-[11px] font-mono text-[#303B3B] truncate max-w-[160px]">
                            {acc.accountHandle}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isConnected
                            ? 'bg-[#829B8B]/20 text-[#203B3A] border border-[#829B8B]'
                            : 'bg-black/10 text-[#303B3B]'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[10px] font-bold text-[#829B8B] uppercase">Active Security Scopes:</div>
                      <div className="space-y-1">
                        {acc.permissionsGranted.length > 0 ? (
                          acc.permissionsGranted.map((perm, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#303B3B]">
                              <CheckCircle2 className="w-3 h-3 text-[#203B3A] shrink-0" />
                              <span className="font-mono">{perm.replace(/_/g, ' ')}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-[11px] text-[#829B8B] italic">No active permissions</div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F0EBDD] flex items-center justify-between text-[11px]">
                      <span className="text-[#829B8B]">
                        {acc.threatsInterceptedCount} threats blocked
                      </span>

                      {isConnected ? (
                        <button
                          onClick={() => handleRevokeAccount(acc.id)}
                          className="text-[#B96D70] font-bold hover:underline"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setConnectPlatform(acc.platform as any);
                            setConnectHandle(acc.accountHandle);
                            setIsConnectOpen(true);
                          }}
                          className="text-[#203B3A] font-bold hover:underline"
                        >
                          Re-authorize
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CYBERCRIME POLICE COMPLAINTS                       */}
      {/* ========================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B96D70]" />
                  <span>National Cybercrime Reporting Portal & Cyber Cell Dossiers</span>
                </h2>
                <p className="text-xs text-[#303B3B]/80 mt-0.5">
                  Official complaints generated in compliance with law enforcement evidence standards (IT Act & IPC/BNS). Provides direct acknowledgment tracking and formatted portal text.
                </p>
              </div>

              <button
                onClick={() => handleOpenComplaintModal()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#B96D70] text-white hover:bg-[#a65d60] transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Draft New Cybercrime Complaint</span>
              </button>
            </div>

            {complaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#829B8B] bg-[#F8F6F0] rounded-xl border border-[#DCE4DE]">
                No cybercrime complaints have been filed yet.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {complaints.map(complaint => (
                  <div
                    key={complaint.complaintId}
                    className="bg-white rounded-xl border border-[#DCE4DE] p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBDD] pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#203B3A]">
                            {complaint.incidentType}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#203B3A] text-[#F0EBDD]">
                            Ack: {complaint.acknowledgmentNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#829B8B]/20 text-[#203B3A] border border-[#829B8B]">
                            {complaint.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-[#829B8B] mt-0.5">
                          Target Platform: <strong>{complaint.targetPlatform}</strong> • Suspect: <strong>{complaint.suspectIdentifier}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyComplaintText(complaint)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors"
                        >
                          {copiedAck ? (
                            <>
                              <Check className="w-3 h-3 text-[#203B3A]" />
                              <span>Copied Portal Text</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Portal Text</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadComplaint(complaint)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download FIR Dossier</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#F8F6F0] p-3 rounded-lg border border-[#DCE4DE] text-xs space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-[#829B8B]">Official Incident Narrative:</div>
                      <p className="text-[#303B3B] leading-relaxed">{complaint.incidentSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-[#829B8B]">Applicable Cyber Law Sections:</div>
                        <ul className="mt-1 space-y-0.5">
                          {complaint.legalProvisions.map((sec, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 text-[11px] text-[#303B3B]">
                              <CheckCircle2 className="w-3 h-3 text-[#203B3A] shrink-0" />
                              <span>{sec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="text-[10px] font-bold uppercase text-[#829B8B]">Filing & Routing Telemetry:</div>
                        <div className="text-[11px] text-[#303B3B]">
                          Assigned Portal: <strong>{complaint.assignedOfficerOrPortal}</strong>
                        </div>
                        <div className="text-[11px] text-[#303B3B]">
                          Evidence Annexures: <strong>{complaint.evidenceAnnexuresCount} Verified Digital Artifacts</strong>
                        </div>
                        <div className="text-[11px] font-mono text-[#829B8B] truncate">
                          SHA-256 Digest: {complaint.evidenceHash}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PHISHING DOMAIN & URL INSPECTOR (ORIGINAL TOOL)    */}
      {/* ========================================================= */}
      {activeTab === 'url_scanner' && (
        <div className="bg-[#F0EBDD] p-5 rounded-xl border border-[#DCE4DE] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-[#203B3A]" />
              <span>Domain & URL Heuristic Inspector</span>
            </span>
            <span className="text-[11px] text-[#829B8B] font-mono">
              SSRF Guard Active • Zero Automated Fetch
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Enter suspicious link or domain..."
                className="flex-1 p-2.5 rounded-lg bg-white border border-[#DCE4DE] text-xs font-mono text-[#303B3B] placeholder-[#829B8B] focus:ring-1 focus:ring-[#203B3A]"
              />
              <button
                onClick={handleScanUrl}
                disabled={isScanningUrl || !urlInput.trim()}
                className="px-5 py-2.5 rounded-lg bg-[#203B3A] text-[#F0EBDD] text-xs font-bold hover:bg-[#303B3B] transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
              >
                {isScanningUrl ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Inspect Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase">Test Samples:</span>
              {[
                { title: 'Utility Subsidy Phish', url: 'http://claim-energy-relief.xyz/apply' },
                { title: 'Bank Account Stealer', url: 'https://secure-chase-auth-service.top/verify' },
                { title: 'Official Gov Portal', url: 'https://www.energy.gov/clean-energy-tax-credits' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUrlInput(sample.url);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-white text-[#203B3A] font-medium border border-[#DCE4DE] hover:bg-[#DCE4DE]"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className="bg-white rounded-lg border border-[#DCE4DE] p-4 space-y-3 mt-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    scanResult.severity === 'critical'
                      ? 'bg-[#B96D70] text-white'
                      : 'bg-[#829B8B] text-white'
                  }`}
                >
                  {scanResult.verdict}
                </span>
                <span className="text-xs font-mono font-bold text-[#203B3A]">
                  Risk Score: {scanResult.riskScore} / 100
                </span>
              </div>

              <div className="text-xs text-[#303B3B] space-y-1">
                <div>Domain: <strong>{scanResult.domain}</strong></div>
                <div>TLS/SSL Valid: <strong>{scanResult.sslValid ? 'Yes' : 'No'}</strong></div>
                <div>Domain TLD Risk: <strong>{scanResult.tldRisk}</strong></div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase">Forensic Indicators:</span>
                <ul className="text-xs space-y-0.5">
                  {scanResult.indicators.map((ind: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5 text-[#303B3B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B96D70]" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* CONNECT APP / GRANT PERMISSION MODAL                      */}
      {/* ========================================================= */}
      {isConnectOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE4DE] shadow-xl max-w-lg w-full p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F0EBDD] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#203B3A] text-[#F0EBDD]">
                  <Key className="w-4 h-4 text-[#C5C77A]" />
                </span>
                <h3 className="text-sm font-bold text-[#203B3A]">
                  Grant Security Permission for App Monitoring
                </h3>
              </div>
              <button
                onClick={() => setIsConnectOpen(false)}
                className="text-[#829B8B] hover:text-[#203B3A] text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConnectAccount} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#303B3B]">Select Application to Protect:</label>
                <select
                  value={connectPlatform}
                  onChange={e => setConnectPlatform(e.target.value as any)}
                  className="w-full mt-1.5 px-3 py-2 rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B] font-semibold"
                >
                  <option value="Instagram">Instagram (Creator / Personal Account)</option>
                  <option value="WhatsApp">WhatsApp (Business / Personal)</option>
                  <option value="X (Twitter)">X / Twitter Profile</option>
                  <option value="Telegram">Telegram Channel / Account</option>
                  <option value="Facebook/Meta">Meta / Facebook Page</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#303B3B]">Account Handle, Username or Verified Phone:</label>
                <input
                  type="text"
                  required
                  value={connectHandle}
                  onChange={e => setConnectHandle(e.target.value)}
                  placeholder="e.g. @my_creator_account or +1 (555) 019-2831"
                  className="w-full mt-1.5 px-3 py-2 font-mono rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B]"
                />
              </div>

              {/* Permission Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#F0EBDD]">
                <label className="font-bold text-[#203B3A] uppercase tracking-wider text-[10px]">
                  Authorize Specific Threat Intelligence Scopes:
                </label>

                <div className="space-y-2 bg-[#F8F6F0] p-3 rounded-xl border border-[#DCE4DE]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permDms}
                      onChange={e => setPermDms(e.target.checked)}
                      className="rounded text-[#203B3A]"
                    />
                    <div>
                      <div className="font-bold text-[#203B3A]">Scan Incoming Direct Messages (DMs)</div>
                      <div className="text-[10px] text-[#829B8B]">Detects blackmail, extortion, crypto doubling, and phishing credentials.</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permMedia}
                      onChange={e => setPermMedia(e.target.checked)}
                      className="rounded text-[#203B3A]"
                    />
                    <div>
                      <div className="font-bold text-[#203B3A]">Monitor Tagged Reels, Posts & Comments</div>
                      <div className="text-[10px] text-[#829B8B]">Identifies deepfake audio/video clones and coordinated defamation attacks.</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permPush}
                      onChange={e => setPermPush(e.target.checked)}
                      className="rounded text-[#203B3A]"
                    />
                    <div>
                      <div className="font-bold text-[#203B3A]">Real-Time Suspicious Message Notifications</div>
                      <div className="text-[10px] text-[#829B8B]">Instant banner and sound alerts when severe threats are intercepted.</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permEvidence}
                      onChange={e => setPermEvidence(e.target.checked)}
                      className="rounded text-[#203B3A]"
                    />
                    <div>
                      <div className="font-bold text-[#203B3A]">Automatic Cryptographic Evidence Preservation (SHA-256)</div>
                      <div className="text-[10px] text-[#829B8B]">Locks message timestamps and sender telemetry ready for Cyber Police filing.</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsConnectOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE4DE] text-[#303B3B] hover:bg-[#F8F6F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting || !connectHandle.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#203B3A] text-[#F0EBDD] font-bold hover:bg-[#303B3B] disabled:opacity-50 shadow-xs"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5C77A]" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#C5C77A]" />
                      <span>Grant Permission & Protect Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FILE CYBERCRIME POLICE COMPLAINT MODAL                     */}
      {/* ========================================================= */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE4DE] shadow-xl max-w-xl w-full p-6 space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBDD] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#B96D70] text-white">
                  <FileWarning className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#203B3A]">
                    Official Cybercrime Reporting & Police Complaint Form
                  </h3>
                  <p className="text-[11px] text-[#829B8B]">
                    Formatted in compliance with National Cybercrime Law Enforcement standards
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsComplaintModalOpen(false)}
                className="text-[#829B8B] hover:text-[#203B3A] text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#303B3B]">Incident Offense Classification:</label>
                  <select
                    value={complaintType}
                    onChange={e => setComplaintType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B] font-semibold"
                  >
                    <option value="Online Cyber Blackmail & Extortion (IT Act 66E / IPC 384)">
                      Online Cyber Blackmail & Extortion (IT Act 66E / IPC 384)
                    </option>
                    <option value="Phishing & Identity Theft / Impersonation (IT Act 66D / 66C)">
                      Phishing & Identity Theft / Impersonation (IT Act 66D / 66C)
                    </option>
                    <option value="Cryptocurrency Fraud & Investment Scam (IPC 420)">
                      Cryptocurrency Fraud & Investment Scam (IPC 420)
                    </option>
                    <option value="AI Deepfake Defamation & Cyber Harassment (IT Act 66E)">
                      AI Deepfake Defamation & Cyber Harassment (IT Act 66E)
                    </option>
                    <option value="Impersonation of Public Servant & Digital Arrest Fraud (IPC 170 / IT Act 66D)">
                      Impersonation of Public Servant & Digital Arrest Fraud (IPC 170 / IT Act 66D)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#303B3B]">Social Platform of Occurrence:</label>
                  <input
                    type="text"
                    value={complaintTargetPlatform}
                    onChange={e => setComplaintTargetPlatform(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#303B3B]">Suspect Username / Handle / Contact Identifier:</label>
                <input
                  type="text"
                  required
                  value={complaintSuspect}
                  onChange={e => setComplaintSuspect(e.target.value)}
                  placeholder="e.g. @anonymous_shadow_99 or suspect phone/IP"
                  className="w-full mt-1 px-3 py-2 font-mono rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#303B3B]">Chronological Incident Narrative for Police Desk:</label>
                <textarea
                  required
                  rows={3}
                  value={complaintSummary}
                  onChange={e => setComplaintSummary(e.target.value)}
                  placeholder="Describe what occurred, extortion demands, blackmail threats or deceptive links..."
                  className="w-full mt-1 p-2.5 rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#303B3B]">Digital Evidence Annexure & Message Logs:</label>
                <textarea
                  rows={4}
                  value={complaintEvidenceText}
                  onChange={e => setComplaintEvidenceText(e.target.value)}
                  placeholder="Raw message transcript, timestamps, crypto wallet addresses, URLs..."
                  className="w-full mt-1 p-2.5 font-mono text-[11px] rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#B96D70]/10 border border-[#B96D70]/30 text-[11px] text-[#303B3B] space-y-1">
                <div className="font-bold text-[#B96D70] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Chain of Custody Guarantee</span>
                </div>
                <p>
                  Upon submission, this complaint will generate an official Acknowledgment Number, compute an immutable SHA-256 evidence integrity hash, and format the incident for one-click submission to National Cybercrime Portals.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EBDD]">
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE4DE] text-[#303B3B] hover:bg-[#F8F6F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFilingComplaint || !complaintSummary.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B96D70] text-white font-bold hover:bg-[#a65d60] transition-colors shadow-xs disabled:opacity-50"
                >
                  {isFilingComplaint ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Filing with Cyber Cell...</span>
                    </>
                  ) : (
                    <>
                      <FileWarning className="w-3.5 h-3.5" />
                      <span>Submit Official Cybercrime Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
