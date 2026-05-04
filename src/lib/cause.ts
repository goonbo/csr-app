import { Coffee, Leaf, Home, Heart, Users, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Cause } from './types';

export interface CauseStyle {
  gradient: string;
  icon: LucideIcon;
}

// Cause colors — vivid, mutually-distinct, readable on both white (Operator)
// and mist (Blueprint). Each gradient pairs the cause's anchor hue with a
// slightly-shifted second stop for dimensional avatar treatments.
export const causeStyle = (cause: Cause | string): CauseStyle => {
  switch (cause) {
    case 'Food Security':   return { gradient: 'linear-gradient(135deg, #F97316, #EA580C)', icon: Coffee };
    case 'Environment':     return { gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: Leaf };
    case 'Housing':         return { gradient: 'linear-gradient(135deg, #A78BFA, #7C3AED)', icon: Home };
    case 'Animal Welfare':  return { gradient: 'linear-gradient(135deg, #F472B6, #DB2777)', icon: Heart };
    case 'Youth Education': return { gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', icon: Users };
    case 'Mental Health':   return { gradient: 'linear-gradient(135deg, #FBBF24, #D97706)', icon: Activity };
    default: return { gradient: 'linear-gradient(135deg, #94A3B8, #64748B)', icon: Heart };
  }
};
