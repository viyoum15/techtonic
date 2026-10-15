import React, { useState } from 'react';
import { EmergingTopicItem } from '../../types';
import {
  TrendingUp,
  Search,
  Filter,
  BarChart2,
  AlertTriangle,
  Info,
  Hash,
  ArrowUpRight
} from 'lucide-react';

interface EmergingTopicsProps {
  topics: EmergingTopicItem[];
}

export const EmergingTopics: React.FC<EmergingTopicsProps> = ({ topics }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTopic, setSearchTopic] = useState('');

  const filteredTopics = topics.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (searchTopic.trim()) {
      const q = searchTopic.toLowerCase();
      return (
        t.topicName.toLowerCase().includes(q) ||
        t.topKeywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#DCE4DE]">
        <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
          Emerging Topics & Keyword Velocity Detection
        </h1>
        <p className="text-xs text-[#303B3B]/80 mt-1">
          Detects rapid lexical spikes and sudden increases in public discourse mentions against 14-day rolling statistical baselines.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 border border-[#DCE4DE] rounded-xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#829B8B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTopic}
            onChange={e => setSearchTopic(e.target.value)}
            placeholder="Search emerging topics, hashtags, or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#203B3A] text-[#203B3A]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#829B8B] font-semibold">Category:</span>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-2.5 py-1 text-xs border border-[#DCE4DE] rounded-md bg-white text-[#303B3B]"
          >
            <option value="all">All Categories</option>
            <option value="misinformation">Misinformation</option>
            <option value="cybercrime_scam">Cybercrime Scam</option>
            <option value="emerging_tension">Emerging Tensions</option>
            <option value="benign_public">Benign Public</option>
          </select>
        </div>
      </div>

      {/* Topics Cards Grid */}
      <div className="space-y-4">
        {filteredTopics.map(topic => (
          <div
            key={topic.id}
            className="p-5 bg-white border border-[#DCE4DE] rounded-xl shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE4DE]">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#829B8B]">{topic.id}</span>
                <h2 className="text-base font-bold text-[#203B3A]">{topic.topicName}</h2>
                <span className="text-xs text-[#829B8B]">· {topic.category.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center gap-2">
                {topic.isAnomaly && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C47F68] text-white">
                    SPIKE +{topic.velocityMultiplier}x
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-[#203B3A] bg-[#F0EBDD] px-2 py-0.5 rounded border border-[#829B8B]/40">
                  Growth: +{topic.observedGrowthPercent}%
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#F8F6F0] border border-[#DCE4DE] rounded-lg text-xs">
              <div>
                <span className="text-[#829B8B] block text-[10px] uppercase font-semibold">24h Observed Mentions</span>
                <span className="text-base font-bold font-mono text-[#203B3A]">{topic.currentVolume24h}</span>
              </div>
              <div>
                <span className="text-[#829B8B] block text-[10px] uppercase font-semibold">14-Day Baseline</span>
                <span className="text-base font-bold font-mono text-[#203B3A]">{topic.baselineVolume}</span>
              </div>
              <div>
                <span className="text-[#829B8B] block text-[10px] uppercase font-semibold">Velocity Ratio</span>
                <span className="text-base font-bold font-mono text-[#C47F68]">+{topic.velocityMultiplier}x</span>
              </div>
              <div>
                <span className="text-[#829B8B] block text-[10px] uppercase font-semibold">Status</span>
                <span className="font-mono text-[#203B3A] font-semibold">{topic.isAnomaly ? 'Anomalous Velocity' : 'Nominal Baseline'}</span>
              </div>
            </div>

            {/* Anomaly Statistical Explanation */}
            <div className="text-xs text-[#303B3B]">
              <strong className="text-[#203B3A]">Statistical Trend Explanation: </strong>
              <span>{topic.anomalyReason}</span>
            </div>

            {/* Top Keywords & Trending Phrasing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#F0EBDD]/40 border border-[#DCE4DE] rounded-lg">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase tracking-wider block mb-1.5">
                  Top Associated Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {topic.topKeywords.map((kw, idx) => (
                    <span key={idx} className="font-mono text-xs bg-white text-[#203B3A] px-2 py-0.5 rounded border border-[#DCE4DE]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#F0EBDD]/40 border border-[#DCE4DE] rounded-lg">
                <span className="text-[10px] font-bold text-[#829B8B] uppercase tracking-wider block mb-1.5">
                  Observed Recurring Phrasing:
                </span>
                <ul className="space-y-1 text-xs text-[#303B3B] list-disc list-inside">
                  {topic.trendingPhrases.map((phrase, idx) => (
                    <li key={idx} className="italic text-[#203B3A]">
                      "{phrase}"
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
