import React from 'react';
import { c } from './theme2';

// ── Primitives ────────────────────────────────────────────────────────────────
const M = ({ children, size = 11, color = c.textSec, upper = false, style }: {
  children: React.ReactNode; size?: number; color?: string;
  upper?: boolean; style?: React.CSSProperties;
}) => (
  <span style={{
    fontFamily: c.mono, fontSize: size, color,
    textTransform: upper ? 'uppercase' : undefined,
    letterSpacing: upper ? '0.09em' : '0.04em', lineHeight: 1.6, ...style,
  }}>{children}</span>
);

// ── Campaign data ─────────────────────────────────────────────────────────────
const campaigns = [
  { id: '#CPG-0001', title: 'Crimson Tides',      roas: 8.4, adSets: 15, status: 'exceeds' as const },
  { id: '#CPG-0002', title: 'Silent Echoes',       roas: 4.8, adSets: 15, status: 'meets'   as const },
  { id: '#CPG-0003', title: 'The Last Ember',      roas: 7.1, adSets: 15, status: 'exceeds' as const },
  { id: '#CPG-0004', title: 'Whispers at Dusk',    roas: 5.5, adSets: 15, status: 'meets'   as const },
  { id: '#CPG-0005', title: 'Beyond the Horizon',  roas: 3.2, adSets: 14, status: 'below'   as const },
];

const ROAS_SCALE   = 10;
const THRESH_MIN   = 4.0;
const THRESH_TGT   = 5.5;
const AVG_ROAS     = +(campaigns.reduce((s, cp) => s + cp.roas, 0) / campaigns.length).toFixed(1);

const roasColor = (s: 'exceeds' | 'meets' | 'below') =>
  s === 'exceeds' ? '#00CC77' : s === 'meets' ? c.accent : '#FF4466';

const roasLabel = (s: 'exceeds' | 'meets' | 'below') =>
  s === 'exceeds' ? 'Exceeds' : s === 'meets' ? 'On target' : 'Review';

