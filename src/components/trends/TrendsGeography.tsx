import React, { useState } from 'react';
import { DashboardSummary } from '../../types';
import {
  MapPin,
  Calendar,
  BarChart2,
  TrendingUp,
  PieChart,
  Info,
  Globe2,
  Layers
} from 'lucide-react';

interface TrendsGeographyProps {
  summary: DashboardSummary | null;
}

export const TrendsGeography: React.FC<TrendsGeographyProps> = ({ summary }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  if (!summary) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#DCE4DE]">
        <h1 className="text-xl font-bold tracking-tight text-[#203B3A]">
          Trends, Temporal Patterns & Geographic Distribution
        </h1>
        <p className="text-xs text-[#303B3B]/80 mt-1">
          Visualizes threat intensity over time, diurnal activity cycles, and macro-regional aggregations using non-sensitive public metadata.
        </p>
      </div>

      {/* Responsible Geographic Analysis Banner */}
      <div className="p-3.5 bg-[#F0EBDD]/60 border border-[#829B8B]/40 rounded-xl text-xs text-[#303B3B] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#203B3A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#203B3A]">Geographic Privacy & Metadata Policy:</strong> Locations represent broad macro-regions indicated in public post headers or synthetic demo sets. SocialPulse AI strictly refuses to infer precise coordinates from personal user details or geolocate individuals.
        </div>
      </div>

      {/* 2-Column Layout: Diurnal Hourly Cycle & Category Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Diurnal Activity Cycle */}
        <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="pb-2 border-b border-[#DCE4DE] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Diurnal Threat Activity Distribution (24h Clock)
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Peak posting windows for disinformation and automated spam campaigns
              </p>
            </div>
            <span className="text-xs font-mono text-[#829B8B]">UTC Aggregated</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-4 pb-2 items-end h-32 border-b border-[#DCE4DE]/50">
            {[12, 18, 25, 40, 65, 88, 92, 110, 85, 70, 55, 30].map((val, idx) => {
              const hourLabel = `${idx * 2}h`;
              const maxVal = 110;
              const heightPct = (val / maxVal) * 100;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 group">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#829B8B] group-hover:bg-[#203B3A] rounded-t-xs transition-colors"
                  />
                  <span className="text-[9px] font-mono text-[#303B3B]">{hourLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#303B3B]/70 pt-1">
            <span>Peak Velocity Window: 08:00 – 14:00 UTC</span>
            <span className="font-mono text-[11px]">Consistent with coordinated daytime blasts</span>
          </div>
        </div>

        {/* Category Share Breakdown */}
        <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="pb-2 border-b border-[#DCE4DE] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#203B3A]">
                Relative Risk Distribution
              </h2>
              <p className="text-xs text-[#303B3B]/70">
                Percentage volume of flagged incident types
              </p>
            </div>
            <span className="text-xs font-mono text-[#829B8B]">Current Week</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Misinformation & Panic Rumors', share: 38, color: '#C47F68' },
              { label: 'Phishing & Credential Harvest', share: 31, color: '#B96D70' },
              { label: 'Deceptive Grants & Subsidy Scams', share: 18, color: '#C5C77A' },
              { label: 'Emerging Civil Tensions', share: 13, color: '#203B3A' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#303B3B]">{item.label}</span>
                  <span className="font-mono font-bold text-[#203B3A]">{item.share}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#DCE4DE]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.share}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Activity Table (Macro Geographic Aggregation) */}
      <div className="bg-white border border-[#DCE4DE] rounded-xl p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-[#DCE4DE] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#203B3A] flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#829B8B]" />
              <span>Macro-Regional Aggregation Matrix</span>
            </h2>
            <p className="text-xs text-[#303B3B]/70">
              Aggregated across publicly declared non-sensitive location metadata and regional topic tags
            </p>
          </div>

          <span className="text-xs font-mono text-[#829B8B] bg-[#F0EBDD] px-2 py-0.5 rounded border border-[#829B8B]/30 font-semibold">
            Broad Regional Level
          </span>
        </div>

        <div className="border border-[#DCE4DE] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0EBDD]/60 border-b border-[#DCE4DE] text-[#203B3A] font-semibold">
              <tr>
                <th className="p-3">Designated Region</th>
                <th className="p-3">Country Tag</th>
                <th className="p-3 text-right">Monitored Posts</th>
                <th className="p-3 text-right">Flagged Incidents</th>
                <th className="p-3">Predominant Narrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4DE]/60">
              {summary.geographicActivity.map((geo, idx) => (
                <tr key={idx} className="hover:bg-[#F8F6F0]">
                  <td className="p-3 font-semibold text-[#203B3A] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#829B8B]" />
                    <span>{geo.region}</span>
                  </td>
                  <td className="p-3 font-mono text-[#829B8B]">{geo.country}</td>
                  <td className="p-3 text-right font-mono text-[#303B3B]">{geo.postCount}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#C47F68]">{geo.flaggedCount}</td>
                  <td className="p-3 text-[#303B3B]">{geo.topCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
