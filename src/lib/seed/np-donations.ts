import type { Donation, InKindDonation } from '../types';

// Cash donations and in-kind inventory through Q1+early Q2 2026.
// Mix of:
//   - Corporate matching donations triggered by VIEW partner events
//     (visually distinct via source: 'view-partner')
//   - Direct corporate gifts and grants from non-VIEW partners
//   - Individual donors — some are also volunteers, some donate-only
//
// In-kind tilts heavier toward Maverick Foods (the food bank's
// largest single donor) plus community drop-offs.

export const NP_CASH_DONATIONS: Donation[] = [

  // ----- Q2 (April) -----

  { id: 'd-q2-1', donorName: 'CloudMotion · Match Pool',     donorType: 'corporate', donorId: 'cp-cloudmotion',  amount: 4_700, date: '2026-04-12', designation: 'General fund',   source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', acknowledged: true,  recurring: false },
  { id: 'd-q2-2', donorName: 'Marcus Lee',                    donorType: 'individual', donorId: 'nv-marcus-lee',  amount: 250,   date: '2026-04-11', designation: 'General fund',   source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', acknowledged: true,  recurring: false },
  { id: 'd-q2-3', donorName: 'Carlos Reyes',                  donorType: 'individual', donorId: 'nv-carlos-reyes',amount: 100,   date: '2026-04-11', designation: 'Distribution',   source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', acknowledged: true,  recurring: false },
  { id: 'd-q2-4', donorName: 'Travis Energy Co-op',           donorType: 'corporate', donorId: 'cp-travisenergy', amount: 2_500, date: '2026-04-08', designation: 'General fund',   source: 'direct',  acknowledged: true,  recurring: false },
  { id: 'd-q2-5', donorName: 'Bramble Health · Match Pool',   donorType: 'corporate', donorId: 'cp-bramblehealth',amount: 980,   date: '2026-04-06', designation: 'General fund',   source: 'view-partner', sourcePartnerId: 'cp-bramblehealth', acknowledged: true,  recurring: false },
  { id: 'd-q2-6', donorName: 'Connie Albright',               donorType: 'individual', donorId: 'nv-connie-albright', amount: 50,    date: '2026-04-04', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },

  // ----- Q1 (Mar) -----

  { id: 'd-q1-1', donorName: 'Hill Country Bank · Q1 Match',  donorType: 'corporate', donorId: 'cp-hillcountrybank', amount: 6_000, date: '2026-03-31', designation: 'Multi-year matching grant', source: 'direct',  acknowledged: true, recurring: false },
  { id: 'd-q1-2', donorName: 'CloudMotion · Match Pool',      donorType: 'corporate', donorId: 'cp-cloudmotion',  amount: 3_400, date: '2026-03-29', designation: 'Distribution',   source: 'view-partner', sourcePartnerId: 'cp-cloudmotion',  acknowledged: true, recurring: false },
  { id: 'd-q1-3', donorName: 'Nest & Foundry · Q1 Match',     donorType: 'corporate', donorId: 'cp-nestfoundry',  amount: 1_800, date: '2026-03-30', designation: 'General fund',   source: 'view-partner', sourcePartnerId: 'cp-nestfoundry',  acknowledged: true, recurring: false },
  { id: 'd-q1-4', donorName: 'Bramble Health',                donorType: 'corporate', donorId: 'cp-bramblehealth',amount: 1_200, date: '2026-03-12', designation: 'General fund',   source: 'view-partner', sourcePartnerId: 'cp-bramblehealth',acknowledged: true, recurring: false },
  { id: 'd-q1-5', donorName: 'Beatrice Whitfield',            donorType: 'individual', donorId: 'nv-beatrice-whitfield', amount: 150, date: '2026-03-15', designation: 'Distribution', source: 'direct',  acknowledged: true, recurring: true },
  { id: 'd-q1-6', donorName: 'Marisol Tejeda',                donorType: 'individual', donorId: 'nv-marisol-tejeda', amount: 35,    date: '2026-03-15', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-7', donorName: 'Augusto Vega',                  donorType: 'individual', donorId: 'nv-augusto-vega', amount: 60,    date: '2026-03-15', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-8', donorName: 'Lillian Reeves',                donorType: 'individual', donorId: 'nv-lillian-reeves', amount: 25,    date: '2026-03-15', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-9', donorName: 'Cardinal Logistics',            donorType: 'corporate', donorId: 'cp-cardinal',     amount: 5_600, date: '2026-03-02', designation: 'Q1 grant',       source: 'view-partner', sourcePartnerId: 'cp-cardinal', acknowledged: true, recurring: false },
  { id: 'd-q1-10', donorName: 'Henry Atwood',                 donorType: 'individual', donorId: 'nv-henry-atwood', amount: 100, date: '2026-03-08', designation: 'General fund', source: 'direct', acknowledged: true, recurring: false },
  { id: 'd-q1-11', donorName: 'Travis Energy Co-op · Q1',     donorType: 'corporate', donorId: 'cp-travisenergy', amount: 4_000, date: '2026-02-28', designation: 'General fund', source: 'direct', acknowledged: true, recurring: false },

  // ----- Q1 (Feb) -----

  { id: 'd-q1-12', donorName: 'CloudMotion · Match Pool',     donorType: 'corporate', donorId: 'cp-cloudmotion',  amount: 6_100, date: '2026-02-15', designation: 'General fund',   source: 'view-partner', sourcePartnerId: 'cp-cloudmotion',  acknowledged: true, recurring: false },
  { id: 'd-q1-13', donorName: 'Mateo Vasquez',                donorType: 'individual', donorId: 'nv-mateo-vasquez', amount: 75,  date: '2026-02-12', designation: 'Distribution', source: 'direct', acknowledged: true, recurring: false },
  { id: 'd-q1-14', donorName: 'Connie Albright',              donorType: 'individual', donorId: 'nv-connie-albright', amount: 50, date: '2026-02-04', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-15', donorName: 'Marisol Tejeda',               donorType: 'individual', donorId: 'nv-marisol-tejeda', amount: 35, date: '2026-02-15', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-16', donorName: 'Royce Pemberton',              donorType: 'individual', donorId: 'nv-royce-pemberton-vol', amount: 200, date: '2026-02-14', designation: 'General fund', source: 'imported', acknowledged: true, recurring: false },

  // ----- Q1 (Jan) -----

  { id: 'd-q1-17', donorName: 'Hill Country Bank · Q1',       donorType: 'corporate', donorId: 'cp-hillcountrybank', amount: 6_000, date: '2026-01-15', designation: 'Multi-year matching grant', source: 'direct',  acknowledged: true, recurring: false },
  { id: 'd-q1-18', donorName: 'CloudMotion · Match Pool',     donorType: 'corporate', donorId: 'cp-cloudmotion',  amount: 0, date: '2026-01-31', designation: 'No qualifying events this month', source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', acknowledged: true, recurring: false },
  { id: 'd-q1-19', donorName: 'Augusto Vega',                 donorType: 'individual', donorId: 'nv-augusto-vega', amount: 60, date: '2026-01-15', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-20', donorName: 'Connie Albright',              donorType: 'individual', donorId: 'nv-connie-albright', amount: 50, date: '2026-01-04', designation: 'General fund', source: 'imported', acknowledged: true, recurring: true },
  { id: 'd-q1-21', donorName: 'Solomon Adekunle',             donorType: 'individual', donorId: 'nv-solomon-adekunle', amount: 100, date: '2026-01-22', designation: 'Distribution', source: 'imported', acknowledged: true, recurring: false },

  // ----- Late 2025 (kept on the rolling list — rolling 12 months) -----

  { id: 'd-2025-1', donorName: 'CloudMotion · Holiday Match', donorType: 'corporate', donorId: 'cp-cloudmotion',  amount: 8_400, date: '2025-12-15', designation: 'Holiday Drive',  source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', acknowledged: true, recurring: false },
  { id: 'd-2025-2', donorName: 'Hill Country Bank · Holiday', donorType: 'corporate', donorId: 'cp-hillcountrybank', amount: 4_500, date: '2025-12-10', designation: 'Holiday Drive', source: 'direct', acknowledged: true, recurring: false },
  { id: 'd-2025-3', donorName: 'Travis Energy Co-op · EOY',   donorType: 'corporate', donorId: 'cp-travisenergy', amount: 2_500, date: '2025-12-20', designation: 'General fund',   source: 'direct', acknowledged: true, recurring: false },
  { id: 'd-2025-4', donorName: 'Cardinal Logistics · EOY',    donorType: 'corporate', donorId: 'cp-cardinal',     amount: 0,    date: '2025-12-31', designation: 'No EOY giving recorded', source: 'view-partner', sourcePartnerId: 'cp-cardinal', acknowledged: false, recurring: false },
  { id: 'd-2025-5', donorName: 'Pilar Castellanos',           donorType: 'individual', donorId: 'nv-pilar-castellanos-vol', amount: 250, date: '2025-12-22', designation: 'General fund', source: 'direct', acknowledged: true, recurring: false },
];

export const NP_INKIND_DONATIONS: InKindDonation[] = [

  // ----- Recent (April) -----

  { id: 'ik-1', description: 'Refrigerated Q2 delivery — produce, dairy, eggs', donorName: 'Maverick Foods', donorType: 'corporate', donorId: 'cp-maverickfoods', estimatedValue: 8_400, receivedDate: '2026-04-15', status: 'distributed', source: 'direct', quantity: '1,200 lbs' },
  { id: 'ik-2', description: 'Holiday boxes — outputs from Spring Service Day',  donorName: 'CloudMotion volunteers', donorType: 'corporate', donorId: 'cp-cloudmotion', estimatedValue: 5_600, receivedDate: '2026-04-10', status: 'distributed', source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', quantity: '280 boxes' },
  { id: 'ik-3', description: 'Pet-friendly pantry contributions',                 donorName: 'Bramble Health', donorType: 'corporate', donorId: 'cp-bramblehealth', estimatedValue: 1_400, receivedDate: '2026-04-05', status: 'received', source: 'view-partner', sourcePartnerId: 'cp-bramblehealth', quantity: '12 boxes' },
  { id: 'ik-4', description: 'Canned goods drop-off',                              donorName: 'Henry Atwood', donorType: 'individual', donorId: 'nv-henry-atwood', estimatedValue: 85, receivedDate: '2026-04-02', status: 'distributed', source: 'direct', quantity: '24 cans' },

  // ----- Q1 (Mar) -----

  { id: 'ik-5', description: 'Holiday Drive output — boxes & sorted bins',         donorName: 'CloudMotion volunteers', donorType: 'corporate', donorId: 'cp-cloudmotion', estimatedValue: 14_200, receivedDate: '2025-12-12', status: 'distributed', source: 'view-partner', sourcePartnerId: 'cp-cloudmotion', quantity: '480 boxes; 6,200 lbs sorted' },
  { id: 'ik-6', description: 'Bulk produce delivery — Q1 quarterly run',           donorName: 'Maverick Foods', donorType: 'corporate', donorId: 'cp-maverickfoods', estimatedValue: 7_200, receivedDate: '2026-03-08', status: 'distributed', source: 'direct', quantity: '1,000 lbs' },
  { id: 'ik-7', description: 'Skills-based: redesigned welcome packets (digital)', donorName: 'Nest & Foundry', donorType: 'corporate', donorId: 'cp-nestfoundry', estimatedValue: 4_800, receivedDate: '2026-03-28', status: 'received', source: 'view-partner', sourcePartnerId: 'cp-nestfoundry', quantity: 'Toolkit + welcome packet set' },
  { id: 'ik-8', description: 'Sort shift output — bulk sort and repack',           donorName: 'Cardinal Logistics volunteers', donorType: 'corporate', donorId: 'cp-cardinal', estimatedValue: 1_500, receivedDate: '2025-11-14', status: 'distributed', source: 'view-partner', sourcePartnerId: 'cp-cardinal', quantity: '1,250 lbs sorted' },
  { id: 'ik-9', description: 'Pantry pasta drive',                                  donorName: 'Briana Hutchins', donorType: 'individual', donorId: 'nv-briana-hutchins', estimatedValue: 60, receivedDate: '2026-03-22', status: 'distributed', source: 'direct', quantity: '18 boxes' },
  { id: 'ik-10', description: 'Shelf-stable goods drop-off',                       donorName: 'Connie Albright', donorType: 'individual', donorId: 'nv-connie-albright', estimatedValue: 120, receivedDate: '2026-03-15', status: 'distributed', source: 'imported', quantity: '36 cans + 8 jars' },
  { id: 'ik-11', description: 'Diapers and infant supplies',                       donorName: 'Beatrice Whitfield', donorType: 'individual', donorId: 'nv-beatrice-whitfield', estimatedValue: 220, receivedDate: '2026-03-12', status: 'received', source: 'direct', quantity: '4 cases' },

  // ----- Q1 (Feb) -----

  { id: 'ik-12', description: 'Quarterly bulk run — produce & dairy',              donorName: 'Maverick Foods', donorType: 'corporate', donorId: 'cp-maverickfoods', estimatedValue: 6_400, receivedDate: '2026-02-12', status: 'distributed', source: 'direct', quantity: '900 lbs' },
  { id: 'ik-13', description: 'Sort shift — Saturday Sort Shift',                   donorName: 'Nest & Foundry volunteers', donorType: 'corporate', donorId: 'cp-nestfoundry', estimatedValue: 2_100, receivedDate: '2026-02-08', status: 'distributed', source: 'view-partner', sourcePartnerId: 'cp-nestfoundry', quantity: '1,900 lbs sorted' },
  { id: 'ik-14', description: 'Shelf-stable drop-off',                              donorName: 'Lillian Reeves', donorType: 'individual', donorId: 'nv-lillian-reeves', estimatedValue: 75, receivedDate: '2026-02-04', status: 'distributed', source: 'imported', quantity: '20 cans' },
  { id: 'ik-15', description: 'Bulk grain donation — wholesale partner',           donorName: 'Maverick Foods · special', donorType: 'corporate', donorId: 'cp-maverickfoods', estimatedValue: 3_400, receivedDate: '2026-02-25', status: 'valued', source: 'direct', quantity: '480 lbs grain' },

  // ----- Q1 (Jan) -----

  { id: 'ik-16', description: '200 turkeys — surplus from holiday inventory',      donorName: 'Maverick Foods · turkey surplus', donorType: 'corporate', donorId: 'cp-maverickfoods', estimatedValue: 4_800, receivedDate: '2026-01-08', status: 'distributed', source: 'direct', quantity: '200 turkeys' },
  { id: 'ik-17', description: 'Distribution Drive output',                          donorName: 'Bramble Health volunteers', donorType: 'corporate', donorId: 'cp-bramblehealth', estimatedValue: 1_700, receivedDate: '2025-10-18', status: 'distributed', source: 'view-partner', sourcePartnerId: 'cp-bramblehealth', quantity: '850 lbs sorted' },
  { id: 'ik-18', description: 'Branch Sort Day output',                             donorName: 'Hill Country Bank volunteers', donorType: 'corporate', donorId: 'cp-hillcountrybank', estimatedValue: 2_500, receivedDate: '2026-03-20', status: 'distributed', source: 'direct', quantity: '2,100 lbs sorted' },
  { id: 'ik-19', description: 'Canned and shelf-stable drop-off',                   donorName: 'Mateo Vasquez', donorType: 'individual', donorId: 'nv-mateo-vasquez', estimatedValue: 90, receivedDate: '2026-01-22', status: 'distributed', source: 'direct', quantity: '28 cans' },
  { id: 'ik-20', description: 'Pet food donation',                                  donorName: 'Ginger Whitley', donorType: 'individual', donorId: 'nv-ginger-whitley', estimatedValue: 120, receivedDate: '2026-01-15', status: 'distributed', source: 'direct', quantity: '6 bags pet food' },
];
