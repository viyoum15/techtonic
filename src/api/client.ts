import {
  ContentRecord,
  DashboardSummary,
  AlertRecord,
  CoordinationCluster,
  EmergingTopicItem,
  DataSourceStatus,
  DetectionResult
} from '../types';

export const api = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch('/api/dashboard/summary');
    if (!res.ok) throw new Error('Failed to load dashboard summary');
    return res.json();
  },

  async getContent(filters?: {
    search?: string;
    category?: string;
    severity?: string;
    status?: string;
    platform?: string;
  }): Promise<ContentRecord[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.platform) params.append('platform', filters.platform);

    const res = await fetch(`/api/content?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load content records');
    return res.json();
  },

  async getContentById(id: string): Promise<ContentRecord> {
    const res = await fetch(`/api/content/${id}`);
    if (!res.ok) throw new Error(`Record ${id} not found`);
    return res.json();
  },

  async submitContent(payload: {
    publicText: string;
    publicUrl?: string;
    platform?: string;
    language?: string;
    topic?: string;
    mediaType?: string;
    region?: string;
    mediaMetadata?: any;
  }): Promise<ContentRecord> {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit content');
    }
    return res.json();
  },

  async importContentCsv(records: Array<{ text: string; url?: string; platform?: string; topic?: string }>): Promise<{
    success: boolean;
    message: string;
    recordsProcessed: number;
    recordsFlagged: number;
  }> {
    const res = await fetch('/api/content/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to import CSV');
    }
    return res.json();
  },

  async reviewContent(id: string, payload: {
    reviewStatus: string;
    reviewerNotes?: string;
    reviewerName?: string;
  }): Promise<{ success: boolean; record: ContentRecord }> {
    const res = await fetch(`/api/content/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async analyzeText(text: string): Promise<DetectionResult & { originalText: string }> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  },

  async getAlerts(): Promise<AlertRecord[]> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Failed to load alerts');
    return res.json();
  },

  async updateAlert(id: string, payload: {
    reviewStatus?: string;
    reviewerNotes?: string;
    assignedTo?: string;
  }): Promise<AlertRecord> {
    const res = await fetch(`/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return res.json();
  },

  async getTopics(): Promise<EmergingTopicItem[]> {
    const res = await fetch('/api/topics');
    if (!res.ok) throw new Error('Failed to load topics');
    return res.json();
  },

  async getCoordination(): Promise<CoordinationCluster[]> {
    const res = await fetch('/api/coordination');
    if (!res.ok) throw new Error('Failed to load coordination clusters');
    return res.json();
  },

  async getTrends(): Promise<{
    dailyVolume: Array<{ date: string; posts: number; flagged: number }>;
    categoryShare: Array<{ category: string; percentage: number }>;
  }> {
    const res = await fetch('/api/trends');
    if (!res.ok) throw new Error('Failed to load trends');
    return res.json();
  },

  async getReportsSummary(): Promise<any> {
    const res = await fetch('/api/reports/summary');
    if (!res.ok) throw new Error('Failed to load reports summary');
    return res.json();
  },

  async getSources(): Promise<DataSourceStatus[]> {
    const res = await fetch('/api/sources');
    if (!res.ok) throw new Error('Failed to load sources');
    return res.json();
  },

  async reseedDatabase(): Promise<any> {
    const res = await fetch('/api/reseed', { method: 'POST' });
    return res.json();
  },

  async analyzeMedia(payload: {
    url: string;
    scanMode?: 'standard' | 'early_ai_context';
    mediaType?: 'reel' | 'video' | 'photo';
    title?: string;
    contextText?: string;
    forceFresh?: boolean;
  }): Promise<import('../types').MediaForensicResult> {
    const query = payload.forceFresh ? '?forceFresh=true' : '';
    const res = await fetch(`/api/media/analyze${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Media forensic analysis failed');
    }
    return res.json();
  },

  async getRecentMediaSpread(): Promise<import('../types').MediaForensicResult[]> {
    const res = await fetch('/api/media/recent-spread');
    if (!res.ok) throw new Error('Failed to load recent media spread');
    return res.json();
  },

  async getSocialAccounts(): Promise<import('../types').SocialAccountConnection[]> {
    const res = await fetch('/api/social/accounts');
    if (!res.ok) throw new Error('Failed to load social accounts');
    return res.json();
  },

  async connectSocialAccount(payload: {
    platform: string;
    accountHandle: string;
    permissions: string[];
  }): Promise<import('../types').SocialAccountConnection> {
    const res = await fetch('/api/social/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to connect account');
    return res.json();
  },

  async revokeSocialAccount(id: string): Promise<{ success: boolean }> {
    const res = await fetch('/api/social/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Failed to revoke account permission');
    return res.json();
  },

  async getSocialThreats(): Promise<import('../types').SuspiciousMessageThreat[]> {
    const res = await fetch('/api/social/threats');
    if (!res.ok) throw new Error('Failed to load social threats');
    return res.json();
  },

  async analyzeSocialThreat(payload: {
    text: string;
    platform?: string;
    senderHandle?: string;
  }): Promise<import('../types').SuspiciousMessageThreat> {
    const res = await fetch('/api/social/threats/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze threat message');
    }
    return res.json();
  },

  async quarantineThreat(id: string): Promise<{ success: boolean; threat: import('../types').SuspiciousMessageThreat }> {
    const res = await fetch('/api/social/threats/quarantine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Failed to quarantine threat');
    return res.json();
  },

  async fileCybercrimeComplaint(payload: {
    threatId?: string;
    incidentType: string;
    targetPlatform: string;
    suspectIdentifier: string;
    incidentSummary: string;
    legalProvisions?: string[];
    evidenceText: string;
    reportedBy?: string;
  }): Promise<import('../types').CybercrimeComplaint> {
    const res = await fetch('/api/cybercrime/complain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to file cybercrime complaint');
    }
    return res.json();
  },

  async getCybercrimeComplaints(): Promise<import('../types').CybercrimeComplaint[]> {
    const res = await fetch('/api/cybercrime/complaints');
    if (!res.ok) throw new Error('Failed to load cybercrime complaints');
    return res.json();
  }
};
