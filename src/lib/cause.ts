import { Coffee, Leaf, Home, Heart, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Cause } from './types';
import { C } from './tokens';

export interface CauseStyle {
  gradient: string;
  icon: LucideIcon;
}

export const causeStyle = (cause: Cause | string): CauseStyle => {
  switch (cause) {
    case 'Food Security':   return { gradient: `linear-gradient(135deg, ${C.terracotta}, #B96B52)`, icon: Coffee };
    case 'Environment':     return { gradient: `linear-gradient(135deg, ${C.sage}, ${C.sageLight})`, icon: Leaf };
    case 'Housing':         return { gradient: `linear-gradient(135deg, #8C6B2E, #A87E2E)`, icon: Home };
    case 'Animal Welfare':  return { gradient: `linear-gradient(135deg, #6B5840, #8B7458)`, icon: Heart };
    case 'Youth Education': return { gradient: `linear-gradient(135deg, #5A5078, #786C9A)`, icon: Users };
    default: return { gradient: `linear-gradient(135deg, ${C.muted}, ${C.mutedLight})`, icon: Heart };
  }
};
