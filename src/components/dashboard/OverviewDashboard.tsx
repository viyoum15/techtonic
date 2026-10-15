import React, { useState } from 'react';
import { DashboardSummary, AlertRecord } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Database,
  Filter,
  Film,
  Zap
} from 'lucide-react';

interface OverviewDashboardProps {
  summary: DashboardSummary | null;
  alerts: AlertRecord[];
  onNavigate: (view: string, contextId?: string) => void;
  onRefresh: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  summary,
  alerts,
  onNavigate,
  onRefresh
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7d' | '24h'>('7d');

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-12 text-xs font-mono text-[#303B3B]">
        Loading SocialWatch monitoring metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Page Title & Demo Data Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE4DE]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
              SocialWatch AI — Executive Threat Intelligence Overview
            </h1>
          </div>
          <p className="text-xs text-[#303B3B]/80 mt-1">
            Real-time public social media monitoring for misinformation, cybercrime signals, coordinated activity, and emerging topics.
          </p>
        </div>

        {/* Demo Mode Notice & Refresh */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-[#F0EBDD] border border-[#829B8B]/40 rounded-lg text-xs font-mono text-[#203B3A] flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C5C77A]" />
            <span>Synthetic Dataset Ingested</span>
          </div>

          <button
            onClick={onRefresh}
            title="Refresh dashboard metrics"
            className="p-1.5 rounded-lg border border-[#DCE4DE] bg-white hover:bg-[#F0EBDD] text-[#203B3A] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div
          onClick={() => onNavigate('content')}
          className="p-4 bg-white border border-[#DCE4DE] rounded-xl hover:border-[#829B8B] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#829B8B] uppercase tracking-wider">
            Total Public Posts
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#203B3A] mt-1">
            {summary.totalPostsProcessed.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#303B3B]/70 mt-1">
            Monitored public intake
          </div>
        </div>

        <div
          onClick={() => onNavigate('alerts')}
          className="p-4 bg-white border border-[#DCE4DE] rounded-xl hover:border-[#829B8B] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#C47F68] uppercase tracking-wider">
            Flagged for Review
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#203B3A] mt-1">
            {summary.itemsFlaggedForReview}
          </div>
          <div className="text-[11px] text-[#303B3B]/70 mt-1">
            Human verification pending
          </div>
        </div>

        <div
          onClick={() => onNavigate('cybercrime')}
          className="p-4 bg-white border border-[#DCE4DE] rounded-xl hover:border-[#829B8B] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#B96D70] uppercase tracking-wider">
            Cybercrime Signals
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#B96D70] mt-1">
            {summary.potentialCybercrimeCount}
          </div>
          <div className="text-[11px] text-[#303B3B]/70 mt-1">
            Phishing & OTP scams
          </div>
        </div>

        <div
          onClick={() => onNavigate('topics')}
          className="p-4 bg-white border border-[#DCE4DE] rounded-xl hover:border-[#829B8B] transition-colors cursor-pointer shadow-xs"
        >
          <div className="text-[11px] font-semibold text-[#203B3A] uppercase tracking-wider">
            Emerging Topics
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#203B3A] mt-1">
            {summary.emergingTopicsCount}
          </div>
          <div className="text-[11px] text-[#303B3B]/70 mt-1">
            Statistical volume anomalies
          </div>
        </div>

        <div
          onClick={() => onNavigate('alerts')}
          className="p-4 bg-white border border-[#B96D70]/40 rounded-xl hover:border-[#B96D70] transition-colors cursor-pointer shadow-xs col-span-2 md:col-span-1"
        >
          <div className="text-[11px] font-semibold text-[#B96D70] uppercase tracking-wider">
            High-Priority Alerts
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#B96D70] mt-1">
            {summary.highPriorityAlertsCount}
          </div>
          <div className="text-[11px] text-[#303B3B]/70 mt-1">
            Immediate review needed
          </div>
        </div>
      </div>

      {/* Horizontal Spotlight: Synthetic Media & Video Forensic Lab */}
      <div className="bg-[#203B3A] text-[#F0EBDD] rounded-xl p-4 sm:p-5 shadow-xs border border-[#303B3B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#829B8B] text-[#203B3A]">
              <Film className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F0EBDD]">
              Video, Reel & Photo Fake Detection + Copy Spread Tracker
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#B96D70] text-white">
              NEW FORENSIC LAB
            </span>
          </div>
          <p className="text-xs text-[#DCE4DE] max-w-2xl leading-relaxed">
            Inspect direct Instagram Reels, TikToks, and photos to uncover deepfake face-swaps and track how many unauthorized copies spread over the last 1–7 days. Includes early AI social context scanning.
          </p>
        </div>

        <button
          onClick={() => onNavigate('media')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F0EBDD] text-[#203B3A] font-bold text-xs hover:bg-[#DCE4DE] transition-colors shadow-xs shrink-0 self-stretch md:self-auto justify-center"
        >
          <Zap className="w-3.5 h-3.5 text-[#C47F68]" />
          <span>Launch Reel & Video Forensics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main 2-Column Split: Time Series Chart & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Flagged Content Over Time Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Flagged Content Volume Over Time
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Daily trend comparison: Total public posts vs Flagged misinformation & cybercrime
              </p>
            </div>
            <div className="text-xs font-mono text-[#829B8B]">7-Day Log</div>
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-[#DCE4DE]/50">
            {summary.timeSeriesData.map((d, idx) => {
              const maxTotal = Math.max(...summary.timeSeriesData.map(item => item.total));
              const heightPct = (d.total / maxTotal) * 100;
              const flaggedHeightPct = (d.flagged / d.total) * heightPct;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-mono text-[#829B8B] group-hover:text-[#203B3A] transition-colors">
                    {d.flagged}/{d.total}
                  </span>
                  <div className="w-full bg-[#DCE4DE]/40 rounded-t-sm h-32 flex flex-col justify-end overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-[#829B8B]/40 flex flex-col justify-end"
                    >
                      <div
                        style={{ height: `${flaggedHeightPct}%` }}
                        className="w-full bg-[#C47F68] group-hover:bg-[#B96D70] transition-colors rounded-t-xs"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#303B3B]">{d.date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#303B3B]/70 pt-1">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#829B8B]/40" />
                <span>Total Posts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#C47F68]" />
                <span>Flagged Incidents</span>
              </span>
            </div>
            <span className="font-mono text-[11px]">Updated {new Date(summary.dataFreshnessTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="lg:col-span-5 bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Threat Category Distribution
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Breakdown of active detection alerts
              </p>
            </div>
            <button
              onClick={() => onNavigate('content')}
              className="text-xs font-semibold text-[#829B8B] hover:text-[#203B3A] inline-flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {summary.categoryDistribution.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#303B3B]">{cat.name}</span>
                  <span className="font-mono text-[#203B3A] font-semibold">{cat.count} alerts</span>
                </div>
                <div className="w-full h-2 bg-[#DCE4DE]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (cat.count / 40) * 100)}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#F0EBDD]/60 border border-[#829B8B]/30 rounded-lg text-xs text-[#303B3B]/90">
            <strong>Detection Rule:</strong> Flags are triggered by explainable psychological urgency and credential harvesting signatures.
          </div>
        </div>
      </div>

      {/* Topic Velocity Panel & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic Velocity Panel */}
        <div className="lg:col-span-6 bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCE4DE]">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Emerging Topic Velocity Indicators
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Monitored narrative speed compared to 14-day rolling baseline
              </p>
            </div>
            <button
              onClick={() => onNavigate('topics')}
              className="text-xs font-semibold text-[#829B8B] hover:text-[#203B3A] inline-flex items-center gap-1"
            >
              <span>View Topics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#DCE4DE]/50">
            {summary.topicVelocity.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#203B3A] block">{item.topic}</span>
                  <span className="text-[11px] font-mono text-[#C47F68] font-semibold">
                    {item.velocity}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-white bg-[#C47F68] px-2 py-0.5 rounded font-bold">
                  ANOMALOUS SPIKE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution */}
        <div className="lg:col-span-6 bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCE4DE]">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Public Platform Intake Distribution
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Ingested publicly accessible discourse by channel
              </p>
            </div>
            <span className="text-xs font-mono text-[#829B8B]">5 Public Sources</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {summary.sourceDistribution.map((src, idx) => (
              <div key={idx} className="p-3 bg-[#F0EBDD]/40 border border-[#DCE4DE] rounded-lg text-xs">
                <span className="text-[#829B8B] block text-[11px] font-medium">{src.platform}</span>
                <span className="text-base font-bold font-mono text-[#203B3A]">{src.count}</span>
                <span className="text-[10px] text-[#303B3B]/70 block">records</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Alerts Table */}
        <div className="lg:col-span-7 bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCE4DE]">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Recent High-Priority Alert Queue
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Actionable findings awaiting analyst triage
              </p>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-[#829B8B] hover:text-[#203B3A] inline-flex items-center gap-1"
            >
              <span>Manage All ({alerts.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#DCE4DE]/50">
            {alerts.slice(0, 3).map(a => (
              <div
                key={a.id}
                onClick={() => onNavigate('alerts', a.id)}
                className="py-3 cursor-pointer hover:bg-[#F0EBDD]/40 -mx-2 px-2 rounded-lg transition-colors space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#203B3A]">
                    {a.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      a.severity === 'critical'
                        ? 'bg-[#B96D70] text-white'
                        : a.severity === 'high'
                        ? 'bg-[#C47F68] text-white'
                        : 'bg-[#829B8B] text-white'
                    }`}
                  >
                    {a.severity} ({a.riskScore}/100)
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-[#203B3A] line-clamp-1">
                  {a.title}
                </h3>
                <p className="text-[11px] text-[#303B3B]/80 line-clamp-1 italic">
                  "{a.relatedContentSnippet}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-5 bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCE4DE]">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Analyst & System Audit Log
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Immutable record of analyst actions
              </p>
            </div>
            <span className="text-xs font-mono text-[#829B8B]">Audit Active</span>
          </div>

          <div className="divide-y divide-[#DCE4DE]/50">
            {summary.recentActivity.map((act, idx) => (
              <div key={act.id || idx} className="py-2.5 text-xs space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#203B3A]">{act.action}</span>
                  <span className="font-mono text-[#829B8B]">{act.time}</span>
                </div>
                <div className="text-[#303B3B]/80 text-[11px] flex items-center justify-between">
                  <span>{act.item}</span>
                  <span className="text-[#829B8B]">{act.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