// ── Campaign Performance Table ────────────────────────────────────────────────
function CampaignPerformance() {
  const COLS = '90px 1fr 58px 80px';
  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        padding: '7px 16px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.02)',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <M size={8} color={c.textSec} upper>Acct</M>
          <M size={8} color={c.textPri}>1323·7408·3949·7080</M>
        </div>
        <div style={{ width: 1, height: 10, background: c.border }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <M size={8} color={c.textSec} upper>Pixel</M>
          <M size={8} color={c.textPri}>8834·8266·7767·853</M>
        </div>
        <div style={{ flex: 1 }} />
        <M size={8} color={c.textSec}>74 ad sets · 5 campaigns</M>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: COLS, columnGap: 8,
        padding: '7px 16px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.03)',
      }}>
        {['CAMP. ID', 'BOOK', 'SETS', 'ROAS'].map(h => (
          <M key={h} size={8} color={c.textSec} upper>{h}</M>
        ))}
      </div>
      {campaigns.map((cp, i) => {
        const color  = roasColor(cp.status);
        const barPct = Math.min(100, (cp.roas / ROAS_SCALE) * 100);
        const minPct = (THRESH_MIN / ROAS_SCALE) * 100;
        const tgtPct = (THRESH_TGT / ROAS_SCALE) * 100;
        return (
          <div key={cp.id} style={{
            display: 'grid', gridTemplateColumns: COLS, columnGap: 8,
            padding: '10px 16px', alignItems: 'center',
            background: i % 2 === 0 ? 'transparent' : 'rgba(0,177,162,0.015)',
            borderBottom: i < campaigns.length - 1 ? `1px solid ${c.border}` : 'none',
          }}>
            <M size={9} color={c.accent} style={{ whiteSpace: 'nowrap' }}>{cp.id}</M>
            <div style={{ minWidth: 0 }}>
              <M size={10} color={c.textPri} style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                {cp.title}
              </M>
              <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${barPct}%`, background: color, borderRadius: 2, opacity: 0.72, boxShadow: cp.status !== 'below' ? `0 0 5px ${color}` : 'none' }} />
                <div style={{ position: 'absolute', left: `${minPct}%`, top: -2, bottom: -2, width: 1, background: '#FF4466', opacity: 0.45 }} />
                <div style={{ position: 'absolute', left: `${tgtPct}%`, top: -2, bottom: -2, width: 1, background: '#FFB800', opacity: 0.45 }} />
              </div>
            </div>
            <M size={9} color={c.textSec}>{cp.adSets}</M>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <M size={11} color={color}>{cp.roas}×</M>
              <M size={7} color={color} upper style={{ opacity: 0.7 }}>{roasLabel(cp.status)}</M>
            </div>
          </div>
        );
      })}
      <div style={{ padding: '8px 16px', background: 'rgba(0,177,162,0.018)', borderTop: `1px solid ${c.border}`, display: 'flex', gap: 16, alignItems: 'center' }}>
        <M size={8} color={c.textSec} upper>Avg ROAS</M>
        <M size={10} color={c.accent}>{AVG_ROAS}×</M>
        <div style={{ width: 1, height: 10, background: c.border }} />
        <M size={8} color={c.textSec} upper>Target</M>
        <M size={9} color={c.textSec}>≥ {THRESH_TGT}×</M>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: '#FF4466' }}>●</span>
          <M size={8} color={c.textSec} upper>1 below threshold</M>
        </div>
      </div>
      <div style={{ borderLeft: `3px solid #3B82F6`, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ color: '#3B82F6', fontSize: 13, flexShrink: 0, marginTop: 1 }}>ℹ</span>
        <M size={10} color={c.textSec}>
          Bid optimization active across 74 ad sets. <span style={{ color: '#FF4466' }}>Beyond the Horizon</span> (3.2×) is below the 4.0× minimum — review bid strategy before scaling.
        </M>
      </div>
    </div>
  );
}

// ── System Health ─────────────────────────────────────────────────────────────
const healthRows = [
  { label: 'Ad Account', value: '1323···7080', detail: '42 ms',         ok: true  },
  { label: 'Meta Pixel',  value: 'PURCHASE ✓',  detail: '8834···853',   ok: true  },
  { label: 'Meta API',    value: 'v18.0',        detail: '128 ms',       ok: true  },
  { label: 'Feishu',      value: 'wiki synced',  detail: '2 min ago',    ok: true  },
];

function SystemHealth() {
  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 16px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.02)',
      }}>
        <M size={9} color={c.textPri} upper>System Health</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00CC77', boxShadow: '0 0 6px #00CC77' }} />
          <M size={8} color="#00CC77" upper>All Systems OK</M>
        </div>
      </div>
      {healthRows.map((h, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '88px 1fr auto',
          padding: '9px 16px', alignItems: 'center', columnGap: 10,
          borderBottom: i < healthRows.length - 1 ? `1px solid ${c.border}` : 'none',
          background: i % 2 === 0 ? 'transparent' : 'rgba(0,177,162,0.012)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#00CC77', fontSize: 9, flexShrink: 0 }}>✓</span>
            <M size={9} color={c.textSec} upper>{h.label}</M>
          </div>
          <M size={9} color={c.textPri}>{h.value}</M>
          <M size={8} color={c.textMute}>{h.detail}</M>
        </div>
      ))}
    </div>
  );
}

