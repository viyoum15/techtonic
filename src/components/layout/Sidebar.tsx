import React from 'react';
import {
  LayoutDashboard,
  Search,
  AlertTriangle,
  ShieldAlert,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Film
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  openAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  openAlertsCount
}) => {
  const menuItems = [
    { id: 'overview', label: '1. Overview Dashboard', icon: LayoutDashboard },
    { id: 'media', label: '2. Reel & Post Detection', icon: Film },
    { id: 'content', label: '3. Text & Media Processing', icon: Search },
    { id: 'misinformation', label: '4. Misinformation Patterns', icon: AlertTriangle },
    { id: 'topics', label: '5. Emerging Topics & Activity', icon: TrendingUp },
    { id: 'cybercrime', label: '6. Cybercrime & App Threat Monitor', icon: ShieldAlert },
    { id: 'trends', label: '7. Trends & Geography', icon: MapPin },
    {
      id: 'alerts',
      label: '8. Alerts & Human Review',
      icon: CheckCircle2,
      badge: openAlertsCount > 0 ? openAlertsCount : undefined
    }
  ];

  return (
    <aside className="w-64 bg-[#F0EBDD] border-r border-[#DCE4DE] flex flex-col shrink-0 min-h-[calc(100vh-53px)] select-none">
      <div className="p-3.5 space-y-1 flex-1 overflow-y-auto">
        <div className="px-2.5 pb-2 text-[10px] font-bold tracking-wider uppercase text-[#303B3B]/70">
          Navigation Modules
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-[#203B3A] text-[#F0EBDD] shadow-xs'
                  : 'text-[#303B3B] hover:bg-[#DCE4DE]/60 hover:text-[#203B3A]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5C77A]' : 'text-[#829B8B]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#B96D70] text-white' : 'bg-[#B96D70] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* College Hackathon Project Card */}
      <div className="p-3.5 m-3 rounded-lg bg-[#DCE4DE]/80 border border-[#829B8B]/40 text-xs text-[#303B3B] space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#203B3A]">SocialWatch AI Engine</span>
          <span className="text-[10px] font-mono text-[#203B3A] bg-[#C5C77A]/50 px-1 py-0.2 rounded font-semibold">
            v2.0
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#303B3B]/80">
          Rule-based & NLP threat detection. MySQL schema ready for local Windows / VS Code deployment.
        </p>
      </div>
    </aside>
  );
};
