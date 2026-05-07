import type { ProgramReview } from '../types';

// Quarterly program review — narrative-style content for the Reports view.
export const PROGRAM_REVIEW: ProgramReview = {
  quarter: 'Q1 2026',
  headline: 'Steady cadence, sharper partner mix, one drift to address.',
  lead: 'Three events ran in Q1 — the MLK build day, a partner check-in cycle, and the holiday food drive carrying over from December. Participation held above the trailing average. The program ran efficiently, but two strategic signals deserve attention before Q2.',
  numbers: [
    { n: '258', l: 'approved hours', sub: '+18% vs Q1 2025' },
    { n: '62', l: 'unique volunteers', sub: '31% of workforce' },
    { n: '5', l: 'active partners', sub: '1 needs a hello' },
    { n: '$14.2k', l: 'employee giving', sub: 'Across 47 employees' },
  ],
  sections: [
    {
      heading: 'What worked',
      body: 'The MLK build day with Habitat ran 90% turnout against signups, the highest of the year, and engineering managers cited it in Q1 retros as a useful team-building moment. The food bank holiday drive included remote teammates for the first time — three flew in, all rated the experience well above average. The partner mix is healthy: four of five active partners are in the "thriving" health state.',
    },
    {
      heading: 'Where we drifted',
      body: 'Two patterns are worth naming honestly. First: the Animal Center has been quiet since November. Last contact six days ago is now closer to four months on the relationship clock. They will fall off the active list in Q2 without a check-in. Second: $8.4k of employee payroll giving has flowed to Maya\'s Family Center over the past 18 months, but we have never run a volunteer activation with them. That is a real demand signal we have not converted — and worth a conversation with their team about whether they actually want a volunteer event, or whether the giving relationship is the right shape on its own.',
    },
    {
      heading: 'Format mix this quarter',
      body: 'All Q1 activations were direct-service team days. That fit the partners and the season, but it leaves skills-based work unrepresented despite engineering and marketing both signaling interest in the Q1 survey. Worth at least one skills-based engagement in Q2 — Boys & Girls Club is the most natural opener, given Priya\'s relationship.',
    },
  ],
  trends: [
    { label: 'Mental Health', detail: 'Climbing from 18% → 31% YoY. No active partner yet. Worth scoping in Q2.' },
    { label: 'Environment', detail: 'Steady at 41%, but Earth Week has historically under-converted. The current at-risk event tells us why: late nudge + calendar conflict.' },
    { label: 'Remote employees', detail: '34% of the remote workforce expressed interest in volunteering this year. Holiday drive pilot was promising. Worth a structured 2026 program.' },
  ],
  recommendations: [
    { title: 'Call Animal Center this week', body: 'Even a 15-minute call protects the relationship. They were a strong partner in Q3.' },
    { title: 'Open a Maya\'s Family Center conversation', body: 'Ask what shape of partnership they actually want. Could be giving alone is right — but ask, do not assume.' },
    { title: 'Surface a mental-health partner by mid-Q2', body: 'Demand signal is clear. Three candidates already shortlisted.' },
    { title: 'Pilot one skills-based engagement in Q2', body: 'Boys & Girls Club is the most natural opener.' },
  ],
};
