import React from 'react';
import { t } from './theme';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/NodeCard';

function Mono({
  children, size = 11, color = t.textSecondary, style,
}: {
  children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties;
}) {
  return (
    <span style={{ fontFamily: t.mono, fontSize: size, color, letterSpacing: '0.06em', ...style }}>
      {children}
    </span>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: t.mono, fontSize: 10, color: t.textSecondary,
      textTransform: 'uppercase', letterSpacing: '0.12em',
    }}>
      {children}
    </span>
  );
}
function StatusBadge({ text, variant = 'muted' }: { text: string; variant?: 'muted' | 'danger' | 'accent' | 'warn' }) {
  const colors = {
    muted:   { bg: 'rgba(255,255,255,0.05)', color: t.textSecondary },
    danger:  { bg: 'rgba(255,45,120,0.15)',  color: t.danger },
    accent:  { bg: t.accentGlow,             color: t.accent },
    warn:    { bg: 'rgba(255,184,0,0.15)',   color: t.warn },
  }[variant];
  return (
    <span style={{
      fontFamily: t.mono, fontSize: 9, padding: '3px 8px',
      background: colors.bg, color: colors.color,
      borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase',
      border: `1px solid ${colors.color}20`,
    }}>
      {text}
    </span>
  );
}

// ── Infrastructure Log Table ──────────────────────────────────────────────────
const logRows = [
  { id: 'E-485-3043', date: '4-88-3043', name: 'Static Disturbance',  value: '41,880',  dur: '200',  status: 'danger' as const },
  { id: 'E-486-3019', date: '4-86-3019', name: 'Data Bloat Store',   value: '-9,380',  dur: '640',  status: 'warn'   as const },
  { id: 'E-486-3020', date: '4-86-3020', name: 'Suggestions',        value: '+22,880', dur: '320',  status: 'accent' as const },
  { id: 'E-486-3019', date: '4-86-3019', name: 'Suggestions',        value: '-14,200', dur: '480',  status: 'muted'  as const },
  { id: 'E-485-3042', date: '4-85-3042', name: 'Static Interference', value: '-18,000', dur: '150',  status: 'danger' as const },
];

