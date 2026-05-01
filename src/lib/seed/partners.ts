import type { Partner } from '../types';

export const PARTNERS: Partner[] = [
  {
    id: 'p1', name: 'Greater Austin Food Bank', cause: 'Food Security',
    geo: 'Central Texas', readiness: 5, readinessTag: 'strong', hasD: true, lastEvent: '2026-02-14',
    health: 'thriving', champion: 'Sarah Chen',
    contact: 'Maria Velasquez', email: 'mvelasquez@austinfoodbank.org', phone: '(512) 555-0142',
    minGroup: 10, maxGroup: 80, leadDays: 21,
    diligence: {
      mission: 'Provides emergency food assistance to 21 counties in Central Texas, distributing approximately 47 million pounds of food annually through 250+ partner agencies.',
      financial: 'Strong. 94¢ of every dollar to programs. Three-year revenue trend stable. No governance flags.',
      readinessReason: 'Long-running corporate volunteer infrastructure with named coordinator, dedicated training space, and shift-based work that scales cleanly from 10 to 80 people. They host 200+ corporate groups annually.',
      readinessTag: 'strong',
      recommendedFormat: {
        choice: 'Direct service event',
        reason: 'The work converts directly to community output. Their warehouse setup is built for groups your size, and the supervision ratio is dialed in.',
      },
      alternativesConsidered: [
        {
          format: 'Skills-based engagement',
          fit: 'Possible',
          reason: 'IT and marketing teams could help with their inventory system or annual report. Smaller scope (3–5 specialists, multi-week), so not a substitute for a team-day moment — a complement.',
        },
        {
          format: 'Unrestricted grant only',
          fit: 'Not this partner',
          reason: 'Maria has been clear that volunteer hours are part of how the food bank actually moves food during peak seasons. They want both — a grant alone leaves real work on the floor.',
        },
        {
          format: 'No activation this quarter',
          fit: 'Worth considering',
          reason: 'If your team is capacity-strapped, the food bank is one of the few partners where postponing one quarter does not damage the relationship — they have a deep bench.',
        },
      ],
    },
  },
  {
    id: 'p2', name: 'Habitat for Humanity Greater Austin', cause: 'Housing',
    geo: 'Travis & Williamson Counties', readiness: 4, readinessTag: 'solid',
    hasD: true, lastEvent: '2026-01-18', health: 'thriving', champion: 'Marcus Lee',
    contact: 'Will Patterson', email: 'wpatterson@habitatatx.org', phone: '(512) 555-0218',
    minGroup: 8, maxGroup: 25, leadDays: 30,
    diligence: {
      mission: 'Builds and renovates affordable homes alongside low-income families in Travis and Williamson Counties. 247 homes built since 1985, serving over 1,100 family members through homeownership.',
      financial: 'Solid. 87¢ of every dollar to programs. Stable revenue of $13–15M annually. No governance flags. ReStore retail revenue covers a meaningful share of overhead.',
      readinessReason: 'Build Days are turnkey for groups of 8–25. Site supervisors run safety briefings and assign roles. 30-day lead time for active build sites, longer if dedicating a sponsored home.',
      readinessTag: 'solid',
      recommendedFormat: {
        choice: 'Build Day',
        reason: 'Build Days produce visible, measurable output (framing, roofing, drywall) and team members work side-by-side with future homeowners. High emotional payoff.',
      },
      alternativesConsidered: [
        {
          format: 'Home sponsorship',
          fit: 'Worth considering',
          reason: 'Named sponsorship of a single home runs $35–60k. High visibility, deep impact, but lower per-employee engagement than a build day.',
        },
        {
          format: 'Skills-based engagement',
          fit: 'Possible',
          reason: 'Architecture and engineering teams could review site plans or contribute to ReStore inventory systems. Smaller scope, multi-week.',
        },
      ],
    },
  },
  {
    id: 'p3', name: 'Austin Animal Center Foundation', cause: 'Animal Welfare',
    geo: 'Austin Metro', readiness: 3, readinessTag: 'closer-look',
    hasD: false, lastEvent: '2025-11-08', health: 'attention', champion: null,
    contact: 'Riley Tanaka', email: 'rtanaka@austinanimals.org', phone: '(512) 555-0411',
    minGroup: 5, maxGroup: 15, leadDays: 14,
  },
  {
    id: 'p4', name: 'Boys & Girls Club of the Austin Area', cause: 'Youth Education',
    geo: 'Austin Metro', readiness: 4, readinessTag: 'solid',
    hasD: true, lastEvent: '2025-12-05', health: 'thriving', champion: 'Priya Raman',
    contact: 'Jamal Washington', email: 'jwashington@bgcaustin.org', phone: '(512) 555-0182',
    minGroup: 10, maxGroup: 30, leadDays: 21,
    diligence: {
      mission: 'Serves 1,200+ Austin-area youth annually with after-school programming, academic support, and mentorship across 4 club sites in East and South Austin.',
      financial: 'Solid. 81¢ of every dollar to programs. Three-year stable revenue at $4.5M. Recent capacity grant from the Dell Foundation funding two new program staff.',
      readinessReason: 'Best for groups of 10–30. Background checks required for any direct contact with youth (BGC handles processing, 14-day turnaround). Mentorship roles work best as a multi-session commitment, but one-day events are also feasible.',
      readinessTag: 'solid',
      recommendedFormat: {
        choice: 'Direct service event',
        reason: 'A one-day club takeover with stations (reading buddies, board games, art project, mini college fair) lets every team member have a meaningful interaction. Background checks handled in advance.',
      },
      alternativesConsidered: [
        {
          format: 'Skills-based mentoring',
          fit: 'Possible',
          reason: 'Engineers as math tutors, marketers as career-day speakers. Higher commitment (8-week sessions), high impact on club outcomes.',
        },
        {
          format: 'College fair sponsorship',
          fit: 'Worth considering',
          reason: 'Annual senior college fair, $5–20k booth. Reaches 200+ college-bound students from underrepresented backgrounds.',
        },
      ],
    },
  },
  {
    id: 'p5', name: 'TreeFolks', cause: 'Environment',
    geo: 'Central Texas', readiness: 5, readinessTag: 'strong',
    hasD: false, lastEvent: '2025-10-19', health: 'thriving', champion: 'Sarah Chen',
    contact: 'Aiyana Park', email: 'apark@treefolks.org', phone: '(512) 555-0904',
    minGroup: 15, maxGroup: 50, leadDays: 14,
  },
];
