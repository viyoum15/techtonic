import React, { useState } from 'react';
import { ContentRecord, RiskCategory, SeverityLevel, ReviewStatus } from '../../types';
import { api } from '../../api/client';
import {
  Search,
  Filter,
  Plus,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  Check,
  Save,
  MessageSquare,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Calendar,
  Share2
} from 'lucide-react';

interface ContentExplorerProps {
  records: ContentRecord[];
  onRecordUpdated: (updated: ContentRecord) => void;
  onOpenIntake: () => void;
  onOpenImport: () => void;
}

export const ContentExplorer: React.FC<ContentExplorerProps> = ({
  records,
  onRecordUpdated,
  onOpenIntake,
  onOpenImport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(records[0]?.id || null);

  // Review drawer state
  const [reviewStatusInput, setReviewStatusInput] = useState<ReviewStatus>('new');
  const [reviewerNotesInput, setReviewerNotesInput] = useState('');
  const [reviewerNameInput, setReviewerNameInput] = useState('Analyst Duty #402');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSavedSuccess, setReviewSavedSuccess] = useState(false);

  // Filter logic
  const filteredRecords = records.filter(r => {
    if (categoryFilter !== 'all' && r.detection.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && r.detection.severity !== severityFilter) return false;
    if (platformFilter !== 'all' && r.platform !== platformFilter) return false;
    if (statusFilter !== 'all' && r.reviewStatus !== statusFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchText = r.publicText.toLowerCase().includes(q);
      const matchTopic = r.topic.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      const matchRegion = r.region?.toLowerCase().includes(q);
      if (!matchText && !matchTopic && !matchId && !matchRegion) return false;
    }
    return true;
  });

  const selectedRecord = records.find(r => r.id === selectedRecordId) || filteredRecords[0] || null;

  const handleSelectRecord = (record: ContentRecord) => {
    setSelectedRecordId(record.id);
    setReviewStatusInput(record.reviewStatus);
    setReviewerNotesInput(record.reviewerNotes || '');
    setReviewSavedSuccess(false);
  };

  const handleSaveReview = async () => {
    if (!selectedRecord) return;
    setIsSubmittingReview(true);
    setReviewSavedSuccess(false);
    try {
      const res = await api.reviewContent(selectedRecord.id, {
        reviewStatus: reviewStatusInput,
        reviewerNotes: reviewerNotesInput,
        reviewerName: reviewerNameInput
      });
      if (res.success && res.record) {
        onRecordUpdated(res.record);
        setReviewSavedSuccess(true);
        setTimeout(() => setReviewSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return 'bg-[#B96D70] text-[#F0EBDD] font-bold';
      case 'high':
        return 'bg-[#C47F68] text-[#F0EBDD] font-bold';
      case 'medium':
        return 'bg-[#C5C77A]/30 text-[#303B3B] font-semibold border border-[#C5C77A]';
      case 'low':
      default:
        return 'bg-[#829B8B]/20 text-[#203B3A] font-medium border border-[#829B8B]/40';
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'resolved':
      case 'reviewed':
        return 'bg-[#829B8B]/25 text-[#203B3A] border border-[#829B8B]';
      case 'escalated':
        return 'bg-[#B96D70]/20 text-[#B96D70] border border-[#B96D70]/40';
      case 'under_review':
        return 'bg-[#C47F68]/20 text-[#C47F68] border border-[#C47F68]/40';
      case 'new':
      default:
        return 'bg-[#DCE4DE] text-[#303B3B] border border-[#303B3B]/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE4DE]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
            Social Content & Threat Ingestion Explorer
          </h1>
          <p className="text-xs text-[#303B3B]/80 mt-1">
            Browse public discourse entries, evaluate multi-modal indicators, and submit human determinations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIntake}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#203B3A] text-[#F0EBDD] hover:bg-[#303B3B] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Ingest</span>
          </button>
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#F0EBDD] p-4 rounded-xl border border-[#DCE4DE] shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#829B8B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, ID, topic, region..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#DCE4DE] bg-white text-[#303B3B] placeholder-[#829B8B] focus:outline-none focus:ring-1 focus:ring-[#203B3A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#DCE4DE]">
              <span className="text-[11px] font-medium text-[#829B8B]">Category:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs bg-transparent text-[#303B3B] font-medium focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="misinformation">Misinformation</option>
                <option value="cybercrime_phishing">Phishing & Creds</option>
                <option value="cybercrime_scam">Financial Scam</option>
                <option value="coordinated_inauthentic">Coordinated Bot Activity</option>
                <option value="emerging_tension">Social Tension</option>
                <option value="benign_public">Benign Public</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#DCE4DE]">
              <span className="text-[11px] font-medium text-[#829B8B]">Platform:</span>
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="text-xs bg-transparent text-[#303B3B] font-medium focus:outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Telegram">Telegram</option>
                <option value="Reddit">Reddit</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Web Forum">Web Forum</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#DCE4DE]">
              <span className="text-[11px] font-medium text-[#829B8B]">Severity:</span>
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="text-xs bg-transparent text-[#303B3B] font-medium focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#DCE4DE]">
              <span className="text-[11px] font-medium text-[#829B8B]">Review:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs bg-transparent text-[#303B3B] font-medium focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New (Unreviewed)</option>
                <option value="under_review">Under Review</option>
                <option value="escalated">Escalated</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#303B3B]/70 pt-1">
          <span>Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> monitored records</span>
          {(categoryFilter !== 'all' || severityFilter !== 'all' || platformFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSeverityFilter('all');
                setPlatformFilter('all');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className="text-[#B96D70] font-semibold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Split View: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Records Feed */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-[#DCE4DE] text-center space-y-2">
              <p className="text-sm font-semibold text-[#303B3B]">No content matches the selected filters.</p>
              <p className="text-xs text-[#829B8B]">Try adjusting your search keywords or clearing active filters.</p>
            </div>
          ) : (
            filteredRecords.map(record => {
              const isSelected = selectedRecord?.id === record.id;
              return (
                <div
                  key={record.id}
                  onClick={() => handleSelectRecord(record)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white text-left ${
                    isSelected
                      ? 'border-[#203B3A] shadow-md ring-1 ring-[#203B3A]'
                      : 'border-[#DCE4DE] hover:border-[#829B8B] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#829B8B] bg-[#F0EBDD] px-1.5 py-0.5 rounded">
                        {record.id}
                      </span>
                      <span className="text-[11px] font-semibold text-[#303B3B]">
                        {record.platform}
                      </span>
                      <span className="text-[10px] text-[#829B8B]">•</span>
                      <span className="text-[10px] text-[#829B8B]">
                        {record.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm capitalize ${getSeverityBadge(record.detection.severity)}`}>
                        {record.detection.severity}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm capitalize ${getStatusBadge(record.reviewStatus)}`}>
                        {record.reviewStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#303B3B] font-medium line-clamp-3 mb-2 leading-relaxed">
                    {record.publicText}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-[#829B8B] pt-2 border-t border-[#F0EBDD] gap-2">
                    <div className="flex items-center gap-3">
                      <span>Risk Score: <strong className="text-[#203B3A] font-mono">{record.detection.riskScore}/100</strong></span>
                      {record.region && <span>{record.region}</span>}
                      {record.mediaType !== 'text_only' && (
                        <span className="inline-flex items-center gap-1 text-[#203B3A]">
                          <ImageIcon className="w-3 h-3" />
                          {record.mediaType.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[#829B8B]">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Inspector & Review Station */}
        <div className="lg:col-span-5 sticky top-16 space-y-4">
          {selectedRecord ? (
            <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-5">
              {/* Record Header */}
              <div className="pb-3 border-b border-[#DCE4DE] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#829B8B] tracking-wider uppercase">
                    Record Dossier
                  </span>
                  <span className="text-[10px] text-[#829B8B] font-mono">
                    Provenance: {selectedRecord.dataProvenance}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#203B3A] flex items-center justify-between">
                  <span>{selectedRecord.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-sm ${getSeverityBadge(selectedRecord.detection.severity)}`}>
                    {selectedRecord.detection.severity.toUpperCase()}
                  </span>
                </h3>
              </div>

              {/* Full Original Text */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-[#303B3B] uppercase tracking-wider flex items-center justify-between">
                  <span>Original Ingested Content</span>
                  <span className="text-[10px] font-normal text-[#829B8B]">Lang: {selectedRecord.language}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE] text-xs font-serif text-[#303B3B] leading-relaxed select-text">
                  "{selectedRecord.publicText}"
                </div>
                {selectedRecord.publicUrl && (
                  <div className="text-[11px] flex items-center gap-1.5 text-[#203B3A] hover:underline pt-1">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <a href={selectedRecord.publicUrl} target="_blank" rel="noreferrer" className="truncate font-mono text-[10px]">
                      {selectedRecord.publicUrl}
                    </a>
                  </div>
                )}
              </div>

              {/* Multi-modal Metadata if available */}
              {selectedRecord.mediaMetadata && (
                <div className="p-3 bg-[#DCE4DE]/40 rounded-lg border border-[#DCE4DE] space-y-1.5">
                  <div className="text-[11px] font-bold text-[#203B3A] flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Media Metadata & OCR Findings</span>
                  </div>
                  {selectedRecord.mediaMetadata.extractedOcr && (
                    <div className="text-[11px] text-[#303B3B]">
                      <span className="font-semibold">OCR Extracted Text: </span>
                      <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#DCE4DE] block mt-1">
                        {selectedRecord.mediaMetadata.extractedOcr}
                      </span>
                    </div>
                  )}
                  {selectedRecord.mediaMetadata.userSuppliedCaption && (
                    <div className="text-[11px] text-[#303B3B]">
                      <span className="font-semibold">Caption: </span>
                      <span>{selectedRecord.mediaMetadata.userSuppliedCaption}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Automated NLP / Threat Detection Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#303B3B] uppercase tracking-wider">
                  Detection Breakdown
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-[#DCE4DE]">
                    <span className="text-[10px] text-[#829B8B] block font-medium">Risk Score</span>
                    <span className="text-base font-bold font-mono text-[#203B3A]">
                      {selectedRecord.detection.riskScore}/100
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#DCE4DE]">
                    <span className="text-[10px] text-[#829B8B] block font-medium">Confidence</span>
                    <span className="text-base font-bold font-mono text-[#203B3A]">
                      {selectedRecord.detection.evidenceConfidence}%
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-lg bg-white border border-[#DCE4DE] space-y-1">
                  <span className="text-[10px] font-bold text-[#829B8B] uppercase">Explainable Assessment:</span>
                  <p className="text-xs text-[#303B3B] leading-relaxed">
                    {selectedRecord.detection.explanation}
                  </p>
                </div>

                {/* Indicators Found */}
                <div className="p-3 rounded-lg bg-white border border-[#DCE4DE] space-y-2">
                  <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Heuristic Indicators:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecord.detection.matchedIndicators.map((ind, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0EBDD] text-[#203B3A] border border-[#DCE4DE]"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Human Review & Disposition Form */}
              <div className="p-4 rounded-xl bg-[#F0EBDD] border border-[#829B8B]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#203B3A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#203B3A]" />
                    <span>Human Review & Signoff</span>
                  </h4>
                  {selectedRecord.reviewedAt && (
                    <span className="text-[10px] text-[#829B8B]">
                      Last: {new Date(selectedRecord.reviewedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#303B3B] uppercase block mb-1">
                      Disposition Status
                    </label>
                    <select
                      value={reviewStatusInput}
                      onChange={e => setReviewStatusInput(e.target.value as ReviewStatus)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-[#DCE4DE] text-[#303B3B] font-medium focus:ring-1 focus:ring-[#203B3A]"
                    >
                      <option value="new">New (Awaiting Review)</option>
                      <option value="under_review">Under Active Review</option>
                      <option value="escalated">Escalated to Cyber Triage</option>
                      <option value="reviewed">Reviewed & Verified Safe</option>
                      <option value="resolved">Resolved / Action Dispatched</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#303B3B] uppercase block mb-1">
                      Analyst Case Notes
                    </label>
                    <textarea
                      rows={3}
                      value={reviewerNotesInput}
                      onChange={e => setReviewerNotesInput(e.target.value)}
                      placeholder="Add evidentiary reasoning, follow-up actions taken, or escalation context..."
                      className="w-full text-xs p-2 rounded-lg bg-white border border-[#DCE4DE] text-[#303B3B] focus:ring-1 focus:ring-[#203B3A]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#829B8B]">
                      Signed by: {reviewerNameInput}
                    </span>
                    <button
                      onClick={handleSaveReview}
                      disabled={isSubmittingReview}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#203B3A] text-[#F0EBDD] font-semibold text-xs hover:bg-[#303B3B] transition-colors disabled:opacity-50"
                    >
                      {reviewSavedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#C5C77A]" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSubmittingReview ? 'Saving...' : 'Update Review'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-[#DCE4DE] text-center text-xs text-[#829B8B]">
              Select a post from the explorer feed to inspect details and perform review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
