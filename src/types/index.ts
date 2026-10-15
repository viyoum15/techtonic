export type RiskCategory =
  | 'misinformation'
  | 'cybercrime_phishing'
  | 'cybercrime_scam'
  | 'coordinated_inauthentic'
  | 'emerging_tension'
  | 'benign_public';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type ReviewStatus = 'new' | 'under_review' | 'escalated' | 'reviewed' | 'resolved';
export type VerificationStatus =
  | 'Unverified'
  | 'Needs Review'
  | 'Supported by Available Evidence'
  | 'Disputed';

export interface DetectionResult {
  riskScore: number; // 0 - 100
  category: RiskCategory;
  severity: SeverityLevel;
  matchedIndicators: string[];
  explanation: string;
  recommendedAction: string;
  evidenceConfidence: number; // 0 - 100
  verificationStatus: VerificationStatus;
  indicators: {
    urgencyLanguage: boolean;
    credentialRequest: boolean;
    suspiciousLink: boolean;
    unsupportedCertainty: boolean;
    impersonationClues: boolean;
    nearDuplicateSimilarity: number; // 0.0 - 1.0
  };
}

export interface ContentRecord {
  id: string;
  publicText: string;
  publicUrl?: string;
  platform: 'X (Twitter)' | 'Reddit' | 'Telegram' | 'Facebook' | 'YouTube' | 'Web Forum';
  timestamp: string;
  language: string;
  topic: string;
  mediaType: 'text_only' | 'image_graphic' | 'video_clip' | 'external_link';
  mediaMetadata?: {
    filename?: string;
    filesize?: string;
    dimensions?: string;
    duration?: string;
    extractedOcr?: string;
    userSuppliedCaption?: string;
  };
  engagementMetadata?: {
    shares?: number;
    replies?: number;
    estimatedVelocityPerHour?: number;
  };
  region?: string;
  detection: DetectionResult;
  reviewStatus: ReviewStatus;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  dataProvenance: 'Synthetic Demo' | 'Manual Submission' | 'CSV Ingested' | 'Public RSS/API';
}