// ── ROAS Benchmark (horizontal bars) ─────────────────────────────────────────
function RoasBenchmark() {
  const sorted = [...campaigns].sort((a, b) => b.roas - a.roas);
  return (
    <div style={{
      background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8,
      padding: '14px 18px', flex: 1, boxSizing: 'border-box', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <M size={9} color={c.textPri} upper>ROAS Benchmark</M>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ color: '#FF4466', label: `Min ${THRESH_MIN}×` }, { color: '#FFB800', label: `Target ${THRESH_TGT}×` }].map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 1, height: 10, background: t.color, opacity: 0.7 }} />
              <M size={7} color={c.textMute} upper>{t.label}</M>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {sorted.map(cp => {
          const color  = roasColor(cp.status);
          const barPct = Math.min(100, (cp.roas / ROAS_SCALE) * 100);
          const minPct = (THRESH_MIN / ROAS_SCALE) * 100;
          const tgtPct = (THRESH_TGT / ROAS_SCALE) * 100;
          return (
            <div key={cp.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <M size={9} color={cp.status === 'below' ? '#FF4466' : c.textSec}
                style={{ width: 130, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cp.title}
              </M>
              <div style={{ flex: 1, position: 'relative', height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${barPct}%`, borderRadius: 4, background: color,
                  opacity: 0.75,
                  boxShadow: cp.status !== 'below' ? `0 0 8px ${color}40` : 'none',
                }} />
                <div style={{ position: 'absolute', left: `${minPct}%`, top: -3, bottom: -3, width: 1, background: '#FF4466', opacity: 0.5 }} />
                <div style={{ position: 'absolute', left: `${tgtPct}%`, top: -3, bottom: -3, width: 1, background: '#FFB800', opacity: 0.5 }} />
              </div>
              <M size={10} color={color} style={{ flexShrink: 0, minWidth: 34, textAlign: 'right' }}>{cp.roas}×</M>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Live Account Stats ────────────────────────────────────────────────────────
function LiveStats() {
  return (
    <div style={{
      background: c.bgCard, border: `1px solid ${c.border}`,
      borderRadius: 8, padding: '14px 18px',
      width: 190, flexShrink: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      height: '100%', boxSizing: 'border-box',
    }}>
      <div>
        <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 10 }}>Account Status</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
          <M size={15} color={c.accent} style={{ textShadow: `0 0 12px rgba(0,177,162,0.4)` }}>Active</M>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { k: 'Campaigns', v: '5' },
          { k: 'Ad sets',   v: '74' },
          { k: 'Daily bdgt', v: '$74' },
          { k: 'Targeting', v: '25–60 · F' },
          { k: 'Geo',       v: 'US CA GB AU' },
        ].map(({ k, v }) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <M size={8} color={c.textMute} upper>{k}</M>
            <M size={9} color={c.textSec}>{v}</M>
          </div>
        ))}
      </div>
      <div>
        <div style={{ height: 1, background: c.border, marginBottom: 8 }} />
        <M size={8} color={c.textMute} upper>All ads PAUSED</M>
      </div>
    </div>
  );
}

// ── Ad Signal Analysis — responsive ──────────────────────────────────────────
function WaveformSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [svgW, setSvgW] = React.useState(480);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) setSvgW(Math.max(200, entry.contentRect.width));
    });
    obs.observe(el);
    setSvgW(Math.max(200, el.clientWidth));
    return () => obs.disconnect();
  }, []);

  const H = 120, PAD_L = 36, PAD_R = 12, PAD_T = 14, PAD_B = 22;
  const W = svgW, CW = W - PAD_L - PAD_R, CH = H - PAD_T - PAD_B;

  const rng = (() => { let s = 42; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; })();
  const roasBase = [3.8,3.2,2.9,2.7,3.1,4.2,6.8,9.4,12.1,14.8,16.2,17.1,15.4,13.8,12.9,14.2,16.8,18.3,17.6,15.2,12.4,9.8,7.1,5.2];
  const roas = roasBase.map(v => Math.max(0, v + (rng() - 0.5) * 2.8));
  const ctrBase = [0.8,0.7,0.6,0.6,0.8,1.1,1.8,2.4,3.1,3.6,3.9,4.1,3.7,3.2,3.0,3.4,4.0,4.3,4.1,3.5,2.8,2.1,1.5,1.1];
  const ctr = ctrBase.map(v => Math.max(0, v + (rng() - 0.5) * 0.7));
  const maxRoas = 22, minRoas = 0, maxCtr = 5.5;

  const xOf   = (i: number) => PAD_L + (i / 23) * CW;
  const yRoas = (v: number) => PAD_T + CH - ((v - minRoas) / (maxRoas - minRoas)) * CH;
  const yCtr  = (v: number) => PAD_T + CH - (v / maxCtr) * CH;

  const roasPts = roas.map((v, i) => `${xOf(i).toFixed(1)},${yRoas(v).toFixed(1)}`).join(' ');
  const ctrPts  = ctr.map((v, i) => `${xOf(i).toFixed(1)},${yCtr(v).toFixed(1)}`).join(' ');
  const areaPath = `M ${xOf(0).toFixed(1)},${(PAD_T + CH).toFixed(1)} ` +
    roas.map((v, i) => `L ${xOf(i).toFixed(1)},${yRoas(v).toFixed(1)}`).join(' ') +
    ` L ${xOf(23).toFixed(1)},${(PAD_T + CH).toFixed(1)} Z`;

  const events   = [{ hour: 9, label: 'Budget ↑', color: '#00CC77' }, { hour: 16, label: 'Creative', color: '#3B82F6' }];
  const yTicks   = [0, 5, 10, 15, 20];
  const xLabels  = [{ h: 0, t: '00:00' }, { h: 6, t: '06:00' }, { h: 12, t: '12:00' }, { h: 18, t: '18:00' }, { h: 23, t: '23:00' }];
  const nowHour  = 21;

  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, padding: '14px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <M size={9} color={c.textPri} upper>Ad Signal Analysis</M>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec }}>Last 24h · UTC+8</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 16, height: 1.5, background: c.accent, borderRadius: 1 }} />
            <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ROAS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 16, height: 1.5, background: '#3B82F6', borderRadius: 1, opacity: 0.7 }} />
            <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec, textTransform: 'uppercase', letterSpacing: '0.06em' }}>CTR %</span>
          </div>
          <span style={{ fontFamily: c.mono, fontSize: 8, padding: '3px 7px', background: 'rgba(0,204,119,0.1)', color: '#00CC77', border: '1px solid rgba(0,204,119,0.28)', borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase' as const, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#00CC77', display: 'inline-block' }} />
            LIVE
          </span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="roasGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.accent} stopOpacity={0.18} />
              <stop offset="100%" stopColor={c.accent} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          {yTicks.map(v => (
            <line key={v} x1={PAD_L} y1={yRoas(v).toFixed(1)} x2={W - PAD_R} y2={yRoas(v).toFixed(1)}
              stroke="rgba(255,255,255,0.04)" strokeWidth={0.75} strokeDasharray={v === 0 ? 'none' : '3,3'} />
          ))}
          {yTicks.filter(v => v > 0).map(v => (
            <text key={v} x={PAD_L - 4} y={yRoas(v) + 3} textAnchor="end" fontFamily={c.mono} fontSize={7} fill={c.textMute}>{v}×</text>
          ))}
          <path d={areaPath} fill="url(#roasGrad)" />
          <polyline points={ctrPts} fill="none" stroke="#3B82F6" strokeWidth={1.2} strokeLinejoin="round" opacity={0.6} strokeDasharray="4,2" />
          <polyline points={roasPts} fill="none" stroke={c.accent} strokeWidth={1.8} strokeLinejoin="round" opacity={0.92} style={{ filter: `drop-shadow(0 0 3px rgba(0,177,162,0.5))` }} />
          {[6, 11, 17, 21].map(h => (
            <circle key={h} cx={xOf(h)} cy={yRoas(roas[h])} r={2.5} fill={c.bgCard} stroke={c.accent} strokeWidth={1.5} />
          ))}
          {events.map(ev => (
            <g key={ev.hour}>
              <line x1={xOf(ev.hour)} y1={PAD_T} x2={xOf(ev.hour)} y2={PAD_T + CH} stroke={ev.color} strokeWidth={0.8} strokeDasharray="3,2" opacity={0.55} />
              <rect x={xOf(ev.hour) - 26} y={PAD_T - 1} width={52} height={13} rx={3} fill={`${ev.color}18`} />
              <text x={xOf(ev.hour)} y={PAD_T + 8} textAnchor="middle" fontFamily={c.mono} fontSize={7} fill={ev.color} opacity={0.9}>{ev.label}</text>
            </g>
          ))}
          <line x1={xOf(nowHour)} y1={PAD_T} x2={xOf(nowHour)} y2={PAD_T + CH} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={xOf(nowHour)} y={PAD_T + CH + 14} textAnchor="middle" fontFamily={c.mono} fontSize={7} fill={c.textSec}>NOW</text>
          {xLabels.map(({ h, t }) => h === nowHour ? null : (
            <text key={h} x={xOf(h)} y={PAD_T + CH + 14} textAnchor="middle" fontFamily={c.mono} fontSize={7} fill={c.textMute}>{t}</text>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}`, flexWrap: 'wrap' }}>
        {[
          { label: 'Peak ROAS', val: `${Math.max(...roas).toFixed(1)}×`, sub: '17:00', up: true },
          { label: 'Avg ROAS',  val: `${(roas.reduce((a,b)=>a+b,0)/roas.length).toFixed(1)}×`, sub: '24h avg' },
          { label: 'Peak CTR',  val: `${Math.max(...ctr).toFixed(1)}%`,  sub: '17:00', up: true },
          { label: 'Avg CTR',   val: `${(ctr.reduce((a,b)=>a+b,0)/ctr.length).toFixed(2)}%`,  sub: '24h avg' },
          { label: 'Signals',   val: '74', sub: 'Active ads' },
          { label: 'Anomalies', val: '0',  sub: 'Last 24h' },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{m.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: c.mono, fontSize: 13, fontWeight: 700, color: m.up ? c.accent : c.textPri }}>{m.val}</span>
              <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec }}>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Globe — Audience Distribution ─────────────────────────────────────────────
function GlobeViz() {
  const cx = 110, cy = 110, R = 90;
  const dots: { cx: number; cy: number; opacity: number; hot: boolean }[] = [];
  for (let lat = -75; lat <= 75; lat += 14) {
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const n = Math.round(cosLat * 14);
    for (let i = 0; i < n; i++) {
      const lon = (i / n) * 360;
      const x = cx + R * cosLat * Math.cos((lon * Math.PI) / 180) * 0.85;
      const y = cy + R * Math.sin((lat * Math.PI) / 180) * 0.95;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < R * 0.92) dots.push({ cx: x, cy: y, opacity: 0.08 + Math.random() * 0.4, hot: Math.random() > 0.82 });
    }
  }
  const hotNodes = dots.filter(d => d.hot).slice(0, 8);
  const legend = [
    { label: 'United States',  val: '41%' },
    { label: 'Canada',         val: '22%' },
    { label: 'Great Britain',  val: '19%' },
    { label: 'Australia',      val: '18%' },
  ];
  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, padding: '14px 18px', flex: 1, display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      <svg width={220} height={220} viewBox="0 0 220 220">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={c.border} strokeWidth={1} />
        {[-45, 0, 45].map(lat => {
          const ry = R * Math.cos((lat * Math.PI) / 180) * 0.22;
          const yPos = cy + R * Math.sin((lat * Math.PI) / 180) * 0.95;
          return <ellipse key={lat} cx={cx} cy={yPos} rx={R * 0.85} ry={ry} fill="none" stroke={c.border} strokeWidth={0.5} opacity={0.5} />;
        })}
        {[0, 60, 120].map(lon => (
          <ellipse key={lon} cx={cx} cy={cy}
            rx={R * Math.abs(Math.cos((lon * Math.PI) / 180)) * 0.85} ry={R * 0.95}
            fill="none" stroke={c.border} strokeWidth={0.5} opacity={0.4}
            transform={`rotate(${lon} ${cx} ${cy})`} />
        ))}
        {dots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r={1} fill={c.accent} opacity={d.opacity} />)}
        {hotNodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r={3.5} fill={c.accent} opacity={0.95} style={{ filter: `drop-shadow(0 0 5px ${c.accent})` }} />
            <circle cx={n.cx} cy={n.cy} r={7} fill="none" stroke={c.accent} strokeWidth={0.5} opacity={0.35} />
          </g>
        ))}
        {hotNodes.slice(0, 4).map((n, i) =>
          hotNodes.slice(i + 1, i + 3).map((m, j) => (
            <line key={`${i}-${j}`} x1={n.cx} y1={n.cy} x2={m.cx} y2={m.cy} stroke={c.accent} strokeWidth={0.5} opacity={0.2} />
          ))
        )}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
        <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 4 }}>Audience Distribution</M>
        {legend.map(({ label, val }) => (
          <div key={label} style={{ textAlign: 'right' }}>
            <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 2 }}>{label}</M>
            <M size={13} color={c.textPri}>{val}</M>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mini previews for FloatingChat ────────────────────────────────────────────
const miniCampaigns = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    {campaigns.slice(0, 3).map((cp, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.accent, minWidth: 68 }}>{cp.id}</span>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cp.title}</span>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: roasColor(cp.status) }}>{cp.roas}×</span>
      </div>
    ))}
    <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, marginTop: 2 }}>+2 more · 74 ad sets total</span>
  </div>
);

