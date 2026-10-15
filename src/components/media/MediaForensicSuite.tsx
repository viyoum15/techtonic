import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { MediaForensicResult, KeyframeAnomaly } from '../../types';
import {
  Video,
  Film,
  TrendingUp,
  ShieldCheck,
  Download,
  Search,
  RefreshCw,
  Layers,
  Zap,
  Check,
  Copy,
  Maximize2,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export const MediaForensicSuite: React.FC = () => {
  // Horizontal sub-view options
  const [activeTab, setActiveTab] = useState<'analyzer' | 'spread_tracker' | 'early_ai_scan' | 'gallery'>('analyzer');
  const [scanMode, setScanMode] = useState<'early_ai_context' | 'standard'>('early_ai_context');

  // Input state
  const [urlInput, setUrlInput] = useState('https://instagram.com/reel/C8a9fQx4821');
  const [contextInput, setContextInput] = useState('');
  const [showContextField, setShowContextField] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<MediaForensicResult | null>(null);
  const [recentSpreadList, setRecentSpreadList] = useState<MediaForensicResult[]>([]);
  const [selectedKeyframe, setSelectedKeyframe] = useState<KeyframeAnomaly | null>(null);
  const [copiedDossier, setCopiedDossier] = useState(false);

  // Quick preset test cases - 6 clearly distinct scenarios with different verdicts, metrics and forensics
  const samplePresets = [
    {
      title: 'Instagram Reel: Fake Bank Governor Speech',
      url: 'https://instagram.com/reel/C8a9fQx4821',
      tag: 'Deepfake Face Swap (96%)'
    },
    {
      title: 'Instagram Post: Synthetic Ballot Box Photo',
      url: 'https://instagram.com/p/C9v81kLx901',
      tag: 'AI Photo Generation (94%)'
    },
    {
      title: 'TikTok: AI Tunnel Collapse Video',
      url: 'https://tiktok.com/@daily_pulse/video/7391823901',
      tag: 'Sora / Gen-3 Video (98%)'
    },
    {
      title: 'X Viral: Synthetic Protest Crowd Image',
      url: 'https://x.com/freedom_wire/status/18392019482',
      tag: 'Midjourney v6 Photo (89%)'
    },
    {
      title: 'X Clip: 2021 Victory Parade Mislabeled as Riot',
      url: 'https://x.com/sports_insider/status/17892182019',
      tag: 'Decontextualized Cheapfake (84%)'
    },
    {
      title: 'Official Press Conference (Authentic Verified)',
      url: 'https://c-span.org/official/press-briefing-2026-authentic',
      tag: 'Authentic Verified Media (4%)'
    }
  ];

  // Load initial media spread data
  const loadRecentMedia = async () => {
    try {
      const data = await api.getRecentMediaSpread();
      setRecentSpreadList(data);
      if (data.length > 0 && !currentResult) {
        setCurrentResult(data[0]);
        if (data[0].visualKeyframes && data[0].visualKeyframes.length > 0) {
          setSelectedKeyframe(data[0].visualKeyframes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load recent media spread', err);
    }
  };

  useEffect(() => {
    loadRecentMedia();
  }, []);

  const handleRunScan = async (targetUrl?: string, customContext?: string, forceFresh = false) => {
    const toScan = (targetUrl || urlInput).trim();
    if (!toScan) return;

    setIsScanning(true);
    try {
      const res = await api.analyzeMedia({
        url: toScan,
        scanMode: scanMode,
        contextText: customContext !== undefined ? customContext : contextInput.trim() || undefined,
        forceFresh
      });
      setCurrentResult(res);
      if (res.visualKeyframes && res.visualKeyframes.length > 0) {
        setSelectedKeyframe(res.visualKeyframes[0]);
      }
      // Refresh list
      api.getRecentMediaSpread().then(setRecentSpreadList).catch(() => {});
    } catch (err) {
      console.error('Scan failed', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownloadDossier = () => {
    if (!currentResult) return;
    const blob = new Blob([JSON.stringify(currentResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialpulse_forensic_${currentResult.mediaId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    if (!currentResult) return;
    const summaryText = `[SOCIALPULSE AI FORENSIC DOSSIER]
MEDIA ID: ${currentResult.mediaId}
URL: ${currentResult.mediaUrl}
PLATFORM: ${currentResult.platform}
MANIPULATION: ${currentResult.manipulationType} (Deepfake Confidence: ${currentResult.deepfakeConfidenceScore}%)
RECENT COPY SPREAD: ${currentResult.spreadAnalysis.copiesDetectedRecentDays} copies detected across ${currentResult.spreadAnalysis.crossPlatformBreakdown.length} platforms in recent days
EARLIEST ORIGIN: ${currentResult.spreadAnalysis.earliestPlatformOrigin} (${new Date(currentResult.spreadAnalysis.firstDetectedTimestamp).toLocaleDateString()})
EARLY AI SOCIAL CONTEXT: Bot Coordination Index ${currentResult.earlyAiSocialContext.botCoordinationIndex}%, Predicted Saturation in ${currentResult.earlyAiSocialContext.predictedViralSaturationHours}h
VERDICT: ${currentResult.explainableVerdict}`;
    navigator.clipboard.writeText(summaryText);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE4DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#203B3A] text-[#F0EBDD]">
              <Film className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
              Reel & Post Detection (Video & Photo Forensics)
            </h1>
          </div>
          <p className="text-xs text-[#303B3B]/80 mt-1">
            Analyze Instagram Reels, Posts, TikTok, or photo links directly. Detect AI deepfakes, count recent viral copies, and predict early propagation with AI social context.
          </p>
        </div>

        {currentResult && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors shadow-xs"
            >
              {copiedDossier ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#203B3A]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. SINGLE, UNIFIED URL INPUT & TEST SCENARIOS            */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-4 h-4 text-[#203B3A]" />
              <span>Direct Instagram Reel, Post, Video or Photo URL</span>
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#C5C77A]/40 text-[#203B3A] text-[10px] font-mono font-bold">
              <Sparkles className="w-3 h-3 text-[#203B3A]" />
              <span>Gemini 3.8 Flash API Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#829B8B] uppercase">Scan Model:</span>
            <div className="inline-flex rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] p-0.5">
              <button
                onClick={() => setScanMode('early_ai_context')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                  scanMode === 'early_ai_context'
                    ? 'bg-[#203B3A] text-[#F0EBDD]'
                    : 'text-[#303B3B] hover:text-[#203B3A]'
                }`}
              >
                <Zap className="w-3 h-3 text-[#C5C77A]" />
                <span>Early AI Context</span>
              </button>
              <button
                onClick={() => setScanMode('standard')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  scanMode === 'standard'
                    ? 'bg-[#203B3A] text-[#F0EBDD]'
                    : 'text-[#303B3B] hover:text-[#203B3A]'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Standard</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Paste Instagram Reel or Post URL (e.g. https://instagram.com/reel/... or /p/...), TikTok, YouTube Shorts, X Post, or image link..."
              className="w-full pl-3 pr-4 py-2.5 text-xs font-mono rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B] placeholder-[#829B8B] focus:ring-1 focus:ring-[#203B3A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunScan()}
              disabled={isScanning || !urlInput.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs disabled:opacity-50 shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5C77A]" />
                  <span>Scanning with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5C77A]" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleRunScan(urlInput, contextInput, true)}
              disabled={isScanning || !urlInput.trim()}
              title="Force a brand new dynamic AI forensic analysis with fresh reasoning"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors shadow-xs disabled:opacity-50 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#203B3A]" />
              <span>⚡ Fresh AI Analysis</span>
            </button>
          </div>
        </div>

        {/* Quick Forensic Angles & Optional Context Toggle */}
        <div className="space-y-2 pt-0.5">
          <div className="flex items-center justify-between text-[11px] flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowContextField(!showContextField)}
              className="text-[#203B3A] font-bold hover:underline flex items-center gap-1"
            >
              <span>{showContextField ? '▾ Hide Context Field' : '▸ + Add Post Caption, Topic, or Claim Context (Optional)'}</span>
            </button>
            <div className="flex items-center gap-1 text-[10px] text-[#829B8B] font-bold uppercase">
              <span>Quick Forensic Perspectives:</span>
              {[
                'Facial & Lip-Sync Deepfake',
                'AI Diffusion / Signage Artifacts',
                'Audio Neural Vocoder Clone',
                'Viral Swarm & Bot Amplification'
              ].map((angle, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setContextInput(angle);
                    setShowContextField(true);
                    handleRunScan(urlInput, angle, true);
                  }}
                  className="px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] hover:bg-[#DCE4DE] border border-[#DCE4DE] text-[10px] font-medium"
                >
                  {angle}
                </button>
              ))}
            </div>
          </div>

          {showContextField && (
            <div className="space-y-1 animate-fadeIn">
              <input
                type="text"
                value={contextInput}
                onChange={e => setContextInput(e.target.value)}
                placeholder="e.g. 'Deepfake speech of Prime Minister announcing bank closure' or 'Authentic press briefing' or 'AI disaster in city'..."
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] text-[#303B3B] placeholder-[#829B8B] focus:ring-1 focus:ring-[#203B3A]"
              />
              <p className="text-[10px] text-[#829B8B]">
                Tip: Adding specific text or claim details guides the AI to cross-check specific temporal events, facial features, or vocal timbre.
              </p>
            </div>
          )}
        </div>

        {/* Quick-Select One-Click Scenarios with diverse distinct answers */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#F0EBDD]">
          <span className="text-[10px] font-bold text-[#829B8B] uppercase">Distinct Preset Scenarios:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(preset.url);
                setContextInput('');
                handleRunScan(preset.url, undefined, false);
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#F0EBDD] hover:bg-[#DCE4DE] text-[#203B3A] font-medium border border-[#DCE4DE] transition-colors flex items-center gap-1.5"
            >
              <span>{preset.title}</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white text-[#829B8B] font-bold">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HORIZONTAL VIEW SELECTOR (CLEAN, NO NESTED CLUTTER)   */}
      {/* ========================================================= */}
      <div className="bg-[#F0EBDD] p-2 rounded-xl border border-[#DCE4DE] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'analyzer'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>1. Fake Detection & Keyframes</span>
          </button>

          <button
            onClick={() => setActiveTab('spread_tracker')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'spread_tracker'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2. Recent Copy Spread (Past 7 Days)</span>
            {currentResult && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#B96D70] text-white font-mono">
                {currentResult.spreadAnalysis.copiesDetectedRecentDays} Copies
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('early_ai_scan')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'early_ai_scan'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#C5C77A]" />
            <span>3. Early AI Social Context</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shadow-xs ${
              activeTab === 'gallery'
                ? 'bg-[#203B3A] text-[#F0EBDD]'
                : 'bg-white text-[#303B3B] hover:bg-[#DCE4DE] border border-[#DCE4DE]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Monitored Library ({recentSpreadList.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: FAKE DETECTION & KEYFRAME INSPECTION              */}
      {/* ========================================================= */}
      {activeTab === 'analyzer' && currentResult && (
        <div className="space-y-6">
          {/* Top Banner: Detection Verdict & Severity Score */}
          <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE4DE]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#829B8B] uppercase tracking-wider">
                    {currentResult.mediaId} • {currentResult.platform}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#F0EBDD] text-[#203B3A]">
                    Fingerprint: {currentResult.spreadAnalysis.similarityFingerprint}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#203B3A] mt-1">
                  {currentResult.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-md font-bold uppercase ${
                    currentResult.isManipulatedOrSynthetic
                      ? 'bg-[#B96D70] text-white'
                      : 'bg-[#829B8B] text-white'
                  }`}
                >
                  {currentResult.manipulationType}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md font-mono font-bold bg-[#F0EBDD] text-[#203B3A] border border-[#DCE4DE]">
                  Confidence: {currentResult.deepfakeConfidenceScore}%
                </span>
              </div>
            </div>

            {/* Metric Strip: Copies Spread + Saturation Time + Origin */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE]">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase block">
                  Copies Spread (Recent Days)
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold font-mono text-[#B96D70]">
                    {currentResult.spreadAnalysis.copiesDetectedRecentDays}
                  </span>
                  <span className="text-[11px] text-[#829B8B]">copies detected</span>
                </div>
                <span className="text-[10px] text-[#829B8B] block mt-0.5">
                  Across monitored social feeds
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE]">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase block">
                  Earliest Detected Origin
                </span>
                <span className="text-sm font-bold text-[#203B3A] block mt-1">
                  {currentResult.spreadAnalysis.earliestPlatformOrigin}
                </span>
                <span className="text-[10px] text-[#829B8B] block mt-0.5 font-mono">
                  {new Date(currentResult.spreadAnalysis.firstDetectedTimestamp).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE]">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase block">
                  Early Bot Swarm Score
                </span>
                <span className="text-xl font-bold font-mono text-[#C47F68] block mt-1">
                  {currentResult.earlyAiSocialContext.botCoordinationIndex}%
                </span>
                <span className="text-[10px] text-[#829B8B] block mt-0.5">
                  Coordinated propagation
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE]">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase block">
                  Peak Saturation Forecast
                </span>
                <span className="text-xl font-bold font-mono text-[#203B3A] block mt-1">
                  ~{currentResult.earlyAiSocialContext.predictedViralSaturationHours} Hours
                </span>
                <span className="text-[10px] text-[#829B8B] block mt-0.5">
                  Until peak viral explore feed
                </span>
              </div>
            </div>

            {/* Explainable Verdict Card */}
            <div className="p-3.5 rounded-lg bg-[#F8F6F0] border border-[#DCE4DE] text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#829B8B] tracking-wider block">
                Explainable Forensic Diagnosis:
              </span>
              <p className="text-[#303B3B] leading-relaxed">
                {currentResult.explainableVerdict}
              </p>
            </div>
          </div>

          {/* Visual Keyframe Inspection Gallery */}
          <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
              <div>
                <h3 className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#203B3A]" />
                  <span>Extracted Video Keyframes & Visual Anomalies</span>
                </h3>
                <p className="text-xs text-[#829B8B] mt-0.5">
                  Select a frame to inspect facial boundaries, synthetic diffusion artifacts, and blending irregularities.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#829B8B]">
                {currentResult.visualKeyframes.length} Keyframes Extracted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currentResult.visualKeyframes.map((kf, index) => {
                const isSelected = selectedKeyframe?.frameIndex === kf.frameIndex;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedKeyframe(kf)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all ${
                      isSelected
                        ? 'border-[#203B3A] ring-2 ring-[#203B3A] shadow-md bg-white'
                        : 'border-[#DCE4DE] hover:border-[#829B8B]'
                    }`}
                  >
                    <div
                      className="w-full h-32 rounded-lg relative overflow-hidden flex flex-col items-center justify-center p-2 text-center border border-[#DCE4DE]"
                      style={{
                        backgroundColor: kf.visualPlaceholderColor || '#829B8B',
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '8px 8px'
                      }}
                    >
                      <div className="absolute top-2 left-2 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        Frame {kf.frameTime}
                      </div>

                      {kf.anomalyDetected ? (
                        <div className="border-2 border-dashed border-[#B96D70] bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-white shadow-xs">
                          [ANOMALY: {kf.anomalyRegion}]
                        </div>
                      ) : (
                        <div className="bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-[#DCE4DE]">
                          [NATURAL: {kf.anomalyRegion}]
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        Score: {kf.confidenceScore}%
                      </div>
                    </div>

                    <div className="mt-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#203B3A]">Frame {kf.frameTime}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            kf.anomalyDetected
                              ? 'bg-[#B96D70] text-white'
                              : 'bg-[#829B8B] text-white'
                          }`}
                        >
                          {kf.anomalyDetected ? 'Flagged' : 'Pass'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#303B3B] line-clamp-2 leading-tight">
                        {kf.anomalyDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedKeyframe && (
              <div className="p-4 rounded-xl bg-[#F0EBDD]/60 border border-[#829B8B]/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#203B3A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#203B3A]" />
                    <span>Inspecting Frame {selectedKeyframe.frameTime} Annotation</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#203B3A] font-bold">
                    Anomaly Confidence: {selectedKeyframe.confidenceScore}%
                  </span>
                </div>
                <p className="text-xs text-[#303B3B] leading-relaxed">
                  <strong>Findings:</strong> {selectedKeyframe.anomalyDescription}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#829B8B]">
                  <span>Target Region: <strong>{selectedKeyframe.anomalyRegion}</strong></span>
                  <span>•</span>
                  <span>Classification: <strong>{selectedKeyframe.anomalyDetected ? 'Confirmed Synthetic Artifact' : 'Normal Camera Sensor Flow'}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Audio Forensic & Social Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#203B3A]" />
                <span>Audio Voice Clone Analysis</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DCE4DE]">
                  <span className="text-[#303B3B]">Voice Clone Markers:</span>
                  <strong className={currentResult.audioForensic.hasVoiceCloneMarkers ? 'text-[#B96D70]' : 'text-[#829B8B]'}>
                    {currentResult.audioForensic.hasVoiceCloneMarkers ? 'POSITIVE (Neural Vocoder)' : 'NEGATIVE (Organic Speech)'}
                  </strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DCE4DE]">
                  <span className="text-[#303B3B]">Pitch Discontinuity Score:</span>
                  <strong className="font-mono text-[#203B3A]">
                    {currentResult.audioForensic.pitchDiscontinuityScore}/100
                  </strong>
                </div>

                <div className="p-3 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE] text-[11px] text-[#303B3B]">
                  <strong>Forensic Notes:</strong> {currentResult.audioForensic.summary}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#203B3A] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#C5C77A]" />
                <span>Early Social Media Propagation Indicators</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DCE4DE]">
                  <span className="text-[#303B3B]">Sensationalist Hooks:</span>
                  <div className="flex items-center gap-1">
                    {currentResult.earlyAiSocialContext.sensationalistCaptionFlags.map((flag, idx) => (
                      <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C47F68]/20 text-[#203B3A]">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#F0EBDD] border border-[#829B8B]/40 text-[11px] text-[#203B3A]">
                  <strong>Recommended Action:</strong> {currentResult.earlyAiSocialContext.earlyWarningRecommendation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: RECENT COPY SPREAD TRACKER (PAST 7 DAYS)          */}
      {/* ========================================================= */}
      {activeTab === 'spread_tracker' && currentResult && (
        <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE4DE]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#829B8B] uppercase tracking-wider block">
                Viral Lineage & Duplicate Fingerprint
              </span>
              <h2 className="text-base font-bold text-[#203B3A] mt-0.5">
                Duplicate Copy Spread Tracking Across Social Networks
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#829B8B] block">Total Monitored Copies:</span>
              <span className="text-2xl font-bold font-mono text-[#B96D70]">
                {currentResult.spreadAnalysis.copiesDetectedRecentDays} copies
              </span>
            </div>
          </div>

          {/* Daily Spread Timeline Bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#203B3A] uppercase tracking-wider text-[11px]">
                Daily Copy Velocity Timeline (Past 7 Days)
              </span>
              <span className="text-[11px] text-[#829B8B] font-mono">
                Fingerprint: {currentResult.spreadAnalysis.similarityFingerprint}
              </span>
            </div>

            <div className="space-y-2">
              {currentResult.spreadAnalysis.dailySpreadTimeline.map((item, i) => {
                const maxCopies = Math.max(...currentResult.spreadAnalysis.dailySpreadTimeline.map(t => t.copiesCount), 1);
                const percent = Math.min(100, Math.round((item.copiesCount / maxCopies) * 100));

                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-16 font-mono text-[#829B8B] text-[11px]">
                      {item.date} ({item.day})
                    </span>
                    <div className="flex-1 bg-[#F0EBDD] h-6 rounded-md overflow-hidden relative border border-[#DCE4DE]">
                      <div
                        className="bg-[#203B3A] h-full transition-all duration-500 rounded-md"
                        style={{ width: `${percent}%` }}
                      />
                      <span className="absolute left-2.5 top-1 text-[10px] font-bold text-white drop-shadow-xs">
                        +{item.copiesCount} new copies
                      </span>
                    </div>
                    <span className="w-20 text-right font-mono font-bold text-[#203B3A]">
                      Cumul: {item.cumulativeCopies}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross-Platform Distribution Breakdown */}
          <div className="space-y-3 pt-4 border-t border-[#DCE4DE]">
            <span className="font-bold text-[#203B3A] uppercase tracking-wider text-[11px] block">
              Cross-Platform Copy Ingestion Distribution
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {currentResult.spreadAnalysis.crossPlatformBreakdown.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#F8F6F0] border border-[#DCE4DE] text-center space-y-1">
                  <span className="text-[10px] text-[#829B8B] block font-medium truncate">{p.platform}</span>
                  <span className="text-lg font-bold font-mono text-[#203B3A] block">{p.count}</span>
                  <span className="text-[10px] font-bold text-[#B96D70] block">{p.percentage}% share</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: EARLY AI SOCIAL CONTEXT SCANNER                   */}
      {/* ========================================================= */}
      {activeTab === 'early_ai_scan' && currentResult && (
        <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-6 space-y-6">
          <div className="pb-4 border-b border-[#DCE4DE]">
            <span className="text-[10px] font-mono font-bold text-[#829B8B] uppercase tracking-wider block">
              Early Detection Model
            </span>
            <h2 className="text-base font-bold text-[#203B3A] mt-0.5">
              Social Media Context Early Scanner (Pre-Viral Infection Analysis)
            </h2>
            <p className="text-xs text-[#829B8B] mt-1">
              Catches synthesized video and photo campaigns before they cross the viral threshold by evaluating early amplification networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F0EBDD]/60 border border-[#DCE4DE] space-y-2">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Bot Swarm Index</span>
              <span className="text-3xl font-bold font-mono text-[#B96D70] block">
                {currentResult.earlyAiSocialContext.botCoordinationIndex}%
              </span>
              <p className="text-xs text-[#303B3B]">
                {currentResult.earlyAiSocialContext.earlyAccountAgeCluster}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBDD]/60 border border-[#DCE4DE] space-y-2">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Engagement Discrepancy</span>
              <span className="text-3xl font-bold font-mono text-[#203B3A] block">
                {currentResult.earlyAiSocialContext.engagementMismatchScore}%
              </span>
              <p className="text-xs text-[#303B3B]">
                High re-share velocity combined with near-zero organic discussion comments indicates scripted amplification.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0EBDD]/60 border border-[#DCE4DE] space-y-2">
              <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Peak Saturation Window</span>
              <span className="text-3xl font-bold font-mono text-[#C47F68] block">
                {currentResult.earlyAiSocialContext.predictedViralSaturationHours} hrs
              </span>
              <p className="text-xs text-[#303B3B]">
                Estimated time remaining before algorithmic feeds promote this content into mainstream explore feeds.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#203B3A] text-[#F0EBDD] space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C5C77A]" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Proactive AI Mitigation Strategy
              </span>
            </div>
            <p className="text-xs text-[#DCE4DE] leading-relaxed">
              {currentResult.earlyAiSocialContext.earlyWarningRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: MONITORED MEDIA RECENT SPREAD GALLERY             */}
      {/* ========================================================= */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
            <div>
              <h3 className="text-sm font-bold text-[#203B3A] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#203B3A]" />
                <span>Recently Monitored Manipulated Media & Reels</span>
              </h3>
              <p className="text-xs text-[#829B8B] mt-0.5">
                Active catalog of deepfakes, AI videos, and manipulated graphics spreading across monitored platforms.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#829B8B]">
              {recentSpreadList.length} Items Tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DCE4DE] text-[10px] font-bold uppercase text-[#829B8B]">
                  <th className="py-2.5 px-3">Media ID</th>
                  <th className="py-2.5 px-3">Title & Platform</th>
                  <th className="py-2.5 px-3">Manipulation Class</th>
                  <th className="py-2.5 px-3">Copies Spread</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Earliest Origin</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBDD]">
                {recentSpreadList.map(item => (
                  <tr key={item.mediaId} className="hover:bg-[#F8F6F0] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#829B8B]">
                      {item.mediaId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#203B3A] max-w-[280px] truncate">
                        {item.title}
                      </div>
                      <span className="text-[10px] text-[#829B8B]">{item.platform}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.isManipulatedOrSynthetic
                            ? 'bg-[#B96D70] text-white'
                            : 'bg-[#829B8B] text-white'
                        }`}
                      >
                        {item.manipulationType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#B96D70]">
                      {item.spreadAnalysis.copiesDetectedRecentDays} copies
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#203B3A]">
                      {item.deepfakeConfidenceScore}%
                    </td>
                    <td className="py-3 px-3 text-[#303B3B] text-[11px]">
                      {item.spreadAnalysis.earliestPlatformOrigin}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setCurrentResult(item);
                          if (item.visualKeyframes && item.visualKeyframes.length > 0) {
                            setSelectedKeyframe(item.visualKeyframes[0]);
                          }
                          setUrlInput(item.mediaUrl);
                          setActiveTab('analyzer');
                        }}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#F0EBDD] text-[#203B3A] hover:bg-[#DCE4DE] transition-colors border border-[#829B8B]/40"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
