'use client';

import { use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Mail, Phone, Award, Sparkles } from 'lucide-react';
import { C } from '@/lib/tokens';
import { fmtDate } from '@/lib/format';
import { PageHeader } from '@/components/primitives/PageHeader';
import { Card } from '@/components/primitives/Card';
import { ViewSourcePill } from '@/components/primitives/ViewSourcePill';
import { NP_VOLUNTEERS } from '@/lib/seed/np-volunteers';
import { NP_PARTNER_BY_ID } from '@/lib/seed/np-corporate-partners';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VolunteerDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const v = NP_VOLUNTEERS.find(x => x.id === id);
  if (!v) notFound();

  const partner = v.sourcePartnerId ? NP_PARTNER_BY_ID(v.sourcePartnerId) : undefined;

  return (
    <div>
      <PageHeader
        back="Back to volunteers"
        onBack={() => router.push('/np/volunteers')}
        greeting={v.employer ? `${v.employer} · ${labelForSource(v.source)}` : labelForSource(v.source)}
        title={v.name}
      />

      {/* Identity row */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 24,
          alignItems: 'center',
        }}>
          <Avatar name={v.name} large />
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              flexWrap: 'wrap', marginBottom: 8,
            }}>
              {v.source === 'view-partner' && v.employer && (
                <ViewSourcePill partner={v.employer} />
              )}
              {v.source === 'imported' && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '2px 9px', borderRadius: 999,
                  color: C.muted, background: C.oat,
                  border: `1px solid ${C.border}`,
                }}>
                  Imported · joined {fmtDate(v.joinedAt, false)}
                </span>
              )}
              {v.source === 'direct' && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  padding: '2px 9px', borderRadius: 999,
                  color: C.muted, background: C.oat,
                  border: `1px solid ${C.border}`,
                }}>
                  Community direct · joined {fmtDate(v.joinedAt, false)}
                </span>
              )}
              <span style={{
                fontSize: 11, fontWeight: 600,
                padding: '2px 9px', borderRadius: 999,
                color: v.status === 'active' ? 'var(--accent-deep)' : C.muted,
                background: v.status === 'active' ? C.sageGlow : 'transparent',
                border: `1px solid ${v.status === 'active' ? C.sage : C.borderStrong}`,
              }}>
                {v.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 18, fontSize: 13, color: C.inkLight,
            }}>
              <a
                href={`mailto:${v.email}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: C.inkLight, textDecoration: 'none',
                }}
              >
                <Mail size={13} aria-hidden="true" /> {v.email}
              </a>
              {v.phone && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <Phone size={13} aria-hidden="true" /> {v.phone}
                </span>
              )}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                Joined {fmtDate(v.joinedAt, false)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Hours snapshot */}
          <Card style={{ padding: 24 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              <Stat label="Hours · all-time" value={v.totalHours.toLocaleString()} unit="hrs" />
              <Stat label="Events" value={v.eventsAttended.toString()} />
              <Stat label="Last active" value={fmtDate(v.lastActive, false)} small />
            </div>
            {partner && (
              <div style={{
                marginTop: 16, paddingTop: 16,
                borderTop: `1px solid ${C.border}`,
                fontSize: 12, color: C.muted, lineHeight: 1.55,
              }}>
                Source provenance — these hours flow in from{' '}
                <button
                  onClick={() => router.push(`/np/partners/${partner.id}`)}
                  className="view-btn"
                  style={{
                    color: 'var(--view-source-fg)', fontWeight: 600,
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: 0, fontFamily: 'inherit',
                    fontSize: 12,
                  }}
                >
                  {partner.name}&rsquo;s VIEW workspace
                </button>{' '}
                via the corporate partner&rsquo;s check-in scanner. Cross-checked against your reconciliation queue
                whenever a scan is missing.
              </div>
            )}
          </Card>

          {/* Hours timeline */}
          {v.history.length > 0 && (
            <Card style={{ padding: 24 }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: C.muted, margin: '0 0 16px',
              }}>
                Hours timeline
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {v.history.map(h => (
                  <div key={h.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '110px 1fr auto',
                    gap: 16,
                    paddingBottom: 14,
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <div style={{
                      fontSize: 12, color: C.muted,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {fmtDate(h.date, false)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                        {h.title}
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: 8, flexWrap: 'wrap',
                        fontSize: 12, color: C.muted,
                      }}>
                        {h.partner ?? 'Community event'}
                        {h.source === 'view-partner' && h.partner && (
                          <ViewSourcePill partner={h.partner} size="sm" hideIcon />
                        )}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13, fontWeight: 600,
                      color: C.ink, textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {h.hours} hrs
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card style={{ padding: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 16,
            }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: C.muted, margin: 0,
              }}>
                Internal notes
              </h2>
              <button className="view-btn" style={{
                fontSize: 12, color: 'var(--accent-deep)', fontWeight: 600,
                background: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', padding: 0,
              }}>
                + Add note
              </button>
            </div>
            {v.notes.length === 0 ? (
              <div style={{ fontSize: 13, color: C.muted, fontStyle: 'italic' }}>
                No notes yet. Add the next time you talk with them.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {v.notes.map(n => (
                  <div key={n.id} style={{
                    paddingLeft: 14,
                    borderLeft: `2px solid ${C.borderStrong}`,
                  }}>
                    <div style={{
                      fontSize: 11, color: C.muted,
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 4,
                    }}>
                      {fmtDate(n.date, false)} · {n.author}
                    </div>
                    <div style={{
                      fontSize: 13, color: C.ink,
                      lineHeight: 1.6,
                    }}>
                      {n.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right rail */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recognition */}
          <Card style={{ padding: 20 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.muted, margin: '0 0 14px',
            }}>
              Recognition earned
            </h3>
            {v.recognitions.length === 0 ? (
              <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>
                Approaching their first milestone.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {v.recognitions.map(r => (
                  <div key={r} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 'var(--radius)',
                    background: C.sageGlow,
                    border: `1px solid ${C.sage}`,
                  }}>
                    <Award size={13} color="var(--accent-deep)" strokeWidth={2.4} aria-hidden="true" />
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--accent-deep)',
                    }}>
                      {recognitionLabel(r)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Skills */}
          <Card style={{ padding: 20 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: C.muted, margin: '0 0 14px',
            }}>
              Skills
            </h3>
            {v.skills.length === 0 ? (
              <div style={{ fontSize: 12, color: C.muted, fontStyle: 'italic' }}>
                None recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {v.skills.map(s => (
                  <span key={s.label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 9px', borderRadius: 999,
                    fontSize: 11, fontWeight: 600,
                    color: s.source === 'view-partner' ? 'var(--view-source-fg)' : C.inkLight,
                    background: s.source === 'view-partner' ? 'var(--view-source-bg)' : C.oat,
                    border: `1px solid ${s.source === 'view-partner' ? 'var(--view-source)' : C.borderStrong}`,
                  }}>
                    {s.source === 'view-partner' && (
                      <Sparkles size={9} strokeWidth={2.4} color="var(--view-source)" aria-hidden="true" />
                    )}
                    {s.label}
                  </span>
                ))}
              </div>
            )}
            <div style={{
              marginTop: 12, fontSize: 11, color: C.muted,
              lineHeight: 1.5,
            }}>
              VIEW-sourced skills come from the corporate workspace&rsquo;s employee profile.
            </div>
          </Card>

          {/* Source provenance */}
          {partner && (
            <Card style={{ padding: 20 }}>
              <h3 style={{
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: C.muted, margin: '0 0 10px',
              }}>
                Source
              </h3>
              <button
                onClick={() => router.push(`/np/partners/${partner.id}`)}
                className="view-btn"
                style={{
                  display: 'block', width: '100%',
                  padding: 12, borderRadius: 'var(--radius)',
                  background: 'var(--view-source-bg)',
                  border: `1px solid var(--view-source)`,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: 'var(--view-source-fg)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  via VIEW
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                  {partner.name}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  {partner.industry}
                </div>
              </button>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const size = large ? 80 : 36;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, var(--accent), var(--accent-deep))`,
        color: C.paper, fontSize: large ? 28 : 12, fontWeight: 700,
        flexShrink: 0,
        letterSpacing: '-0.02em',
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function Stat({ label, value, unit, small = false }: { label: string; value: string; unit?: string; small?: boolean }) {
  return (
    <div>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: C.muted,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-h1), sans-serif',
        fontSize: small ? 18 : 28, fontWeight: 600,
        color: C.ink, letterSpacing: '-0.015em',
        fontVariantNumeric: 'tabular-nums',
        display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        {value}
        {unit && (
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12, fontWeight: 500, color: C.muted,
          }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

function labelForSource(s: string): string {
  if (s === 'view-partner') return 'via VIEW partner';
  if (s === 'imported')    return 'imported volunteer';
  return 'community volunteer';
}

function recognitionLabel(id: string): string {
  switch (id) {
    case '10-events': return '10 events';
    case '25-events': return '25 events';
    case '50-events': return '50 events';
    case 'first-skills-based': return 'First skills-based engagement';
    case 'spanish-speaker': return 'Spanish-speaker';
    case 'recurring-donor': return 'Recurring donor';
    default: return id;
  }
}