const miniRoasChart = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
    {campaigns.slice(0, 3).map(cp => (
      <div key={cp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec, width: 70, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cp.title}</span>
        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(cp.roas / ROAS_SCALE) * 100}%`, background: roasColor(cp.status), borderRadius: 2 }} />
        </div>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: roasColor(cp.status), minWidth: 28 }}>{cp.roas}×</span>
      </div>
    ))}
  </div>
);

const miniHealth = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    {healthRows.map((h, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#00CC77', fontSize: 9 }}>✓</span>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, minWidth: 72 }}>{h.label}</span>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute }}>{h.detail}</span>
      </div>
    ))}
  </div>
);

const miniLiveStats = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <div style={{ fontFamily: c.mono, fontSize: 16, color: c.accent }}>Active</div>
    {[{ k: 'Campaigns', v: '5' }, { k: 'Ad sets', v: '74' }, { k: 'Budget', v: '$74/day' }].map(({ k, v }) => (
      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute }}>{k}</span>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec }}>{v}</span>
      </div>
    ))}
  </div>
);

const miniWaveform = (() => {
  const w = 400, h = 52, PAD_L = 4, PAD_R = 4, PAD_T = 4, PAD_B = 4;
  const CW = w - PAD_L - PAD_R, CH = h - PAD_T - PAD_B;
  const roasBase = [3.8,3.2,2.9,2.7,3.1,4.2,6.8,9.4,12.1,14.8,16.2,17.1,15.4,13.8,12.9,14.2,16.8,18.3,17.6,15.2,12.4,9.8,7.1,5.2];
  const ctrBase  = [0.8,0.7,0.6,0.6,0.8,1.1,1.8,2.4,3.1,3.6,3.9,4.1,3.7,3.2,3.0,3.4,4.0,4.3,4.1,3.5,2.8,2.1,1.5,1.1];
  const xOf = (i: number) => PAD_L + (i / 23) * CW;
  const yR  = (v: number) => PAD_T + CH - (v / 22) * CH;
  const yC  = (v: number) => PAD_T + CH - (v / 5.5) * CH;
  const rPts = roasBase.map((v, i) => `${xOf(i).toFixed(1)},${yR(v).toFixed(1)}`).join(' ');
  const cPts = ctrBase.map((v, i) => `${xOf(i).toFixed(1)},${yC(v).toFixed(1)}`).join(' ');
  const area = `M ${xOf(0).toFixed(1)},${(PAD_T + CH).toFixed(1)} ` +
    roasBase.map((v, i) => `L ${xOf(i).toFixed(1)},${yR(v).toFixed(1)}`).join(' ') +
    ` L ${xOf(23).toFixed(1)},${(PAD_T + CH).toFixed(1)} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="mwGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.accent} stopOpacity={0.18} />
          <stop offset="100%" stopColor={c.accent} stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mwGrad)" />
      <polyline points={cPts} fill="none" stroke="#3B82F6" strokeWidth="1.2" strokeLinejoin="round" opacity={0.55} strokeDasharray="3,2" />
      <polyline points={rPts} fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinejoin="round" opacity={0.92}
        style={{ filter: `drop-shadow(0 0 3px rgba(0,177,162,0.5))` }} />
    </svg>
  );
})();

