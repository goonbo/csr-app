import type { CorporatePartner } from '../types';

// Eight corporate partners across the food bank's relationship pool.
// Four are managed via VIEW (CloudMotion + 3 others); four are direct
// — handled the way Maria has always handled corporate partnerships,
// through email and shared docs.
//
// CloudMotion is the demo focus — it carries the active pending
// request, the richest history, and the deepest comm log. The others
// are seeded with enough detail to make the list view feel full and
// to give the partners detail page believable navigation targets.

export const NP_CORPORATE_PARTNERS: CorporatePartner[] = [

  // ----- VIEW-managed (4) -----

  {
    id: 'cp-cloudmotion',
    name: 'CloudMotion',
    industry: 'Cloud infrastructure · ~520 employees',
    contactName: 'Sarah Chen',
    contactEmail: 'sarah.chen@cloudmotion.com',
    source: 'view-partner',
    relationshipHealth: 'thriving',
    yearsActive: 3,
    eventsHostedYtd: 4,
    hoursHostedYtd: 312,
    cashDonatedYtd: 14_200,
    lastActivityAt: '2026-04-22',
    formatMix: { directService: 0.78, skillsBased: 0.18, grantsOnly: 0.04 },
    pendingRequest: {
      proposedTitle: 'Q3 Reading Buddies Kickoff',
      proposedDate: '2026-07-12',
      proposedTime: '9:00 AM – 12:00 PM',
      proposedCapacity: 60,
      cause: 'Food Security',
      vto: true,
      capacityFitReasoning:
        'CloudMotion has 47 confirmed signups for the Spring Service Day on April 10 (78% fill, 12 days out). ' +
        'Their last three Saturday-morning food bank events ran 88–94% attended. ' +
        'July 12 is a low-conflict date on their calendar — no all-hands or product launches scheduled. ' +
        'Recommend confirming for 60.',
      fromEventId: 'e1', // CloudMotion's signal pattern came from this event
    },
    history: [
      { id: 'h-cm-1', date: '2026-04-10', title: 'Spring Service Day — Food Sort & Repack', attended: 47, hours: 141, outputs: '3,800 lbs sorted; 280 boxes packed' },
      { id: 'h-cm-2', date: '2025-12-12', title: 'Winter Holiday Food Drive Pack', attended: 44, hours: 132, outputs: '6,200 lbs sorted; 480 holiday boxes' },
      { id: 'h-cm-3', date: '2025-09-20', title: 'Back-to-School Snack Pack Drive', attended: 38, hours: 114, outputs: '2,400 snack packs assembled' },
      { id: 'h-cm-4', date: '2025-06-14', title: 'Summer Service Saturday', attended: 41, hours: 123, outputs: '4,100 lbs distributed' },
      { id: 'h-cm-5', date: '2025-03-08', title: 'Q1 Skills-Based: Inventory Audit Help', attended: 6, hours: 32, outputs: 'Reorganized cold-storage tracking spreadsheet; 1.5 days saved per week' },
      { id: 'h-cm-6', date: '2024-12-10', title: 'Holiday Drive 2024', attended: 39, hours: 117, outputs: '5,800 lbs sorted; 410 boxes' },
    ],
    commLog: [
      { date: '2026-04-22', author: 'Sarah Chen', body: 'Following up on April 10 — wanted to confirm boxes-packed total for our quarterly impact report. Also exploring a Q3 ask, will send formal proposal this week.' },
      { date: '2026-04-11', author: 'Maria Velasquez', body: 'Yesterday went smoothly. 3 first-timers from your engineering team stayed past the shift to help with breakdown. The line setup we tested with you in March is now standard.' },
      { date: '2026-03-15', author: 'Sarah Chen', body: 'Confirmed: April 10, 60 spots, 9–12. Will send manager nudge on March 27 (12 days out, matches our internal cadence).' },
      { date: '2026-02-22', author: 'Maria Velasquez', body: 'Floated April 10 for the next sort shift. Good window before our summer slowdown. Capacity: 60 if you want to push, 50 is the safer commit.' },
      { date: '2025-12-13', author: 'Maria Velasquez', body: 'December 12 thank-you note + receipts on their way. Will send Mei the photo of the team that Carlos took.' },
    ],
    preferences: [
      'Saturday morning shifts (3-hour blocks)',
      'Direct service: sorting, packing, distribution',
      'Welcomes first-timers — engineering team has high first-time fraction',
      'Skills-based engagements available (inventory tooling, data viz)',
      'Photo consent confirmed for staff identifiable images on social',
    ],
  },

  {
    id: 'cp-nestfoundry',
    name: 'Nest & Foundry',
    industry: 'Brand and product design studio · ~80 employees',
    contactName: 'Aaliyah Brooks',
    contactEmail: 'aaliyah@nestfoundry.com',
    source: 'view-partner',
    relationshipHealth: 'steady',
    yearsActive: 2,
    eventsHostedYtd: 2,
    hoursHostedYtd: 76,
    cashDonatedYtd: 4_800,
    lastActivityAt: '2026-03-30',
    formatMix: { directService: 0.55, skillsBased: 0.45, grantsOnly: 0 },
    history: [
      { id: 'h-nf-1', date: '2026-03-28', title: 'Brand refresh consultation — partner toolkit', attended: 4, hours: 24, outputs: 'New donor-receipt template; refreshed volunteer welcome packet' },
      { id: 'h-nf-2', date: '2026-02-08', title: 'Saturday Sort Shift', attended: 18, hours: 52, outputs: '1,900 lbs sorted' },
      { id: 'h-nf-3', date: '2025-11-15', title: 'Holiday Sort Shift', attended: 15, hours: 45, outputs: '1,600 lbs sorted; 120 boxes' },
    ],
    commLog: [
      { date: '2026-03-30', author: 'Aaliyah Brooks', body: 'Toolkit files are in Drive. Let me know how the volunteer welcome packet lands with new sign-ups — we can iterate.' },
      { date: '2026-03-12', author: 'Maria Velasquez', body: 'Loved the design eyes on the toolkit — would not have known where to start. Three volunteers have already mentioned the welcome packet.' },
      { date: '2026-01-30', author: 'Aaliyah Brooks', body: 'Adding a March skills-based day to the calendar. Brand refresh on volunteer-facing materials, half-day, 4 designers.' },
    ],
    preferences: [
      'Mix of direct service and skills-based — values both',
      'Smaller groups (15–20) over large mobilizations',
      'Saturday mornings preferred',
    ],
  },

  {
    id: 'cp-bramblehealth',
    name: 'Bramble Health',
    industry: 'Health technology · ~140 employees',
    contactName: 'Jorge Restrepo',
    contactEmail: 'jorge.restrepo@bramble.health',
    source: 'view-partner',
    relationshipHealth: 'steady',
    yearsActive: 1,
    eventsHostedYtd: 2,
    hoursHostedYtd: 48,
    cashDonatedYtd: 3_200,
    lastActivityAt: '2026-04-05',
    formatMix: { directService: 0.85, skillsBased: 0.15, grantsOnly: 0 },
    history: [
      { id: 'h-bh-1', date: '2026-04-05', title: 'Spring Distribution Drive', attended: 14, hours: 42, outputs: '1,400 lbs distributed' },
      { id: 'h-bh-2', date: '2025-10-18', title: 'First-time partner shift', attended: 8, hours: 24, outputs: '850 lbs sorted' },
    ],
    commLog: [
      { date: '2026-04-05', author: 'Jorge Restrepo', body: 'Team had a great morning. Quick question on next quarter — do you ever do mid-week evening shifts? A few engineers asked.' },
      { date: '2026-03-21', author: 'Maria Velasquez', body: 'April 5 confirmed, 15 spots. Looking forward to having you back.' },
    ],
    preferences: [
      'Saturday morning preferred, but team has asked about weekday evenings',
      'Smaller groups (8–15)',
      'Engineering-heavy team — possible inventory tooling skills-based future',
    ],
  },

  {
    id: 'cp-cardinal',
    name: 'Cardinal Logistics',
    industry: 'Shipping and logistics · ~310 employees',
    contactName: 'Renée Aldridge',
    contactEmail: 'renee.aldridge@cardinallogistics.com',
    source: 'view-partner',
    relationshipHealth: 'at-risk',
    yearsActive: 4,
    eventsHostedYtd: 1,
    hoursHostedYtd: 36,
    cashDonatedYtd: 5_600,
    lastActivityAt: '2025-11-14',
    formatMix: { directService: 0.95, skillsBased: 0, grantsOnly: 0.05 },
    history: [
      { id: 'h-cl-1', date: '2025-11-14', title: 'Veterans Day Sort Shift', attended: 12, hours: 36, outputs: '1,250 lbs sorted' },
      { id: 'h-cl-2', date: '2024-12-08', title: 'Holiday Drive 2024', attended: 22, hours: 66, outputs: '2,800 lbs sorted; 200 boxes' },
      { id: 'h-cl-3', date: '2024-08-17', title: 'Back-to-School Drive', attended: 19, hours: 57, outputs: '1,500 snack packs' },
      { id: 'h-cl-4', date: '2024-04-13', title: 'Spring Service Day', attended: 24, hours: 72, outputs: '3,200 lbs sorted' },
    ],
    commLog: [
      { date: '2026-01-30', author: 'Maria Velasquez', body: 'Sent quarterly check-in. No reply yet.' },
      { date: '2025-11-15', author: 'Renée Aldridge', body: 'Yesterday was great. Will look at Q1 dates and circle back.' },
      { date: '2025-08-04', author: 'Maria Velasquez', body: 'Renée asked about their IT volunteer needs at the picnic — said the team has bandwidth. Worth a separate conversation.' },
    ],
    preferences: [
      'Large-group direct service (20+)',
      'Operations team has IT-skills volunteer interest — never followed up',
      'Multi-year partnership but cadence has slowed since mid-2025',
    ],
  },

  // ----- Direct (4) -----

  {
    id: 'cp-travisenergy',
    name: 'Travis Energy Co-op',
    industry: 'Member-owned utility cooperative',
    contactName: 'Eddie Boon-Choi',
    contactEmail: 'eboonchoi@travisenergy.coop',
    source: 'direct',
    relationshipHealth: 'steady',
    yearsActive: 6,
    eventsHostedYtd: 3,
    hoursHostedYtd: 84,
    cashDonatedYtd: 8_500,
    lastActivityAt: '2026-04-02',
    formatMix: { directService: 0.6, skillsBased: 0.1, grantsOnly: 0.3 },
    history: [
      { id: 'h-te-1', date: '2026-04-02', title: 'Spring Sort Shift', attended: 22, hours: 66, outputs: '2,400 lbs sorted' },
      { id: 'h-te-2', date: '2026-02-15', title: 'Member Drive — Bulk Sort', attended: 9, hours: 18, outputs: '720 lbs sorted' },
      { id: 'h-te-3', date: '2025-12-04', title: 'Co-op Holiday Drive', attended: 15, hours: 45, outputs: '1,800 lbs; 110 boxes' },
    ],
    commLog: [
      { date: '2026-04-03', author: 'Eddie Boon-Choi', body: 'Yesterday was steady. Putting together a member-mailer with the quarterly summary you sent.' },
      { date: '2026-03-18', author: 'Maria Velasquez', body: 'Year-end giving recap is yours when you need it for the member newsletter.' },
    ],
    preferences: [
      'Long-tenured direct relationship',
      'Mix of direct service and grants — Eddie is also a recurring volunteer',
      'Weekend shifts preferred',
    ],
  },

  {
    id: 'cp-hillcountrybank',
    name: 'Hill Country Bank',
    industry: 'Community bank',
    contactName: 'Royce Pemberton',
    contactEmail: 'rpemberton@hillcountrybank.com',
    source: 'direct',
    relationshipHealth: 'steady',
    yearsActive: 8,
    eventsHostedYtd: 2,
    hoursHostedYtd: 54,
    cashDonatedYtd: 12_000,
    lastActivityAt: '2026-03-20',
    formatMix: { directService: 0.4, skillsBased: 0, grantsOnly: 0.6 },
    history: [
      { id: 'h-hcb-1', date: '2026-03-20', title: 'Branch Sort Day', attended: 18, hours: 54, outputs: '2,100 lbs sorted' },
      { id: 'h-hcb-2', date: '2025-11-22', title: 'Holiday Branch Drive', attended: 21, hours: 63, outputs: '2,500 lbs; 180 boxes' },
    ],
    commLog: [
      { date: '2026-03-22', author: 'Royce Pemberton', body: 'Friday went well. Six people from three branches showed up. Sending you the matching-grant paperwork next week.' },
      { date: '2026-02-05', author: 'Maria Velasquez', body: 'Q1 grant agreement countersigned and back to your team. Thank you again for the multi-year commitment.' },
    ],
    preferences: [
      'Multi-year matching grant relationship',
      'Branch-by-branch volunteer organizing',
      'Two events per year — spring and holiday',
    ],
  },

  {
    id: 'cp-maverickfoods',
    name: 'Maverick Foods',
    industry: 'Local food distributor',
    contactName: 'Pilar Castellanos',
    contactEmail: 'pilar@maverickfoods.com',
    source: 'direct',
    relationshipHealth: 'thriving',
    yearsActive: 5,
    eventsHostedYtd: 1,
    hoursHostedYtd: 12,
    cashDonatedYtd: 0,
    lastActivityAt: '2026-04-15',
    formatMix: { directService: 0.2, skillsBased: 0, grantsOnly: 0.8 },
    history: [
      { id: 'h-mf-1', date: '2026-04-15', title: 'Quarterly Pickup + Sort Visit', attended: 4, hours: 12, outputs: '1,200 lbs delivered + sorted by Maverick team' },
    ],
    commLog: [
      { date: '2026-04-16', author: 'Pilar Castellanos', body: 'Refrigerated truck has space for the May 10 pickup. Confirming.' },
      { date: '2026-04-01', author: 'Maria Velasquez', body: 'Q1 in-kind valuation summary attached. Tax letter on its way.' },
    ],
    preferences: [
      'In-kind heavy — single largest in-kind donor',
      'Quarterly bulk deliveries (refrigerated and shelf-stable)',
      'Pilar handles logistics directly; very low-touch operationally',
    ],
  },

  {
    id: 'cp-pecanstreet',
    name: 'Pecan Street Press',
    industry: 'Print shop and small press',
    contactName: 'Hank Lieberman',
    contactEmail: 'hank@pecanstreetpress.com',
    source: 'direct',
    relationshipHealth: 'at-risk',
    yearsActive: 2,
    eventsHostedYtd: 0,
    hoursHostedYtd: 0,
    cashDonatedYtd: 0,
    lastActivityAt: '2025-08-30',
    formatMix: { directService: 1, skillsBased: 0, grantsOnly: 0 },
    history: [
      { id: 'h-ps-1', date: '2025-08-30', title: 'Summer Sort Shift', attended: 6, hours: 18, outputs: '600 lbs sorted' },
    ],
    commLog: [
      { date: '2025-09-04', author: 'Hank Lieberman', body: 'Slammed through Q4. Will circle back early next year on a holiday shift.' },
    ],
    preferences: [
      'Small team, low cadence',
      'Lapsed since August — worth a check-in before fall',
    ],
  },

];

export const NP_PARTNER_BY_ID = (id: string): CorporatePartner | undefined =>
  NP_CORPORATE_PARTNERS.find(p => p.id === id);
