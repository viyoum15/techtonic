import React, { useState } from 'react';
import { api } from '../../api/client';
import { X, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCompleted: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportCompleted
}) => {
  const [csvText, setCsvText] = useState(`text,platform,topic,url
"URGENT: Central Reserve Bank has ordered an emergency $500 ATM withdrawal cap nationwide starting Friday!","X (Twitter)","Financial Rumor","https://x.com/post/1"
"Free solar subsidy grant debit card $1,200 now available for all homes! Apply http://claim-energy-relief.xyz/apply","Telegram","Utility Scam","http://claim-energy-relief.xyz/apply"
"Municipal council updates transit line schedule for upcoming weekend maintenance.","Reddit","Civic Info","https://reddit.com/r/transit/2"`);

  const [isImporting, setIsImporting] = useState(false);
  const [report, setReport] = useState<{ message: string; received: number; flagged: number } | null>(null);

  if (!isOpen) return null;

  const handleProcessImport = async () => {
    if (!csvText.trim()) return;

    setIsImporting(true);
    setReport(null);

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must contain a header and at least one data row.');

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const textIdx = headers.indexOf('text');

      if (textIdx === -1) {
        throw new Error('CSV must include a "text" header column.');
      }

      const recordsToImport: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Basic CSV split respecting quotes
        const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        const parts = match ? match.map(m => m.replace(/^"|"$/g, '').trim()) : line.split(',');

        if (parts[textIdx] && parts[textIdx].length >= 5) {
          recordsToImport.push({
            text: parts[textIdx],
            platform: parts[headers.indexOf('platform')] || 'Batch CSV',
            topic: parts[headers.indexOf('topic')] || 'Imported Public Post',
            url: parts[headers.indexOf('url')] || undefined
          });
        }
      }

      const res = await api.importContentCsv(recordsToImport);
      setReport({
        message: res.message,
        received: recordsToImport.length,
        flagged: res.recordsFlagged
      });
      onImportCompleted();
    } catch (err: any) {
      alert(err.message || 'CSV Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#203B3A]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-[#DCE4DE] max-w-xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCE4DE]">
          <div>
            <h3 className="text-base font-bold text-[#203B3A]">Batch CSV Public Post Import</h3>
            <p className="text-xs text-[#303B3B]/70">Ingest multiple public discourse records via comma-separated template</p>
          </div>
          <button onClick={onClose} className="text-[#829B8B] hover:text-[#203B3A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg text-xs space-y-1">
            <span className="font-bold text-[#203B3A] block">Documented CSV Template Format:</span>
            <code className="font-mono text-[#829B8B] text-[11px] block">
              text,platform,topic,url
            </code>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#203B3A] mb-1">
              Paste CSV Content or Template:
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              className="w-full p-2.5 text-xs font-mono border border-[#DCE4DE] rounded-md bg-white text-[#203B3A]"
            />
          </div>

          {report && (
            <div className="p-3 bg-[#DCE4DE]/60 border border-[#829B8B] rounded-lg text-xs text-[#203B3A] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#203B3A]" />
                <span>{report.message}</span>
              </div>
              <div className="text-[11px] text-[#303B3B]/80 font-mono">
                Received: {report.received} | Flagged as High/Critical: {report.flagged}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE4DE]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#303B3B] hover:text-[#203B3A]"
            >
              Close
            </button>
            <button
              onClick={handleProcessImport}
              disabled={isImporting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#203B3A] hover:bg-[#203B3A]/90 rounded-md transition-colors"
            >
              {isImporting ? 'Ingesting...' : 'Execute Ingestion Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