const miniGlobe = (() => {
  const cx = 40, cy = 40, R = 34;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <svg width={80} height={80} viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={c.border} strokeWidth={0.8} />
        {[-20, 0, 20].map(lat => {
          const ry = R * Math.cos((lat * Math.PI) / 180) * 0.22;
          const yPos = cy + R * Math.sin((lat * Math.PI) / 180) * 0.95;
          return <ellipse key={lat} cx={cx} cy={yPos} rx={R * 0.85} ry={ry} fill="none" stroke={c.border} strokeWidth={0.5} opacity={0.5} />;
        })}
        {[{x:28,y:32},{x:48,y:24},{x:52,y:44},{x:34,y:50},{x:42,y:38}].map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill={c.accent} opacity={0.9}
            style={{ filter: `drop-shadow(0 0 3px ${c.accent})` }} />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {['US 41%', 'CA 22%', 'GB 19%', 'AU 18%'].map(s => (
          <span key={s} style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec }}>{s}</span>
        ))}
      </div>
    </div>
  );
})();

// ── Module registry ───────────────────────────────────────────────────────────
export const DASH_MODULES: Record<string, { label: string; preview: React.ReactNode }> = {
  'campaigns':     { label: 'Campaign Performance',  preview: miniCampaigns  },
  'roas-chart':    { label: 'ROAS Benchmark',         preview: miniRoasChart  },
  'system-health': { label: 'System Health',          preview: miniHealth     },
  'live-stats':    { label: 'Account Status',         preview: miniLiveStats  },
  'waveform':      { label: 'Ad Signal Analysis',     preview: miniWaveform   },
  'globe':         { label: 'Audience Distribution',  preview: miniGlobe      },
};

