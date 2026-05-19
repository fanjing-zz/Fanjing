import React from 'react';
import { c } from './theme2';

const M = ({ children, size = 11, color = c.textSec, upper = false, bold = false, style }: {
  children: React.ReactNode; size?: number; color?: string;
  upper?: boolean; bold?: boolean; style?: React.CSSProperties;
}) => (
  <span style={{
    fontFamily: c.mono, fontSize: size, color, fontWeight: bold ? 700 : 400,
    textTransform: upper ? 'uppercase' : undefined,
    letterSpacing: upper ? '0.08em' : '0.04em', lineHeight: 1.65, ...style,
  }}>{children}</span>
);

const Badge = ({ text, variant = 'active' }: {
  text: string; variant?: 'active' | 'muted' | 'warn';
}) => {
  const s = {
    active: { bg: 'rgba(0,177,162,0.07)', color: c.accent,   border: 'rgba(0,177,162,0.2)' },
    muted:  { bg: 'rgba(255,255,255,0.04)', color: c.textSec, border: c.border },
    warn:   { bg: 'rgba(255,184,0,0.1)', color: '#FFB800', border: 'rgba(255,184,0,0.25)' },
  }[variant];
  return (
    <span style={{
      fontFamily: c.mono, fontSize: 9, padding: '3px 8px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
    }}>
      {text}
    </span>
  );
};

const configRows = [
  { label: 'Pixel',        value: '88348206787787853 / PURCHASE',      badge: 'active' as const },
  { label: 'Daily budget', value: '$2 / ad set',                        badge: 'muted'  as const },
  { label: 'Targeting',    value: 'female - 25-60 - US / CA / GB / AU', badge: 'active' as const },
  { label: 'Status',       value: 'PAUSED',                             badge: 'active' as const },
  { label: 'Billing',      value: 'IMPRESSIONS',                        badge: 'active' as const },
  { label: 'Optimization', value: 'OFFSITE_CONVERSIONS',                badge: 'active' as const },
  { label: 'Bid strategy', value: 'LOWEST_COST_WITHOUT_CAP',            badge: 'active' as const },
  { label: 'Headline',     value: 'short drama name (locked)',           badge: 'active' as const },
];

export function CommDetailContent() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'auto', padding: '20px 24px 96px', gap: 18,
    }}>
      {/* Config table */}
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {configRows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', padding: '12px 20px',
            borderBottom: i < configRows.length - 1 ? `1px solid ${c.border}` : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(0,177,162,0.015)',
          }}>
            <span style={{ fontFamily: c.sans, fontSize: 12, color: c.textSec, width: 145, flexShrink: 0 }}>
              {row.label}
            </span>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, flex: 1, letterSpacing: '0.04em' }}>
              {row.value}
            </span>
            <Badge text="Active" variant={row.badge} />
          </div>
        ))}
      </div>

      {/* Launch button */}
      <div>
        <button style={{
          fontFamily: c.mono, fontSize: 11, padding: '10px 22px',
          background: c.accent, border: 'none', borderRadius: 6,
          color: c.bgBase, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
          boxShadow: `0 0 20px ${c.accentGlow}`,
        }}>
          Launch all 74 ads
        </button>
      </div>

      {/* User bubble */}
      <div style={{ alignSelf: 'flex-end', maxWidth: 340 }}>
        <div style={{ background: c.bgBubble, border: `1px solid ${c.border}`, borderRadius: 8, padding: '12px 16px' }}>
          <M size={11} color={c.textSec}>Are you still working?</M>
        </div>
      </div>

      {/* Agent recap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
          All done — nothing on my side. Recap:
        </M>
        {[
          'Pulled booklist + 5 asset bundles (74 files)',
          'Generated ~500-word English ad bodies per book',
          'Built 5 copies and 74 creatives',
          'Submitted 5 campaigns · 74 ad sets · 74 ads',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <M size={11} color={c.accentDim} style={{ flexShrink: 0 }}>{i + 1}.</M>
            <M size={11} color={c.textSec} upper>{item}</M>
          </div>
        ))}
      </div>
    </div>
  );
}
