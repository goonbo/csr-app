import type { Event } from '../types';

// Pipeline status model — the operator's actual workflow.
// sourcing → vetting → proposed → confirmed → recruiting → at-risk → completed → reported
export const EVENTS: Event[] = [
  // Recruiting: published, accepting signups, healthy fill rate
  { id: 'e1', partner: 'Greater Austin Food Bank', partnerId: 'p1', title: 'Spring Service Day — Food Sort & Repack', date: '2026-04-10', time: '9:00 AM – 12:00 PM', location: 'Austin Food Bank Warehouse', capacity: 60, registered: 47, status: 'upcoming', pipeline: 'recruiting', vto: true, cause: 'Food Security', remoteFriendly: false, managerNudgeSent: true },
  // At-risk: published but under-enrolled — multi-cause diagnosis (not single prescription)
  {
    id: 'e2', partner: 'TreeFolks', partnerId: 'p5',
    title: 'Earth Week Tree Planting',
    date: '2026-05-04', time: '8:00 AM – 11:00 AM', location: 'Roy G. Guerrero Park',
    capacity: 40, registered: 12,
    status: 'upcoming', pipeline: 'at-risk',
    vto: true, cause: 'Environment',
    remoteFriendly: false, managerNudgeSent: false,
    diagnosis: [
      { cause: 'Manager nudge not sent', evidence: 'Usually sent 14 days out. Comparable events with the nudge ran 60–75% fill at this point.', confidence: 'high' },
      { cause: 'Calendar conflict with product launch', evidence: 'Engineering all-hands moved to May 4. Engineering is your largest department by signup volume.', confidence: 'high' },
      { cause: 'Cause novelty', evidence: 'First environmental event of the year. Past first-time-cause events filled 18% slower on average.', confidence: 'medium' },
    ],
    options: [
      { label: 'Send manager nudge today', detail: 'Closes the most-likely cause. Cheapest move.', tone: 'sage' },
      { label: 'Reduce capacity to 25', detail: 'Honest right-sizing if the launch conflict is real. Tell TreeFolks early.', tone: 'amber' },
      { label: 'Move to May 11', detail: 'Costs partner trust if you ask twice. Use only if the launch is non-negotiable.', tone: 'rose' },
    ],
  },
  // Confirmed: locked in, comms scheduled but not yet recruiting publicly
  { id: 'e8', partner: 'Habitat for Humanity Greater Austin', partnerId: 'p2', title: 'Q2 Build Day — Frame & Roof', date: '2026-04-25', time: '8:00 AM – 3:00 PM', location: '4412 Govalle Ave', capacity: 20, registered: 0, status: 'upcoming', pipeline: 'confirmed', vto: true, cause: 'Housing', remoteFriendly: false, managerNudgeSent: false, confirmedNote: 'Comms scheduled to publish Apr 4. Site lead confirmed.' },
  // Proposed: confirmed by partner, still needs internal sign-off
  { id: 'e5', partner: 'Boys & Girls Club of the Austin Area', partnerId: 'p4', title: 'Summer Reading Mentor Day', date: '2026-06-15', time: '10:00 AM – 2:00 PM', location: 'Boys & Girls Club East Austin', capacity: 25, registered: 0, status: 'upcoming', pipeline: 'proposed', vto: true, cause: 'Youth Education', remoteFriendly: false, managerNudgeSent: false, awaitingApproval: 'CFO budget sign-off' },
  // Vetting: nonprofit reply pending
  { id: 'e6', partner: 'Austin Animal Center Foundation', partnerId: 'p3', title: 'Foster Family Welcome Drive', date: '2026-05-22', time: 'TBD', location: 'TBD', capacity: 0, registered: 0, status: 'upcoming', pipeline: 'vetting', vto: true, cause: 'Animal Welfare', remoteFriendly: false, managerNudgeSent: false, awaitingPartner: 'Riley Tanaka — last contact 6 days ago' },
  // Sourcing: idea stage, no partner yet
  { id: 'e7', partner: null, partnerId: null, title: 'Q3 mental-health awareness activation', date: null, time: null, location: null, capacity: 0, registered: 0, status: 'upcoming', pipeline: 'sourcing', vto: false, cause: 'Mental Health', remoteFriendly: true, managerNudgeSent: false, sourceNote: '3 partners shortlisted, awaiting AI fit scoring' },
  // Completed but not yet reported — recap pending. Has reconciliation queue items.
  {
    id: 'e3', partner: 'Greater Austin Food Bank', partnerId: 'p1',
    title: 'Winter Holiday Food Drive Pack',
    date: '2025-12-12', time: '1:00 PM – 4:00 PM', location: 'Austin Food Bank Warehouse',
    capacity: 50, registered: 50, attended: 44, hours: 132,
    status: 'completed', pipeline: 'completed',
    vto: true, cause: 'Food Security',
    remoteFriendly: false, managerNudgeSent: false,
    outputs: '6,200 lbs sorted; 480 holiday boxes packed',
    reconciliation: {
      checkInGap: [
        { name: 'Daniel Okonkwo', dept: 'Sales', signal: 'Signed up, no check-in scan' },
        { name: 'Aisha Patel', dept: 'Engineering', signal: 'Signed up, no check-in scan' },
        { name: 'Roman Ito', dept: 'People Ops', signal: 'Signed up, no check-in scan' },
      ],
      retroactiveHours: [
        { name: 'Mei Tanaka', dept: 'Marketing', requested: '3h', note: 'Submitted Dec 18 — was at the event but check-in scanner failed.' },
        { name: 'Carlos Reyes', dept: 'Engineering', requested: '4h', note: 'Submitted Jan 4 — claims he stayed an extra hour to help with breakdown.' },
      ],
      photoConsent: [
        { count: 6, note: '6 attendees not yet confirmed for photo use in the recap.' },
      ],
    },
  },
  // Fully reported
  { id: 'e4', partner: 'Habitat for Humanity Greater Austin', partnerId: 'p2', title: 'MLK Day of Service — Build Day', date: '2026-01-18', time: '8:00 AM – 3:00 PM', location: '4412 Govalle Ave', capacity: 20, registered: 20, attended: 18, hours: 126, status: 'completed', pipeline: 'reported', vto: true, cause: 'Housing', remoteFriendly: false, managerNudgeSent: false, outputs: 'Framing complete on home #247' },
];