function InfraTable() {
  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 120px 1fr 120px 80px 100px',
        padding: '9px 16px',
        borderBottom: `1px solid ${t.border}`,
        background: t.bgPanel,
      }}>
        {['SIGNAL ID', 'DATE', 'NAME', 'VALUE RANGE', 'DUR.', 'STATUS'].map(h => (
          <Label key={h}>{h}</Label>
        ))}
      </div>
      {logRows.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 120px 1fr 120px 80px 100px',
            padding: '10px 16px',
            background: i % 2 === 0 ? t.bgRow : t.bgRowAlt,
            borderBottom: i < logRows.length - 1 ? `1px solid ${t.border}` : 'none',
            alignItems: 'center',
          }}
        >
          <Mono size={11} color={t.accent}>{row.id}</Mono>
          <Mono size={11} color={t.textSecondary}>{row.date}</Mono>
          <Mono size={11} color={t.textPrimary}>{row.name}</Mono>
          <Mono size={11} color={t.textPrimary}>{row.value}</Mono>
          <Mono size={11} color={t.textSecondary}>{row.dur}ms</Mono>
          <StatusBadge text={row.status === 'danger' ? 'ERROR' : row.status === 'warn' ? 'WARN' : row.status === 'accent' ? 'OK' : 'IDLE'} variant={row.status} />
        </div>
      ))}
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const barData = [38, 55, 42, 70, 58, 85, 62, 74, 90, 68, 77, 82];
const barLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function RevenueChart() {
  const maxV = Math.max(...barData);
  const h = 100;
  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: '16px 20px', flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <Label>Revenue</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          <StatusBadge text="2024" variant="accent" />
          <StatusBadge text="2023" variant="muted" />
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${barData.length * 32} ${h + 20}`} style={{ display: 'block' }}>
        {barData.map((v, i) => {
          const barH = (v / maxV) * h;
          const x = i * 32 + 4;
          return (
            <g key={i}>
              <rect
                x={x} y={h - barH} width={24} height={barH}
                fill={i === 8 ? t.accent : `rgba(0,229,191,0.25)`}
                rx={3}
                style={{ filter: i === 8 ? `drop-shadow(0 0 6px ${t.accent})` : 'none' }}
              />
              <text x={x + 12} y={h + 14} textAnchor="middle" fill={t.textMuted} fontFamily={t.mono} fontSize={8}>
                {barLabels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Waveform Signal ────────────────────────────────────────────────────────────
function WaveformFull() {
  const w = 700, h = 80;
  const pts = Array.from({ length: 300 }, (_, i) => {
    const x = (i / 299) * w;
    const y = h / 2
      + Math.sin(i * 0.15) * 22
      + Math.sin(i * 0.07 + 1) * 14
      + Math.cos(i * 0.22 + 0.5) * 8;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: '16px 20px', gridColumn: '1 / -1',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Label>Signal Waveform Analysis</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['RAW', 'FILTERED', 'OVERLAY'].map(btn => (
            <button key={btn} style={{
              fontFamily: t.mono, fontSize: 9, padding: '3px 8px',
              background: btn === 'RAW' ? t.accentGlow : 'transparent',
              border: `1px solid ${btn === 'RAW' ? t.accent : t.border}`,
              color: btn === 'RAW' ? t.accent : t.textSecondary,
              borderRadius: 3, cursor: 'pointer', letterSpacing: '0.08em',
            }}>
              {btn}
            </button>
          ))}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="wfGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={t.accent} stopOpacity={0.2} />
            <stop offset="30%"  stopColor={t.accent} stopOpacity={0.9} />
            <stop offset="70%"  stopColor={t.accent} stopOpacity={0.9} />
            <stop offset="100%" stopColor={t.accent} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <polyline points={pts} fill="none" stroke="url(#wfGrad)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Globe / Heatmap placeholder ───────────────────────────────────────────────
function GlobeViz() {
  // Dot-matrix globe approximation with SVG circles
  const dots: { cx: number; cy: number; r: number; opacity: number }[] = [];
  const cx0 = 120, cy0 = 120, R = 100;
  for (let lat = -80; lat <= 80; lat += 15) {
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const numDots = Math.round(cosLat * 12);
    for (let i = 0; i < numDots; i++) {
      const lon = (i / numDots) * 360;
      const x = cx0 + R * cosLat * Math.cos((lon * Math.PI) / 180) * 0.9;
      const y = cy0 + R * Math.sin((lat * Math.PI) / 180);
      const dist = Math.sqrt((x - cx0) ** 2 + (y - cy0) ** 2);
      if (dist < R * 0.95) {
        dots.push({ cx: x, cy: y, r: 1.2, opacity: 0.15 + Math.random() * 0.5 });
      }
    }
  }
  // Highlight a few "hot" nodes
  const hotNodes = [
    { cx: 145, cy: 100 }, { cx: 100, cy: 130 }, { cx: 160, cy: 140 }, { cx: 90, cy: 105 },
  ];

  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: 16, width: 260, flexShrink: 0,
    }}>
      <Label>Network Distribution</Label>
      <svg width={240} height={240} viewBox="0 0 240 240" style={{ display: 'block', marginTop: 8 }}>
        <circle cx={120} cy={120} r={100} fill="none" stroke={t.border} strokeWidth={1} />
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={t.accent} opacity={d.opacity} />
        ))}
        {hotNodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r={4} fill={t.accent} opacity={0.9} style={{ filter: `drop-shadow(0 0 4px ${t.accent})` }} />
            <circle cx={n.cx} cy={n.cy} r={8} fill="none" stroke={t.accent} strokeWidth={0.5} opacity={0.4} />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Auto-analysis Notification ────────────────────────────────────────────────
function AutoAnalysisCard() {
  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: '14px 18px',
      borderLeft: `3px solid ${t.accent}`,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ color: t.accent, fontSize: 14, marginTop: 1 }}>⟳</span>
        <div>
          <Mono size={11} color={t.textPrimary} style={{ display: 'block', marginBottom: 4 }}>
            Automatic optimization are running in the background.
          </Mono>
          <Mono size={10} color={t.textSecondary}>
            System elasticity is within tolerance parameters. 5% threshold.
          </Mono>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export function DashboardPage() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: t.sans, fontWeight: 700, fontSize: 18, color: t.textPrimary }}>
            Infrastructure Logs
          </div>
          <Mono size={10} color={t.textMuted}>Real-time telemetry · Auto-refresh 30s</Mono>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" size="sm">Export CSV</Button>
          <Button variant="primary" size="sm">Refresh</Button>
        </div>
      </div>

      {/* Top row: chart + uptime */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        <RevenueChart />
        <div style={{
          background: t.bgCard, border: `1px solid ${t.border}`,
          borderRadius: 8, padding: '16px 20px', width: 220, flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <Label>System Uptime</Label>
          <div style={{ fontFamily: t.sans, fontWeight: 700, fontSize: 28, color: t.accent }}>
            70.66%
          </div>
          <ProgressBar value={70.66} color={t.accent} height={6} />
          <div style={{ marginTop: 4 }}>
            <Label>Avg Response</Label>
            <div style={{ fontFamily: t.mono, fontSize: 13, color: t.textPrimary, marginTop: 4 }}>
              142ms
            </div>
          </div>
          <div>
            <Label>Active Nodes</Label>
            <div style={{ fontFamily: t.mono, fontSize: 13, color: t.textPrimary, marginTop: 4 }}>
              12 / 16
            </div>
          </div>
        </div>
      </div>

      {/* Log table */}
      <InfraTable />

      {/* Bottom row: globe + waveform + notification */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <GlobeViz />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WaveformFull />
          <AutoAnalysisCard />
        </div>
      </div>
    </div>
  );
}
