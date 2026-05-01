import type { DemandSignals } from '../types';

// Demand signals — what your people are signaling, before you plan.
// This is the operator workflow's actual entry point (per research).
export const DEMAND_SIGNALS: DemandSignals = {
  causes: [
    {
      cause: 'Food Security',
      strength: 68,
      trend: 'up',
      sources: [
        'Q1 survey: 68% flagged personally meaningful',
        'Repeat giving: $14.2k from 47 employees in Q1',
        'Last food bank event filled in 6 days',
      ],
    },
    {
      cause: 'Environment',
      strength: 41,
      trend: 'steady',
      sources: [
        'Q1 survey: 41% flagged interest',
        'ERG: Green Crew has 23 active members',
        'Earth Week pulse: high intent, low conversion in past',
      ],
    },
    {
      cause: 'Mental Health',
      strength: 31,
      trend: 'emerging',
      sources: [
        'Q1 survey: jumped from 18% to 31% YoY',
        'Two ERG asks pending',
        'No active partner yet',
      ],
    },
  ],
  asks: [
    { from: 'Green Crew ERG', what: 'Park cleanup, family-friendly', when: 'pending 11 days' },
    { from: 'Engineering AMA group', what: 'Skills-based: tutoring or refugee tech support', when: 'pending 4 days' },
  ],
  moments: [
    { label: 'Earth Week', when: 'Apr 21–25', note: 'Surface 1 environmental opp by Apr 7' },
    { label: 'Q2 all-hands', when: 'May 8', note: 'CEO wants 1 service moment to anchor' },
  ],
  drift: {
    note: '$8.4k went to Maya\'s Family Center via payroll giving over 18 months — but no volunteer activation. Worth a conversation.',
    partner: 'Maya\'s Family Center',
  },
  remoteInterest: 0.34,
};
