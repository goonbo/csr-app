export type ReadinessTagId =
  | 'strong' | 'solid' | 'closer-look' | 'limited' | 'not-assessed';

export type Pipeline =
  | 'sourcing' | 'vetting' | 'proposed' | 'confirmed'
  | 'recruiting' | 'at-risk' | 'completed' | 'reported';

export type Cause =
  | 'Food Security' | 'Environment' | 'Housing'
  | 'Animal Welfare' | 'Youth Education' | 'Mental Health';

export type PillTone = 'neutral' | 'sage' | 'terracotta' | 'amber' | 'rose';

export interface AlternativeFormat {
  format: string;
  fit: 'Possible' | 'Worth considering' | 'Not this partner';
  reason: string;
}

export interface RecommendedFormat {
  choice: string;
  reason: string;
}

export interface Diligence {
  mission: string;
  financial: string;
  readinessReason: string;
  readinessTag: ReadinessTagId;       // moved from partner-level: a diligence outcome, not a static partner attribute
  recommendedFormat: RecommendedFormat;
  alternativesConsidered: AlternativeFormat[];
}

export interface Partner {
  id: string;
  name: string;
  cause: Cause;
  geo: string;
  readiness: number;       // legacy 1-5 score, kept for fallback
  readinessTag: ReadinessTagId;
  hasD: boolean;           // has diligence completed?
  lastEvent: string;       // ISO date
  health: 'thriving' | 'attention';
  champion: string | null;
  contact?: string;
  email?: string;
  phone?: string;
  minGroup?: number;
  maxGroup?: number;
  leadDays?: number;
  diligence?: Diligence;
}

export interface Diagnosis {
  cause: string;
  evidence: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AtRiskOption {
  label: string;
  detail: string;
  tone: 'sage' | 'amber' | 'rose';
}

export interface CheckInGapItem {
  name: string;
  dept: string;
  signal: string;
}

export interface RetroactiveHourItem {
  name: string;
  dept: string;
  requested: string;
  note: string;
}

export interface PhotoConsentItem {
  count: number;
  note: string;
}

export interface Reconciliation {
  checkInGap: CheckInGapItem[];
  retroactiveHours: RetroactiveHourItem[];
  photoConsent: PhotoConsentItem[];
}

export interface Event {
  id: string;
  partner: string | null;
  partnerId: string | null;
  title: string;
  date: string | null;
  time: string | null;
  location: string | null;
  capacity: number;
  registered: number;
  attended?: number;
  hours?: number;
  status: 'upcoming' | 'completed';
  pipeline: Pipeline;
  vto: boolean;
  cause: Cause;
  remoteFriendly: boolean;
  managerNudgeSent: boolean;
  outputs?: string;
  awaitingPartner?: string;
  awaitingApproval?: string;
  sourceNote?: string;
  confirmedNote?: string;
  diagnosis?: Diagnosis[];
  options?: AtRiskOption[];
  reconciliation?: Reconciliation;
}

export interface Employee {
  id: string;
  name: string;
  dept: string;
  hours: number;
}

export interface EmployeeSignals {
  topCauses: Cause[];
  preferredFormat: string;
  remoteShareInterested: number;
}

export interface DemandCause {
  cause: Cause;
  strength: number;
  trend: 'up' | 'steady' | 'emerging';
  sources: string[];
}

export interface DemandAsk {
  from: string;
  what: string;
  when: string;
}

export interface DemandMoment {
  label: string;
  when: string;
  note: string;
}

export interface DemandDrift {
  note: string;
  partner: string;
}

export interface DemandSignals {
  causes: DemandCause[];
  asks: DemandAsk[];
  moments: DemandMoment[];
  drift: DemandDrift;
  remoteInterest: number;
}

export interface ProgramReviewNumber {
  n: string;
  l: string;
  sub: string;
}

export interface ProgramReviewSection {
  heading: string;
  body: string;
}

export interface ProgramReviewTrend {
  label: string;
  detail: string;
}

export interface ProgramReviewRecommendation {
  title: string;
  body: string;
}

export interface ProgramReview {
  quarter: string;
  headline: string;
  lead: string;
  numbers: ProgramReviewNumber[];
  sections: ProgramReviewSection[];
  trends: ProgramReviewTrend[];
  recommendations: ProgramReviewRecommendation[];
}

export interface AIPlan {
  capacity: number;
  capacityReason: string;
  teamsPost: string;
  emailSubject: string;
  emailBody: string;
  managerNote: string;
  brief: string;
}

export interface AIRecapVoice {
  quote: string;
  who: string;
}

export interface AIRecapNext {
  title: string;
  body: string;
}

export interface AIRecap {
  whatHappened: string;
  businessValue: string;
  nonprofitValue: string;
  voices: AIRecapVoice[];
  whatsNext: AIRecapNext[];
}

export interface PipelineStage {
  id: Pipeline;
  label: string;
  short: string;
  tone: PillTone;
}

export interface ReadinessTagDef {
  label: string;
  tone: 'sage' | 'amber' | 'neutral';
  desc: string;
}
