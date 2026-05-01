import type { Pipeline, PipelineStage, ReadinessTagId, ReadinessTagDef } from '../types';

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'sourcing',   label: 'Sourcing',   short: 'Sourcing',   tone: 'neutral' },
  { id: 'vetting',    label: 'Vetting',    short: 'Vetting',    tone: 'amber' },
  { id: 'proposed',   label: 'Proposed',   short: 'Proposed',   tone: 'amber' },
  { id: 'confirmed',  label: 'Confirmed',  short: 'Confirmed',  tone: 'sage' },
  { id: 'recruiting', label: 'Recruiting', short: 'Recruiting', tone: 'sage' },
  { id: 'at-risk',    label: 'At risk',    short: 'At risk',    tone: 'rose' },
  { id: 'completed',  label: 'Completed',  short: 'Completed',  tone: 'neutral' },
  { id: 'reported',   label: 'Reported',   short: 'Reported',   tone: 'neutral' },
];

export const pipelineConfig = (id: Pipeline | string): PipelineStage =>
  PIPELINE_STAGES.find(s => s.id === id) ?? PIPELINE_STAGES[0];

// Qualitative readiness — replaces the v3 5-dot numeric rating.
// Public diligence cannot quantify operational readiness; the AI surfaces a
// calibrated qualitative judgment with reasoning, not a precise score.
export const READINESS_TAGS: Record<ReadinessTagId, ReadinessTagDef> = {
  'strong':       { label: 'Strong',                tone: 'sage',    desc: 'Capacity, named lead, repeat history' },
  'solid':        { label: 'Solid',                 tone: 'sage',    desc: 'Workable for your typical group size' },
  'closer-look':  { label: 'Worth a closer look',   tone: 'amber',   desc: 'Workable but verify capacity firsthand' },
  'limited':      { label: 'Limited evidence',      tone: 'amber',   desc: 'Public signals only — needs a call' },
  'not-assessed': { label: 'Not assessed',          tone: 'neutral', desc: 'Run AI diligence to triage' },
};

export const tagFromScore = (score: number | null | undefined): ReadinessTagId => {
  if (score == null) return 'not-assessed';
  if (score >= 5) return 'strong';
  if (score >= 4) return 'solid';
  if (score >= 3) return 'closer-look';
  return 'limited';
};
