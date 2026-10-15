import React, { useState } from 'react';
import { api } from '../../api/client';
import { DetectionResult, VerificationStatus } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Layers,
  FileCheck,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const MisinformationAnalysis: React.FC = () => {
  const [claimText, setClaimText] = useState(
    'Central Reserve Bank has ordered an emergency $500 ATM withdrawal cap nationwide starting this Friday due to cash liquidity shortages.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DetectionResult | null>(null);
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Sample historical or active claims for fast testing
  const sampleClaims = [
    {
      title: 'ATM Withdrawal Limits',
      text: 'Central Reserve Bank has ordered an emergency $500 ATM withdrawal cap nationwide starting this Friday due to cash liquidity shortages.',
      tag: 'Banking Panic'
    },
    {
      title: 'Reservoir Contamination',
      text: 'WARNING: Municipal water supplies in Eastern Valley contain toxic industrial runoff. Do not drink tap water under any circumstances!',
      tag: 'Public Health'
    },
    {
      title: 'Solar Subsidy Voucher',
      text: 'Official Government Directive: Claim your free $1,200 solar energy relief debit card before midnight at http://claim-energy-relief.xyz/apply',
      tag: 'Utility Scam'
    },
    {
      title: 'Subway System Halts',
      text: 'All downtown metro trains cancelled indefinitely following catastrophic power station explosion. Evacuate immediately.',
      tag: 'Civic Infrastructure'
    }
  ];

  // Evidence baseline database for comparative reconciliation
  const evidenceItems = [
    {
      publisher: 'Central Reserve Bank Official Bulletin',
      date: 'Today, 08:30 AM',
      type: 'Official Regulatory Source',
      verdict: 'Contradicts',
      excerpt: 'The Central Reserve Bank confirms all national retail banking operations and ATM networks remain fully capitalized with normal operating liquidity limits.',
      url: 'https://reserve-bank.gov/bulletins/2026-liquidity-status',
      credibility: 'Tier 1 Official (100%)'
    },
    {
      publisher: 'Reuters Financial Intelligence',
      date: 'Today, 09:15 AM',
      type: 'Independent Wire Service',
      verdict: 'Contradicts',
      excerpt: 'Spokespersons from leading commercial lenders report zero directives restricting consumer branch withdrawals or electronic point-of-sale limits.',
      url: 'https://reuters.com/financial/bank-rumors-debunked',
      credibility: 'Tier 1 News (95%)'
    },
    {
      publisher: 'Social Media Speculative Channel #49',
      date: 'Yesterday, 11:45 PM',
      type: 'Anonymous Video Reel',
      verdict: 'Supports Rumor',
      excerpt: 'Unverified video clip claiming local ATM screen displays maintenance message, falsely labeled as nationwide freeze.',
      url: 'https://telegram.org/channel/rumor-feed/881',
      credibility: 'Unverified Anonymous (<15%)'
    }
  ];

  const handleRunAnalysis = async () => {
    if (!claimText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeText(claimText);
      setAnalysisResult(res);
    } catch (e) {
      console.error('Analysis error', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyDebunkMemo = () => {
    const memo = `[SOCIALPULSE FACT-CHECK MEMO]\nCLAIM: "${claimText}"\nSTATUS: Disputed / Contradicted by Official Regulatory Sources\nSUMMARY: No official directives have been issued. Regulatory authorities have issued clarifying releases confirming liquidity stability. Do not amplify unverified messaging.`;
    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="pb-4 border-b border-[#DCE4DE]">
        <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
          Misinformation & Rumor Verification Engine
        </h1>
        <p className="text-xs text-[#303B3B]/80 mt-1">
          Detect unsubstantiated claims, cross-reference official wire bulletins, and formulate explainable rebuttal evidence.
        </p>
      </div>

      {/* Claim Input & Verification Workbench */}
      <div className="bg-[#F0EBDD] p-5 rounded-xl border border-[#DCE4DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-[#203B3A]" />
            <span>Interactive Claim Evaluator</span>
          </span>
          <span className="text-[11px] text-[#829B8B] font-mono">
            Explainable Rule & NLP Architecture
          </span>
        </div>

        <div className="space-y-2">
          <textarea
            rows={3}
            value={claimText}
            onChange={e => setClaimText(e.target.value)}
            placeholder="Type or paste any viral post or assertion to test against evidence indicators..."
            className="w-full p-3 rounded-lg bg-white border border-[#DCE4DE] text-xs font-serif text-[#303B3B] placeholder-[#829B8B] focus:ring-1 focus:ring-[#203B3A]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase">Test Scenarios:</span>
              {sampleClaims.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setClaimText(s.text);
                    setAnalysisResult(null);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-[#DCE4DE] text-[#203B3A] border border-[#DCE4DE] transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !claimText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Corpus...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Execute Verification</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE4DE]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#829B8B] uppercase tracking-wider block">
                Verification Assessment
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-[#203B3A]">
                  Status: {analysisResult.verificationStatus}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#B96D70] text-white font-bold">
                  Risk: {analysisResult.riskScore}/100
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyDebunkMemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors self-start sm:self-auto"
            >
              {copiedMemo ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#203B3A]" />
                  <span>Memo Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Debunk Memo</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F0EBDD]/40 border border-[#DCE4DE]">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Entity Extraction</span>
              <div className="mt-1 space-y-1">
                <div><strong>Subject:</strong> Central Reserve Bank</div>
                <div><strong>Claimed Directive:</strong> $500 ATM Daily Withdrawal Cap</div>
                <div><strong>Timeline:</strong> Upcoming Friday</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F0EBDD]/40 border border-[#DCE4DE]">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Heuristic Flags</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {analysisResult.matchedIndicators.map((ind, i) => (
                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#203B3A] border border-[#DCE4DE]">
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F0EBDD]/40 border border-[#DCE4DE]">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Recommended Triage</span>
              <p className="mt-1 text-[11px] text-[#303B3B] leading-tight">
                {analysisResult.recommendedAction}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#DCE4DE]/30 border border-[#DCE4DE] text-xs text-[#303B3B] space-y-1">
            <span className="text-[10px] font-bold text-[#203B3A] uppercase block">Assessment Rationale</span>
            <p className="leading-relaxed">{analysisResult.explanation}</p>
          </div>
        </div>
      )}

      {/* Multi-Source Evidence Table */}
      <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
          <div>
            <h3 className="text-sm font-bold text-[#203B3A] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#203B3A]" />
              <span>Multi-Source Evidence Reconciliation</span>
            </h3>
            <p className="text-xs text-[#829B8B] mt-0.5">
              Comparison of verified wire archives, regulatory notices, and unverified viral assertions.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#829B8B]">3 Source Citations Active</span>
        </div>

        <div className="space-y-3">
          {evidenceItems.map((item, idx) => {
            const isContradiction = item.verdict === 'Contradicts';
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#203B3A]">{item.publisher}</span>
                    <span className="text-[#829B8B]">•</span>
                    <span className="text-[#829B8B]">{item.date}</span>
                    <span className="text-[#829B8B]">•</span>
                    <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#DCE4DE]">
                      {item.type}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                      isContradiction
                        ? 'bg-[#829B8B]/30 text-[#203B3A] border border-[#829B8B]'
                        : 'bg-[#B96D70]/20 text-[#B96D70] border border-[#B96D70]/40'
                    }`}
                  >
                    {item.verdict}
                  </span>
                </div>

                <p className="text-xs font-serif text-[#303B3B] leading-relaxed italic bg-white p-2.5 rounded border border-[#DCE4DE]">
                  "{item.excerpt}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#829B8B] pt-1">
                  <span>Credibility Index: <strong>{item.credibility}</strong></span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#203B3A] hover:underline font-mono text-[10px]"
                  >
                    <span>View Primary Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
