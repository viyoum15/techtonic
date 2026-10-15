import React, { useState } from 'react';
import { AlertRecord, SeverityLevel, ReviewStatus } from '../../types';
import { api } from '../../api/client';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  User,
  ExternalLink,
  Save,
  Check,
  Search,
  Filter
} from 'lucide-react';

interface AlertsReviewProps {
  alerts: AlertRecord[];
  activeAlertId?: string;
  onAlertUpdated: (updated: AlertRecord) => void;
  onNavigateToContent: (contentId: string) => void;
}

export const AlertsReview: React.FC<AlertsReviewProps> = ({
  alerts,
  activeAlertId,
  onAlertUpdated,
  onNavigateToContent
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string>(
    activeAlertId || alerts[0]?.id || ''
  );
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchAlert, setSearchAlert] = useState('');

  const activeAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  const [editStatus, setEditStatus] = useState<ReviewStatus>(activeAlert?.reviewStatus || 'new');
  const [editNote, setEditNote] = useState(activeAlert?.reviewerNotes || '');
  const [editAssignee, setEditAssignee] = useState(activeAlert?.assignedTo || 'Unassigned');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.reviewStatus !== statusFilter) return false;
    if (searchAlert.trim()) {
      const q = searchAlert.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.relatedContentSnippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAlert = (a: AlertRecord) => {
    setSelectedAlertId(a.id);
    setEditStatus(a.reviewStatus);
    setEditNote(a.reviewerNotes || '');
    setEditAssignee(a.assignedTo || 'Unassigned');
    setSuccessSaved(false);
  };

  const handleSaveAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAlert) return;

    setIsUpdating(true);
    try {
      const updated = await api.updateAlert(activeAlert.id, {
        reviewStatus: editStatus,
        reviewerNotes: editNote.trim(),
        assignedTo: editAssignee.trim()
      });
      onAlertUpdated(updated);
      setSuccessSaved(true);
      setTimeout(() => setSuccessSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#DCE4DE]">
        <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
          Threat Alerts & Human Review Workspace
        </h1>
        <p className="text-xs text-[#303B3B]/80 mt-1">
          Triage automated threat signals, record reviewer conclusions, assign incident cases, and escalate to cybersecurity units.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 border border-[#DCE4DE] rounded-xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#829B8B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchAlert}
            onChange={e => setSearchAlert(e.target.value)}
            placeholder="Search alerts by title, ID, or snippet..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#203B3A] text-[#203B3A]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-[#DCE4DE] rounded-md bg-white text-[#303B3B]"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-[#DCE4DE] rounded-md bg-white text-[#303B3B]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* 2-Column Split: Alerts List & Triage Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-5 bg-white border border-[#DCE4DE] rounded-xl divide-y divide-[#DCE4DE]/60 shadow-xs overflow-hidden">
          <div className="p-3 bg-[#F0EBDD]/60 border-b border-[#DCE4DE] text-xs font-semibold text-[#203B3A] flex justify-between items-center">
            <span>Alerts Queue ({filteredAlerts.length})</span>
            <span className="text-[11px] font-mono text-[#829B8B]">Sorted by Severity</span>
          </div>

          <div className="max-h-[640px] overflow-y-auto divide-y divide-[#DCE4DE]/50">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#829B8B]">
                No alerts match the current filter.
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isSelected = alert.id === activeAlert?.id;
                return (
                  <div
                    key={alert.id}
                    onClick={() => handleSelectAlert(alert)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#F0EBDD]/70 border-l-3 border-l-[#203B3A]'
                        : 'hover:bg-[#F8F6F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#203B3A]">{alert.id}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          alert.severity === 'critical'
                            ? 'bg-[#B96D70] text-white'
                            : alert.severity === 'high'
                            ? 'bg-[#C47F68] text-white'
                            : 'bg-[#829B8B] text-white'
                        }`}
                      >
                        {alert.severity} ({alert.riskScore})
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-[#203B3A] line-clamp-1">
                      {alert.title}
                    </h3>

                    <p className="text-[11px] text-[#303B3B]/80 line-clamp-2 italic mt-1">
                      "{alert.relatedContentSnippet}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#829B8B] mt-2 pt-1 border-t border-[#DCE4DE]/40">
                      <span>Status: {alert.reviewStatus}</span>
                      <span>Assigned: {alert.assignedTo || 'None'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Alert Detail Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {activeAlert ? (
            <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#DCE4DE] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#829B8B]">Alert Incident: {activeAlert.id}</span>
                  <h2 className="text-base font-bold text-[#203B3A] mt-0.5">
                    {activeAlert.title}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigateToContent(activeAlert.relatedContentId)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#203B3A] bg-[#F0EBDD] hover:bg-[#DCE4DE] rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <span>Open Post {activeAlert.relatedContentId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Related Snippet */}
              <div className="p-3.5 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase tracking-wider block">
                  Associated Public Post Excerpt
                </span>
                <p className="text-[#303B3B] italic leading-relaxed">
                  "{activeAlert.relatedContentSnippet}"
                </p>
              </div>

              {/* Technical Rationale */}
              <div className="space-y-1 text-xs text-[#303B3B]">
                <strong className="text-[#203B3A] block">Threat Detection Rationale:</strong>
                <p className="leading-relaxed bg-[#F0EBDD]/40 p-3 border border-[#DCE4DE] rounded-lg">
                  {activeAlert.explanation}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-[#F0EBDD]/60 border border-[#829B8B]/40 rounded-lg text-xs text-[#303B3B]">
                <strong className="text-[#203B3A]">Recommended Review Action: </strong>
                <span>{activeAlert.recommendedReviewAction}</span>
              </div>

              {/* Triage & Status Update Form */}
              <form onSubmit={handleSaveAlert} className="pt-3 border-t border-[#DCE4DE] space-y-3">
                <div className="text-xs font-bold text-[#203B3A]">
                  Update Alert Triage & Record Notes
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-[#829B8B] uppercase font-semibold mb-1">
                      Review Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[#DCE4DE] rounded-md bg-white text-[#303B3B]"
                    >
                      <option value="new">New (Unreviewed)</option>
                      <option value="under_review">Under Review</option>
                      <option value="escalated">Escalate to Cyber Unit</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#829B8B] uppercase font-semibold mb-1">
                      Assigned Investigator
                    </label>
                    <input
                      type="text"
                      value={editAssignee}
                      onChange={e => setEditAssignee(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[#DCE4DE] rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#829B8B] uppercase font-semibold mb-1">
                    Analyst Working Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editNote}
                    onChange={e => setEditNote(e.target.value)}
                    placeholder="Document action taken or registrar abuse ticket..."
                    className="w-full p-2 text-xs border border-[#DCE4DE] rounded-md"
                  />
                </div>

                {successSaved && (
                  <div className="p-2 bg-[#DCE4DE] border border-[#829B8B] rounded text-xs text-[#203B3A] font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Alert updated successfully in database.</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#203B3A] hover:bg-[#203B3A]/90 rounded-md transition-colors"
                  >
                    {isUpdating ? 'Saving...' : 'Update Alert Record'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-[#DCE4DE] rounded-xl text-xs text-[#829B8B]">
              Select an alert on the left to triage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
