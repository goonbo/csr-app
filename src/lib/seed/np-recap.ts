import type { NonprofitRecap } from '../types';

// Maria's nonprofit-side recap of the Winter Holiday Food Drive Pack
// (event e3 in the corporate seed). Matched 1:1 with the corporate-side
// recap so that the two-way flow is demonstrable side-by-side.
//
// The corporate-side recap framed it as: "44 attended, 132 hours,
// 6,200 lbs sorted, 480 holiday boxes packed." Sarah's audience is
// CloudMotion leadership.
//
// Maria's audience is different: her board, her grant funders, her
// staff, and the community. Same event, different framing — meals
// served, families reached, season covered. The asks at the bottom
// are the moments only the nonprofit knows, the kind of asks email
// threads tend to swallow.

export const NP_RECAPS: NonprofitRecap[] = [
  {
    eventId: 'e3',
    ourFraming:
      'Forty-four CloudMotion teammates joined our Tuesday distribution crew on December 12 for the holiday rush. ' +
      'In three hours, the line moved 6,200 pounds of food and packed 480 holiday boxes — enough to send 480 families ' +
      'into Christmas week with the whole meal taken care of: turkey, sides, pantry staples, a handwritten note. ' +
      'Two of the CloudMotion team came back the following Saturday for our community sort. Carlos stayed an hour ' +
      'past his shift to help our staff break down. This is the third year in a row CloudMotion has run the holiday ' +
      'drive with us; the operation gets faster each time, because their first-timers are now their leads.',
    outputs: [
      { metric: 'Holiday boxes packed',         value: '480' },
      { metric: 'Families served',               value: '480' },
      { metric: 'Meals on the table, estimate',  value: '~2,400' },
      { metric: 'Food sorted (lbs)',             value: '6,200' },
      { metric: 'Hours given',                   value: '132' },
      { metric: 'First-time volunteers',         value: '12 of 44' },
    ],
    voices: [
      {
        quote:
          'My partner and I have been on the receiving end of these boxes. Being on the other side this year — that\'s a thing I\'ll remember.',
        who: 'Marcus Lee · CloudMotion engineering',
      },
      {
        quote:
          'They had the line set up so well that I knew what I was doing inside of ten minutes. Coming back in March.',
        who: 'Aisha Patel · CloudMotion engineering',
      },
      {
        quote:
          'Connie and her crew on Tuesdays are the heartbeat of this place. CloudMotion fits because they show up the way the regulars do.',
        who: 'Maria Velasquez · Director of Volunteer & Corporate Engagement',
      },
    ],
    partnershipReflection:
      'CloudMotion is one of the four corporate partners we work with through VIEW, and they\'re also the most ' +
      'consistent corporate group on our calendar — three years, eleven events, 480 hours, $14,200 in matching ' +
      'donations year-to-date. The format mix has matured: 78% direct service, 18% skills-based (their inventory ' +
      'audit work in March saved our staff a day and a half a week), and a small grant on top. The relationship ' +
      'works because Sarah\'s team treats the cadence as ours to set — they ask before proposing, they confirm ' +
      'twelve days out, they bring the same crew back. That\'s rarer than it should be.',
    asks: [
      {
        type: 'skills',
        title: 'Inventory tooling — Phase 2',
        body:
          'The cold-storage tracker your team rebuilt in March has held up beautifully. We\'d love four more hours ' +
          'with Jenna or Carlos to extend the same logic to our dry-goods inventory. We can run that as a Friday ' +
          'afternoon over Zoom or a Saturday-morning add-on to a sort shift.',
      },
      {
        type: 'funding',
        title: 'Refrigeration upgrade — $14k gap',
        body:
          'Our walk-in cold-storage compressor is on borrowed time (one rebuild already this calendar year). ' +
          'Replacement quote is $34k installed; we have $20k budgeted from a state grant. Closing the $14k gap ' +
          'before September would let us schedule the install during our slowest week.',
      },
      {
        type: 'capacity',
        title: 'Mid-week morning shifts',
        body:
          'Our hardest-to-staff window is Tuesday and Wednesday mornings — that\'s when the largest distribution ' +
          'runs hit. If a small CloudMotion crew (six to eight) could do a quarterly mid-week morning, we\'d be ' +
          'able to commit to two more partner agencies that have been waiting on a regular intake window.',
      },
    ],
  },
];

export const NP_RECAP_BY_EVENT_ID = (eventId: string): NonprofitRecap | undefined =>
  NP_RECAPS.find(r => r.eventId === eventId);
