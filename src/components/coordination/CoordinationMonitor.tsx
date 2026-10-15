import React, { useState } from 'react';
import { CoordinationCluster, ReviewStatus } from '../../types';
import {
  Users,
  TrendingUp,
  AlertOctagon,
  Copy,
  Hash,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Check,
  Search,
  Filter,
  Eye
} from 'lucide-react';

interface CoordinationMonitorProps {
  clusters: CoordinationCluster[];
}

export const CoordinationMonitor: React.FC<CoordinationMonitorProps> = ({ clusters }) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>(clusters[0]?.clusterId || '');
  const [copiedForensic, setCopiedForensic] = useState(false);

  const selectedCluster = clusters.find(c => c.clusterId === selectedClusterId) || clusters[0] || null;

  const handleDownloadForensicJson = () => {
    if (!selectedCluster) return;
    const blob = new Blob([JSON.stringify(selectedCluster, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordination_cluster_${selectedCluster.clusterId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-[#DCE4DE]">
        <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
          Coordinated Inauthentic Behavior & Bot Swarm Monitor
        </h1>
        <p className="text-xs text-[#303B3B]/80 mt-1">
          Detect copy-paste message campaigns, burst synchronization anomalies, and coordinated amplification patterns.
        </p>
      </div>

      {/* Cluster Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#DCE4DE] shadow-xs">
          <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Active Clusters</span>
          <span className="text-xl font-bold font-mono text-[#203B3A] mt-1 block">
            {clusters.length}
          </span>
          <span className="text-[10px] text-[#829B8B] mt-0.5 block">Under monitoring</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4DE] shadow-xs">
          <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Burst Anomalies</span>
          <span className="text-xl font-bold font-mono text-[#B96D70] mt-1 block">
            {clusters.filter(c => c.burstDetected).length} Detected
          </span>
          <span className="text-[10px] text-[#829B8B] mt-0.5 block">&gt;5x baseline velocity</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4DE] shadow-xs">
          <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Highest Similarity</span>
          <span className="text-xl font-bold font-mono text-[#203B3A] mt-1 block">
            {clusters.length > 0 ? `${(Math.max(...clusters.map(c => c.similarityScore)) * 100).toFixed(0)}%` : '0%'}
          </span>
          <span className="text-[10px] text-[#829B8B] mt-0.5 block">Jaccard / Cosine index</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4DE] shadow-xs">
          <span className="text-[10px] font-bold text-[#829B8B] uppercase block">Total Swarm Posts</span>
          <span className="text-xl font-bold font-mono text-[#203B3A] mt-1 block">
            {clusters.reduce((acc, c) => acc + c.similarPostCount, 0)}
          </span>
          <span className="text-[10px] text-[#829B8B] mt-0.5 block">Identified across networks</span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Clusters */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-[#303B3B] uppercase tracking-wider pb-1">
            Detected Coordination Clusters
          </div>

          {clusters.map(cluster => {
            const isSelected = selectedCluster?.clusterId === cluster.clusterId;
            return (
              <div
                key={cluster.clusterId}
                onClick={() => setSelectedClusterId(cluster.clusterId)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white text-left ${
                  isSelected
                    ? 'border-[#203B3A] shadow-md ring-1 ring-[#203B3A]'
                    : 'border-[#DCE4DE] hover:border-[#829B8B] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#829B8B] bg-[#F0EBDD] px-1.5 py-0.5 rounded">
                      {cluster.clusterId}
                    </span>
                    <span className="text-xs font-bold text-[#203B3A] truncate max-w-[160px]">
                      {cluster.topic}
                    </span>
                  </div>

                  {cluster.burstDetected && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#B96D70] text-white">
                      BURST
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs border-y border-[#F0EBDD] my-2">
                  <div>
                    <span className="text-[10px] text-[#829B8B] block">Posts</span>
                    <strong className="text-[#203B3A] font-mono">{cluster.similarPostCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#829B8B] block">Window</span>
                    <strong className="text-[#203B3A] font-mono">{cluster.timeWindowHours}h</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#829B8B] block">Similarity</span>
                    <strong className="text-[#203B3A] font-mono">{(cluster.similarityScore * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {cluster.commonKeywords.slice(0, 3).map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F8F6F0] text-[#303B3B] border border-[#DCE4DE]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Forensic Investigation Dossier */}
        <div className="lg:col-span-7 sticky top-16 space-y-4">
          {selectedCluster ? (
            <div className="bg-white rounded-xl border border-[#DCE4DE] shadow-xs p-5 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#DCE4DE]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#829B8B] uppercase tracking-wider block">
                    Coordination Dossier
                  </span>
                  <h3 className="text-base font-bold text-[#203B3A] mt-0.5">
                    {selectedCluster.clusterId}: {selectedCluster.topic}
                  </h3>
                </div>

                <button
                  onClick={handleDownloadForensicJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F0EBDD] text-[#203B3A] border border-[#829B8B] hover:bg-[#DCE4DE] transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              {/* Behavior Indicators */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#303B3B] uppercase tracking-wider block">
                  Synchronicity & Behavioral Flags
                </span>
                <div className="space-y-1.5">
                  {selectedCluster.flaggingReasons.map((reason, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#F8F6F0] border border-[#DCE4DE] text-xs text-[#303B3B]"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-[#C47F68] shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Messages Comparison */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#303B3B] uppercase tracking-wider">
                    Near-Duplicate Message Samples ({selectedCluster.sampleRecords.length})
                  </span>
                  <span className="text-[10px] text-[#829B8B] font-mono">
                    High Levenshtein Alignment
                  </span>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {selectedCluster.sampleRecords.map((sample, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[#DCE4DE] bg-[#F8F6F0] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#829B8B]">
                        <span className="font-semibold text-[#203B3A]">{sample.author}</span>
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span>{sample.platform}</span>
                          <span>•</span>
                          <span>{new Date(sample.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <p className="text-xs font-serif text-[#303B3B] italic bg-white p-2 rounded border border-[#DCE4DE]">
                        "{sample.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Campaign Domains */}
              {selectedCluster.sharedUrls.length > 0 && (
                <div className="p-3.5 rounded-lg bg-[#F0EBDD]/60 border border-[#DCE4DE] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#829B8B] uppercase block">
                    Shared Amplified Link Target:
                  </span>
                  <div className="space-y-1">
                    {selectedCluster.sharedUrls.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#203B3A]">
                        <ExternalLink className="w-3 h-3 text-[#829B8B]" />
                        <span className="truncate">{u}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-[#DCE4DE] text-center text-xs text-[#829B8B]">
              Select a cluster from the left to view in-depth coordination forensic data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
