import React from 'react';
import { Plus, Bell, Shield, Database, Search, Film } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  openAlertsCount: number;
  onOpenIntake: () => void;
  onOpenImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  openAlertsCount,
  onOpenIntake,
  onOpenImport
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3 bg-[#203B3A] text-white border-b border-[#303B3B] shadow-xs">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#829B8B] text-[#203B3A] font-bold text-sm tracking-wider">
            SW
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[#F0EBDD] whitespace-nowrap block leading-tight">
              SocialWatch AI
            </span>
            <span className="text-[10px] text-[#DCE4DE] tracking-normal font-medium block">
              Public Discourse & Cybercrime Threat Intelligence
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Fast Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-[#DCE4DE]">
        <button
          onClick={() => onNavigate('overview')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap ${
            activeView === 'overview' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate('media')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeView === 'media' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          <Film className="w-3.5 h-3.5 text-[#C5C77A]" />
          <span>Reel & Post Detection</span>
        </button>
        <button
          onClick={() => onNavigate('content')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap ${
            activeView === 'content' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          Text & Media
        </button>
        <button
          onClick={() => onNavigate('misinformation')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap ${
            activeView === 'misinformation' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          Misinformation
        </button>
        <button
          onClick={() => onNavigate('topics')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap ${
            activeView === 'topics' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          Emerging Topics & Activity
        </button>
        <button
          onClick={() => onNavigate('cybercrime')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap ${
            activeView === 'cybercrime' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          Cybercrime
        </button>
        <button
          onClick={() => onNavigate('alerts')}
          className={`hover:text-[#F0EBDD] transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeView === 'alerts' ? 'text-[#F0EBDD] font-bold underline underline-offset-4 decoration-[#829B8B]' : ''
          }`}
        >
          <span>Alerts & Review</span>
          {openAlertsCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#B96D70] text-white">
              {openAlertsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: Actions + Demo Badge */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Demo Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#829B8B]/40 bg-[#303B3B]/60 text-[11px] text-[#F0EBDD] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5C77A]" />
          <span>Demo Mode (Synthetic Data)</span>
        </div>

        <button
          onClick={onOpenImport}
          className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-[#F0EBDD] bg-[#303B3B] hover:bg-[#303B3B]/80 rounded-lg transition-colors border border-[#829B8B]/30"
        >
          Import CSV
        </button>

        <button
          onClick={onOpenIntake}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#203B3A] bg-[#F0EBDD] hover:bg-white rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#203B3A]" />
          <span>Ingest Post</span>
        </button>
      </div>
    </header>
  );
};