// ── Selectable wrapper ────────────────────────────────────────────────────────
function Sel({ id, selectedId, onSelect, children, style }: {
  id: string; selectedId: string | null;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = React.useState(false);
  const active = selectedId === id;
  return (
    <div
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        cursor: 'pointer', borderRadius: 8, position: 'relative', outline: 'none',
        boxShadow: active
          ? `0 0 0 1px rgba(0,177,162,0.5), 0 0 24px rgba(0,177,162,0.08)`
          : hov ? `0 0 0 1px rgba(0,177,162,0.18)` : 'none',
        transition: 'box-shadow 0.2s',
        ...style,
      }}
    >
      {children}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8, pointerEvents: 'none',
        background: 'rgba(0,177,162,0.03)',
        opacity: active ? 1 : 0, transition: 'opacity 0.22s',
      }} />
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export function DashboardContent({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '20px 24px 96px', gap: 16 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: c.sans, fontWeight: 700, fontSize: 17, color: c.textPri }}>Campaign Monitor</span>
          <M size={9} color={c.textMute} style={{ marginLeft: 12 }}>LSN Test · Meta Ads</M>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[{ label: '5 Campaigns' }, { label: '74 Ad Sets' }, { label: `Avg ROAS ${AVG_ROAS}×` }].map(b => (
            <span key={b.label} style={{ fontFamily: c.mono, fontSize: 9, padding: '3px 8px', background: 'rgba(0,177,162,0.07)', color: c.accent, border: `1px solid rgba(0,177,162,0.2)`, borderRadius: 3, letterSpacing: '0.08em' }}>
              {b.label}
            </span>
          ))}
          <button style={{ fontFamily: c.mono, fontSize: 10, padding: '7px 14px', background: 'transparent', border: `1px solid ${c.borderStrong}`, borderRadius: 5, color: c.accent, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

        {/* ── Left column (fixed 420px) ── */}
        <div style={{ width: 420, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Sel id="campaigns" selectedId={selectedId} onSelect={onSelect}>
            <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
              <CampaignPerformance />
            </div>
          </Sel>
          <Sel id="system-health" selectedId={selectedId} onSelect={onSelect}>
            <SystemHealth />
          </Sel>
        </div>

        {/* ── Right column (flex) ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', height: 200 }}>
            <Sel id="roas-chart" selectedId={selectedId} onSelect={onSelect} style={{ flex: 1 }}>
              <RoasBenchmark />
            </Sel>
            <Sel id="live-stats" selectedId={selectedId} onSelect={onSelect}>
              <LiveStats />
            </Sel>
          </div>
          <Sel id="waveform" selectedId={selectedId} onSelect={onSelect}>
            <WaveformSection />
          </Sel>
          <Sel id="globe" selectedId={selectedId} onSelect={onSelect}>
            <GlobeViz />
          </Sel>
        </div>

      </div>
    </div>
  );
}