export interface CoordinationCluster {
  clusterId: string;
  topic: string;
  similarPostCount: number;
  timeWindowHours: number;
  commonKeywords: string[];
  similarityScore: number; // 0.0 - 1.0
  burstDetected: boolean;
  sharedUrls: string[];
  sampleRecords: Array<{
    id: string;
    platform: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
  flaggingReasons: string[];
  reviewStatus: ReviewStatus;
}

export interface EmergingTopicItem {
  id: string;
  topicName: string;
  currentVolume24h: number;
  baselineVolume: number;
  velocityMultiplier: number; // e.g. 8.4x
  isAnomaly: boolean;
  anomalyReason: string;
  topKeywords: string[];
  trendingPhrases: string[];
  category: RiskCategory;
  observedGrowthPercent: number;
}

export interface AlertRecord {
  id: string;
  title: string;
  category: RiskCategory;
  severity: SeverityLevel;
  riskScore: number;
  timestamp: string;
  relatedContentId: string;
  relatedContentSnippet: string;
  explanation: string;
  recommendedReviewAction: string;
  reviewStatus: ReviewStatus;
  reviewerNotes?: string;
  assignedTo?: string;
}

export interface DashboardSummary {
  totalPostsProcessed: number;
  itemsFlaggedForReview: number;
  potentialCybercrimeCount: number;
  emergingTopicsCount: number;
  highPriorityAlertsCount: number;
  dataFreshnessTimestamp: string;
  isDemoData: boolean;
  timeSeriesData: Array<{
    date: string;
    total: number;
    flagged: number;
    cybercrime: number;
    misinfo: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  sourceDistribution: Array<{
    platform: string;
    count: number;
  }>;
  topicVelocity: Array<{
    topic: string;
    velocity: string;
    trend: 'up' | 'stable';
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    item: string;
    time: string;
    user: string;
  }>;
  geographicActivity: Array<{
    region: string;
    country: string;
    postCount: number;
    flaggedCount: number;
    topCategory: string;
  }>;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  type: 'Public RSS' | 'Authorized Stream Adapter' | 'Synthetic Stream' | 'Manual Intake';
  status: 'active' | 'degraded' | 'standby';
  recordsProcessed24h: number;
  lastSync: string;
  rateLimitNote: string;
}

export interface KeyframeAnomaly {
  frameTime: string;
  frameIndex: number;
  anomalyDetected: boolean;
  anomalyDescription: string;
  anomalyRegion: string;
  confidenceScore: number;
  visualPlaceholderColor?: string;
}

export interface CopySpreadData {
  copiesDetectedRecentDays: number;
  daysTracked: number;
  dailySpreadTimeline: Array<{
    day: string;
    date: string;
    copiesCount: number;
    cumulativeCopies: number;
    platforms: string[];
  }>;
  firstDetectedTimestamp: string;
  earliestPlatformOrigin: string;
  crossPlatformBreakdown: Array<{
    platform: string;
    percentage: number;
    count: number;
    color: string;
  }>;
  similarityFingerprint: string;
}

export interface EarlyAiSocialContext {
  isEarlySpreadingAnomaly: boolean;
  botCoordinationIndex: number; // 0 - 100
  earlyAccountAgeCluster: string;
  sensationalistCaptionFlags: string[];
  predictedViralSaturationHours: number;
  earlyWarningRecommendation: string;
  engagementMismatchScore: number;
}

export interface MediaForensicResult {
  mediaId: string;
  mediaUrl: string;
  platform: 'Instagram Reel' | 'TikTok' | 'YouTube Shorts' | 'X Video' | 'Direct Upload' | 'Facebook Video';
  mediaType: 'reel' | 'video' | 'photo';
  title: string;
  isManipulatedOrSynthetic: boolean;
  deepfakeConfidenceScore: number; // 0 - 100
  manipulationType:
    | 'Deepfake Face Swap'
    | 'AI Video Generation (Sora / Gen-3)'
    | 'Audio Voice Clone & Lip Sync'
    | 'Out of Context Recycled Footage'
    | 'Authentic Verified Media';
  scanModeUsed: 'standard' | 'early_ai_context';
  spreadAnalysis: CopySpreadData;
  earlyAiSocialContext: EarlyAiSocialContext;
  visualKeyframes: KeyframeAnomaly[];
  audioForensic: {
    hasVoiceCloneMarkers: boolean;
    pitchDiscontinuityScore: number;
    backgroundReverberationMismatch: boolean;
    summary: string;
  };
  explainableVerdict: string;
  detectedAt: string;
}

export interface SocialAccountConnection {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'X (Twitter)' | 'Telegram' | 'Facebook/Meta';
  accountHandle: string;
  status: 'connected' | 'pending_auth' | 'disconnected';
  permissionsGranted: string[];
  connectedAt: string;
  lastSyncAt: string;
  threatsInterceptedCount: number;
  autoNotifyEnabled: boolean;
}

export interface SuspiciousMessageThreat {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'X (Twitter)' | 'Telegram' | 'Facebook/Meta';
  senderHandle: string;
  senderName: string;
  messageType: 'direct_message' | 'tagged_post' | 'reel_mention' | 'story_reply' | 'comment';
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  category:
    | 'blackmail_extortion'
    | 'phishing_credential_theft'
    | 'crypto_financial_fraud'
    | 'impersonation_defamation'
    | 'cyber_police_fraud';
  content: string;
  timestamp: string;
  detectedIndicators: string[];
  riskScore: number; // 0 - 100
  evidenceHash: string;
  status: 'suspicious' | 'quarantined' | 'complaint_filed' | 'resolved';
  psychologicalTriggers: string[];
  extractedEntities: {
    urls?: string[];
    cryptoWallets?: string[];
    phoneNumbers?: string[];
    demandedAmount?: string;
  };
  recommendedAction: string;
}

export interface CybercrimeComplaint {
  complaintId: string;
  acknowledgmentNumber: string;
  incidentType: string;
  targetPlatform: string;
  suspectIdentifier: string;
  incidentSummary: string;
  legalProvisions: string[];
  evidenceHash: string;
  submittedAt: string;
  status: 'SUBMITTED_TO_CYBER_CELL' | 'UNDER_POLICE_INQUIRY' | 'ACTION_TAKEN';
  assignedOfficerOrPortal: string;
  evidenceAnnexuresCount: number;
  reportedBy: string;
}
