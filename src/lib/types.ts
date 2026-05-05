// Workspaces — the outer concept that organizes which surface a user is in.
// Inside CloudMotion there's still an admin/employee role distinction
// (kept in TopNav as a sub-toggle), but the workspace is the outer frame.
export type Workspace =
  | 'cloudmotion-admin'
  | 'cloudmotion-employee'
  | 'food-bank-np';

// Where a record entered the system. Drives the ViewSourcePill treatment
// on nonprofit list views. 'view-partner' = came in via a VIEW corporate
// workspace; 'direct' = created in this nonprofit workspace; 'imported' =
// migrated from elsewhere (Salesforce, spreadsheets, etc.).
export type DataSource = 'view-partner' | 'direct' | 'imported';

// ============================================================
// Nonprofit-side data shapes
// ============================================================

export interface VolunteerSkill {
  label: string;
  source: DataSource;
}

export interface VolunteerNote {
  id: string;
  date: string;
  author: string;
  body: string;
}

export interface VolunteerEvent {
  id: string;          // links to Event when applicable
  date: string;
  title: string;
  partner: string | null; // corporate partner name (null for community-direct events)
  hours: number;
  source: DataSource;     // VIEW-confirmed via corporate scanner vs. logged here
}

export interface Volunteer {
  id: string;
  name: string;
  employer: string | null;       // null for community volunteers
  email: string;
  phone?: string;
  totalHours: number;
  eventsAttended: number;
  lastActive: string;            // ISO date
  source: DataSource;
  sourcePartnerId?: string;      // CorporatePartner.id when source === 'view-partner'
  status: 'active' | 'inactive';
  recognitions: RecognitionId[];
  skills: VolunteerSkill[];
  notes: VolunteerNote[];
  history: VolunteerEvent[];
  joinedAt: string;
}

export type RecognitionId =
  | '10-events' | '25-events' | '50-events'
  | 'first-skills-based' | 'spanish-speaker' | 'recurring-donor';

export interface PartnerEvent {
  id: string;
  date: string;
  title: string;
  attended: number;
  hours: number;
  outputs: string;
}

export interface CommLogEntry {
  date: string;
  author: string;
  body: string;
}

export interface PendingRequest {
  proposedTitle: string;
  proposedDate: string;
  proposedTime: string;
  proposedCapacity: number;
  capacityFitReasoning: string;  // shown to nonprofit, comes from VIEW
  cause: Cause;
  vto: boolean;
  fromEventId?: string;          // links to existing Event when this is a real proposal
}

export interface CorporatePartner {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  source: DataSource;
  relationshipHealth: 'thriving' | 'steady' | 'at-risk';
  yearsActive: number;
  eventsHostedYtd: number;
  hoursHostedYtd: number;
  cashDonatedYtd: number;
  lastActivityAt: string;
  formatMix: { directService: number; skillsBased: number; grantsOnly: number };
  pendingRequest?: PendingRequest;
  history: PartnerEvent[];
  commLog: CommLogEntry[];
  preferences: string[];
}

export interface Donation {
  id: string;
  donorName: string;
  donorType: 'individual' | 'corporate';
  donorId?: string;              // links to Volunteer.id or CorporatePartner.id
  amount: number;
  date: string;
  designation: string;
  source: DataSource;
  sourcePartnerId?: string;      // for VIEW corporate matching donations
  acknowledged: boolean;
  recurring: boolean;
}

export interface InKindDonation {
  id: string;
  description: string;
  donorName: string;
  donorType: 'individual' | 'corporate';
  donorId?: string;
  estimatedValue: number;
  receivedDate: string;
  status: 'received' | 'valued' | 'distributed';
  source: DataSource;
  sourcePartnerId?: string;
  quantity?: string;
}

export interface NonprofitOutput {
  metric: string;
  value: string;
}

export interface NonprofitVoice {
  quote: string;
  who: string;
}

export interface NonprofitAsk {
  type: 'skills' | 'funding' | 'capacity';
  title: string;
  body: string;
}

export interface NonprofitRecap {
  eventId: string;               // links to existing Event.id
  ourFraming: string;
  outputs: NonprofitOutput[];
  voices: NonprofitVoice[];
  partnershipReflection: string;
  asks: NonprofitAsk[];
}

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
