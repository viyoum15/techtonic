import React, { useState, useEffect } from 'react';
import { api } from './api/client';
import {
  ContentRecord,
  DashboardSummary,
  AlertRecord,
  CoordinationCluster,
  EmergingTopicItem,
  DataSourceStatus
} from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ContentExplorer } from './components/content/ContentExplorer';
import { MisinformationAnalysis } from './components/misinformation/MisinformationAnalysis';
import { CybercrimeSignals } from './components/cybercrime/CybercrimeSignals';
import { CoordinationMonitor } from './components/coordination/CoordinationMonitor';
import { MediaForensicSuite } from './components/media/MediaForensicSuite';
import { EmergingTopics } from './components/topics/EmergingTopics';
import { TrendsGeography } from './components/trends/TrendsGeography';
import { AlertsReview } from './components/alerts/AlertsReview';
import { ReportsExport } from './components/reports/ReportsExport';
import { SettingsSchema } from './components/settings/SettingsSchema';
import { ManualIntakeModal } from './components/modals/ManualIntakeModal';
import { CsvImportModal } from './components/modals/CsvImportModal';
import { Search, Film, TrendingUp, Users } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [contentSubView, setContentSubView] = useState<'text' | 'multimedia'>('text');
  const [topicsSubView, setTopicsSubView] = useState<'topics' | 'unusual_activity'>('topics');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [clusters, setClusters] = useState<CoordinationCluster[]>([]);
  const [topics, setTopics] = useState<EmergingTopicItem[]>([]);
  const [sources, setSources] = useState<DataSourceStatus[]>([]);

  // Modals state
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeAlertIdContext, setActiveAlertIdContext] = useState<string | undefined>();
  const [activeContentIdContext, setActiveContentIdContext] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [sumRes, contentRes, alertsRes, clusterRes, topicsRes, srcRes] = await Promise.all([
        api.getDashboardSummary().catch(() => null),
        api.getContent().catch(() => []),
        api.getAlerts().catch(() => []),
        api.getCoordination().catch(() => []),
        api.getTopics().catch(() => []),
        api.getSources().catch(() => [])
      ]);

      if (sumRes) setSummary(sumRes);
      setRecords(contentRes);
      setAlerts(alertsRes);
      setClusters(clusterRes);
      setTopics(topicsRes);
      setSources(srcRes);
    } catch (e) {
      console.error('Failed to load initial dataset', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAlertsCount = alerts.filter(a => a.reviewStatus === 'new' || a.severity === 'critical').length;

  const handleNavigate = (view: string, contextId?: string) => {
    if (view === 'media') {
      setActiveView('content');
      setContentSubView('multimedia');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'coordination') {
      setActiveView('topics');
      setTopicsSubView('unusual_activity');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveView(view);
    if (view === 'alerts' && contextId) {
      setActiveAlertIdContext(contextId);
    }
    if (view === 'content') {
      if (contextId) {
        setActiveContentIdContext(contextId);
        setContentSubView('text');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordUpdated = (updated: ContentRecord) => {
    setRecords(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    api.getDashboardSummary().then(setSummary).catch(() => {});
    api.getAlerts().then(setAlerts).catch(() => {});
  };

  const handleAlertUpdated = (updated: AlertRecord) => {
    setAlerts(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };

  const handlePostIngested = (newRecord: ContentRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    api.getDashboardSummary().then(setSummary).catch(() => {});
    api.getAlerts().then(setAlerts).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#303B3B] flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        openAlertsCount={openAlertsCount}
        onOpenIntake={() => setIsIntakeOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Collapsible Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          openAlertsCount={openAlertsCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-xs font-medium text-[#829B8B] font-mono animate-pulse">
                Initializing SocialWatch AI Detection Engine...
              </div>
            </div>
          ) : (
            <>
              {/* 1. Overview Dashboard */}
              {activeView === 'overview' && (
                <OverviewDashboard
                  summary={summary}
                  alerts={alerts}
                  onNavigate={handleNavigate}
                  onRefresh={loadData}
                />
              )}

              {/* 2. Reel & Post Detection (Video & Photo Forensics, Viral Spread, Early AI Context) */}
              {activeView === 'media' && (
                <MediaForensicSuite />
              )}

              {/* 3. Process text and relevant multimedia metadata */}
              {activeView === 'content' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 p-1.5 bg-[#F0EBDD] rounded-xl border border-[#DCE4DE] w-fit shadow-xs">
                    <button
                      onClick={() => setContentSubView('text')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        contentSubView === 'text'
                          ? 'bg-[#203B3A] text-[#F0EBDD] shadow-xs'
                          : 'text-[#303B3B] hover:text-[#203B3A]'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Public Text Content & Metadata</span>
                    </button>
                    <button
                      onClick={() => setContentSubView('multimedia')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        contentSubView === 'multimedia'
                          ? 'bg-[#203B3A] text-[#F0EBDD] shadow-xs'
                          : 'text-[#303B3B] hover:text-[#203B3A]'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Multimedia & Video Forensics</span>
                    </button>
                  </div>

                  {contentSubView === 'text' ? (
                    <ContentExplorer
                      records={records}
                      onRecordUpdated={handleRecordUpdated}
                      onOpenIntake={() => setIsIntakeOpen(true)}
                      onOpenImport={() => setIsImportOpen(true)}
                    />
                  ) : (
                    <MediaForensicSuite />
                  )}
                </div>
              )}

              {/* 3. Identify misinformation-related patterns */}
              {activeView === 'misinformation' && (
                <MisinformationAnalysis />
              )}

              {/* 4. Detect emerging keywords, topics and unusual activity */}
              {activeView === 'topics' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 p-1.5 bg-[#F0EBDD] rounded-xl border border-[#DCE4DE] w-fit shadow-xs">
                    <button
                      onClick={() => setTopicsSubView('topics')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        topicsSubView === 'topics'
                          ? 'bg-[#203B3A] text-[#F0EBDD] shadow-xs'
                          : 'text-[#303B3B] hover:text-[#203B3A]'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Emerging Keywords & Topic Velocity</span>
                    </button>
                    <button
                      onClick={() => setTopicsSubView('unusual_activity')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        topicsSubView === 'unusual_activity'
                          ? 'bg-[#203B3A] text-[#F0EBDD] shadow-xs'
                          : 'text-[#303B3B] hover:text-[#203B3A]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Unusual & Coordinated Activity</span>
                    </button>
                  </div>

                  {topicsSubView === 'topics' ? (
                    <EmergingTopics topics={topics} />
                  ) : (
                    <CoordinationMonitor clusters={clusters} />
                  )}
                </div>
              )}

              {/* 5. Identify potential cybercrime indicators */}
              {activeView === 'cybercrime' && (
                <CybercrimeSignals />
              )}

              {/* 6. Provide trend and geographic/time-based visualization where data permits */}
              {activeView === 'trends' && (
                <TrendsGeography summary={summary} />
              )}

              {/* 7. Generate alerts for human review */}
              {activeView === 'alerts' && (
                <AlertsReview
                  alerts={alerts}
                  activeAlertId={activeAlertIdContext}
                  onAlertUpdated={handleAlertUpdated}
                  onNavigateToContent={cId => handleNavigate('content', cId)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <ManualIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onPostIngested={handlePostIngested}
      />

      <CsvImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportCompleted={loadData}
      />
    </div>
  );
}
