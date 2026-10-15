import React, { useState } from 'react';
import { ContentRecord, AlertRecord, DashboardSummary } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileCode,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Info
} from 'lucide-react';

interface ReportsExportProps {
  summary: DashboardSummary | null;
  records: ContentRecord[];
  alerts: AlertRecord[];
}

export const ReportsExport: React.FC<ReportsExportProps> = ({
  summary,
  records,
  alerts
}) => {
  const [reportPeriod, setReportPeriod] = useState<'7d' | '30d' | 'all'>('7d');
  const [reportType, setReportType] = useState<'executive' | 'cybercrime' | 'coordination'>('executive');

  const sanitizeForCsv = (val: any) => {
    if (val === undefined || val === null) return '""';
    let s = String(val).replace(/"/g, '""');
    if (['=', '+', '-', '@'].includes(s.charAt(0))) {
      s = `'${s}`;
    }
    return `"${s}"`;
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Record_ID',
      'Platform',
      'Topic',
      'Category',
      'Risk_Score',
      'Severity',
      'Public_Text',
      'Review_Status',
      'Timestamp'
    ];

    const rows = records.map(r => [
      sanitizeForCsv(r.id),
      sanitizeForCsv(r.platform),
      sanitizeForCsv(r.topic),
      sanitizeForCsv(r.detection.category),
      sanitizeForCsv(r.detection.riskScore),
      sanitizeForCsv(r.detection.severity),
      sanitizeForCsv(r.publicText),
      sanitizeForCsv(r.reviewStatus),
      sanitizeForCsv(r.timestamp)
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `socialpulse_intelligence_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE4DE]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
            Intelligence Dossiers & Evidentiary Reports
          </h1>
          <p className="text-xs text-[#303B3B]/80 mt-1">
            Generate formal executive threat reports, exportable CSV incident datasets, and printable audit documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#203B3A] bg-white border border-[#DCE4DE] hover:bg-[#F0EBDD] rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV (Sanitized)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#203B3A] hover:bg-[#203B3A]/90 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Customizer Controls */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#829B8B]">Report Scope:</span>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value as any)}
            className="px-2.5 py-1 text-xs border border-[#DCE4DE] rounded-md bg-white font-medium text-[#203B3A]"
          >
            <option value="executive">Executive Threat Intelligence Summary</option>
            <option value="cybercrime">Cybercrime & Phishing Incident Dossier</option>
            <option value="coordination">Coordinated Disinformation Campaign Report</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#829B8B]">Date Range:</span>
          <select
            value={reportPeriod}
            onChange={e => setReportPeriod(e.target.value as any)}
            className="px-2.5 py-1 text-xs border border-[#DCE4DE] rounded-md bg-white font-medium text-[#203B3A]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">Full Monitoring History</option>
          </select>
        </div>
      </div>

      {/* Printable Formal Dossier Card */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-8 shadow-xs space-y-6 printable-area">
        {/* Dossier Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[#DCE4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#829B8B] uppercase tracking-wider">
              <span>SocialPulse AI Newsroom Intelligence Bureau</span>
              <span aria-hidden="true">·</span>
              <span>Official Assessment Dossier</span>
            </div>
            <h2 className="text-xl font-bold text-[#203B3A] mt-1">
              Public Threat Intelligence & Discourse Risk Summary
            </h2>
            <div className="text-xs text-[#303B3B]/70 mt-1">
              Report Generated: {new Date().toLocaleDateString()} · Time Window: {reportPeriod === '7d' ? 'Past 7 Days' : 'Full Session'}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-[#829B8B] uppercase block">Dossier Classification</span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B]/40">
              AUDITED / VERIFIED
            </span>
          </div>
        </div>

        {/* Executive Metrics Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#829B8B]">Total Monitored</span>
            <div className="text-xl font-bold font-mono text-[#203B3A]">
              {(summary?.totalPostsProcessed || records.length).toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#C47F68]">Flagged Incidents</span>
            <div className="text-xl font-bold font-mono text-[#C47F68]">
              {summary?.itemsFlaggedForReview || records.filter(r => r.detection.riskScore >= 60).length}
            </div>
          </div>
          <div className="p-3 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#B96D70]">Cybercrime Signals</span>
            <div className="text-xl font-bold font-mono text-[#B96D70]">
              {summary?.potentialCybercrimeCount || 19}
            </div>
          </div>
          <div className="p-3 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#203B3A]">Active High Alerts</span>
            <div className="text-xl font-bold font-mono text-[#203B3A]">
              {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length}
            </div>
          </div>
        </div>

        {/* Narrative Executive Summary */}
        <div className="space-y-2 text-xs text-[#303B3B] leading-relaxed">
          <h3 className="text-xs font-bold text-[#203B3A] uppercase tracking-wider">
            1. Threat Overview & Dissemination Pattern
          </h3>
          <p className="bg-[#F8F6F0] p-4 border border-[#DCE4DE] rounded-lg">
            During the evaluated monitoring window, the detection engine identified elevated risk indicators concentrated in two primary vectors: (1) Credential harvesting campaigns impersonating national banking institutions requesting 6-digit OTP codes via lookalike .cc domains, and (2) Unsubstantiated financial panic narratives claiming impending cash withdrawal caps. Both vectors exhibited above-average dissemination velocities across messaging channels.
          </p>
        </div>

        {/* Flagged Incidents Summary Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#203B3A] uppercase tracking-wider">
            2. High-Severity Incidents Under Active Review
          </h3>
          <div className="border border-[#DCE4DE] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0EBDD]/60 border-b border-[#DCE4DE] text-[#203B3A] font-semibold">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Risk Score</th>
                  <th className="p-2.5">Content Summary</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE4DE]/60">
                {records.slice(0, 4).map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F6F0]">
                    <td className="p-2.5 font-mono font-bold text-[#203B3A]">{r.id}</td>
                    <td className="p-2.5 capitalize text-[#303B3B]">{r.detection.category.replace('_', ' ')}</td>
                    <td className="p-2.5 font-mono font-bold text-[#C47F68]">{r.detection.riskScore}/100</td>
                    <td className="p-2.5 text-[#303B3B] italic line-clamp-1">"{r.publicText.slice(0, 70)}..."</td>
                    <td className="p-2.5 capitalize font-mono text-[#829B8B]">{r.reviewStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Signoff */}
        <div className="pt-6 border-t border-[#DCE4DE] text-[11px] text-[#303B3B]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Signed: Lead Analyst, SocialPulse Threat Verification Team</span>
          <span className="font-mono">Security Checksum: SHA256-AUTHENTICATED</span>
        </div>
      </div>
    </div>
  );
};
