import React, { useRef, useEffect } from 'react';
import { c } from './theme2';
import { ChatMsg } from './agentLogic';
import { ReportsContent } from './ReportsContent';

// ── Primitives ────────────────────────────────────────────────────────────────
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

const Badge = ({ text, variant = 'muted', dot }: {
  text: string; variant?: 'muted' | 'active' | 'danger' | 'live' | 'blue' | 'warn'; dot?: boolean;
}) => {
  const s = {
    muted:  { bg: 'rgba(255,255,255,0.04)', color: c.textSec,  border: c.border },
    active: { bg: 'rgba(0,177,162,0.07)',   color: c.accent,   border: 'rgba(0,177,162,0.2)' },
    danger: { bg: 'rgba(255,45,120,0.12)',  color: '#FF2D78',  border: 'rgba(255,45,120,0.3)' },
    live:   { bg: 'rgba(0,204,119,0.12)',   color: '#00CC77',  border: 'rgba(0,204,119,0.3)' },
    blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6',  border: 'rgba(59,130,246,0.3)' },
    warn:   { bg: 'rgba(255,184,0,0.10)',   color: '#FFB800',  border: 'rgba(255,184,0,0.25)' },
  }[variant];
  return (
    <span style={{
      fontFamily: c.mono, fontSize: 9, padding: '3px 8px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />}
      {text}
    </span>
  );
};

// ── Message hover-action toolbar ──────────────────────────────────────────────
function MsgActions({ visible, actions }: {
  visible: boolean;
  actions: { icon: string; label: string }[];
}) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(4px)',
      transition: 'opacity 0.15s, transform 0.15s',
      pointerEvents: visible ? 'auto' : 'none',
      marginBottom: 4,
    }}>
      {actions.map(({ icon, label }) => (
        <button key={label} title={label} style={{
          fontFamily: c.mono, fontSize: 8, padding: '3px 9px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${c.border}`,
          borderRadius: 4, color: c.textSec, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {icon}  {label}
        </button>
      ))}
    </div>
  );
}

// ── User bubble ───────────────────────────────────────────────────────────────
function UserBubble({ children }: { children: React.ReactNode }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      style={{ alignSelf: 'flex-end', maxWidth: 440 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
        <MsgActions visible={hov} actions={[
          { icon: '⎘', label: 'Copy' },
          { icon: '✎', label: 'Edit' },
        ]} />
      </div>
      <div style={{
        background: c.bgBubble,
        border: `1px solid ${hov ? c.borderStrong : c.border}`,
        borderRadius: 10, borderBottomRightRadius: 3,
        padding: '14px 16px',
        transition: 'border-color 0.18s',
        boxShadow: hov ? `0 2px 16px rgba(0,0,0,0.12)` : 'none',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Agent message wrapper ─────────────────────────────────────────────────────
function AgentBlock({ children }: { children: React.ReactNode }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <MsgActions visible={hov} actions={[
        { icon: '⎘', label: 'Copy' },
        { icon: '★', label: 'Save' },
        { icon: '↺', label: 'Retry' },
      ]} />
      {children}
    </div>
  );
}

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  const [frame, setFrame] = React.useState(0);
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % 3), 380);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <M size={9} color={c.accent} upper bold>Lanbow</M>
      <div style={{ display: 'flex', gap: 3 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: '50%', background: c.accent,
            opacity: frame === i ? 1 : 0.18, transition: 'opacity 0.2s',
            boxShadow: frame === i ? `0 0 6px ${c.accent}` : 'none',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Pipeline Step ─────────────────────────────────────────────────────────────
function PipelineStep({ label, value, status }: {
  label: string; value: string; status: 'done' | 'paused';
}) {
  const [hov, setHov] = React.useState(false);
  const isDanger = status === 'paused';
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isDanger ? 'rgba(255,45,120,0.06)' : hov ? 'rgba(0,177,162,0.04)' : c.bgCard,
        border: `1px solid ${isDanger ? 'rgba(255,45,120,0.35)' : hov ? c.borderStrong : c.borderStrong}`,
        borderRadius: 6, padding: '12px 16px', flex: 1, minWidth: 120,
        transition: 'all 0.15s',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hov ? `0 4px 16px rgba(0,0,0,0.14)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Scan line on hover */}
      {hov && !isDanger && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(0,177,162,0.06), transparent)',
          animation: 'chatShimmer 0.7s ease-in-out',
          pointerEvents: 'none',
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <M upper size={9} color={isDanger ? '#FF2D78' : c.accentMid}>{label}</M>
        <span style={{ fontSize: 11, color: isDanger ? '#FF2D78' : c.accent }}>{isDanger ? '⊗' : '✓'}</span>
      </div>
      <div style={{ fontFamily: c.mono, fontWeight: 400, fontSize: 13, color: c.textPri }}>{value}</div>
    </div>
  );
}

function PipeArrow() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" style={{ flexShrink: 0 }}>
      <line x1="1" y1="7" x2="17" y2="7" stroke={c.textMute} strokeWidth="1" />
      <polyline points="12,3 18,7 12,11" fill="none" stroke={c.textMute} strokeWidth="1" />
    </svg>
  );
}

// ── Animated Launch Button ────────────────────────────────────────────────────
function AnimatedLaunch() {
  const [state, setState] = React.useState<'idle' | 'launching' | 'done'>('idle');
  const [pct, setPct] = React.useState(0);
  const [hov, setHov] = React.useState(false);

  const doLaunch = () => {
    if (state !== 'idle') return;
    setState('launching');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 9 + 3;
      const capped = Math.min(100, p);
      setPct(capped);
      if (capped >= 100) { clearInterval(iv); setTimeout(() => setState('done'), 200); }
    }, 90);
  };

  if (state === 'done') return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: c.mono, fontSize: 11, padding: '10px 22px',
      background: 'rgba(0,204,119,0.07)', border: `1px solid rgba(0,204,119,0.28)`,
      borderRadius: 6, color: '#00CC77',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      animation: 'chatFadeIn 0.4s ease',
    }}>
      <span style={{ fontSize: 13 }}>✓</span> 74 ads submitted
    </div>
  );

  if (state === 'launching') return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 14,
      fontFamily: c.mono, fontSize: 11, padding: '10px 22px',
      background: c.bgCard, border: `1px solid ${c.borderStrong}`,
      borderRadius: 6, color: c.accent, minWidth: 220,
      position: 'relative', overflow: 'hidden', letterSpacing: '0.08em',
    }}>
      {/* Fill bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${pct}%`,
        background: 'linear-gradient(90deg, rgba(0,177,162,0.08), rgba(0,177,162,0.18))',
        transition: 'width 0.09s linear',
      }} />
      <span style={{ position: 'relative' }}>Launching…</span>
      <span style={{ position: 'relative', marginLeft: 'auto', fontSize: 10, color: c.accentMid }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );

  return (
    <button
      onClick={doLaunch}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: c.mono, fontSize: 11, padding: '10px 22px',
        background: c.accent, border: 'none', borderRadius: 6,
        color: c.bgBase, cursor: 'pointer',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        boxShadow: hov
          ? `0 0 32px rgba(0,177,162,0.5), 0 4px 20px rgba(0,177,162,0.35)`
          : `0 0 20px ${c.accentGlow}`,
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all 0.16s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {hov && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          animation: 'chatShimmer 0.55s ease-in-out',
          pointerEvents: 'none',
        }} />
      )}
      Launch all 74 ads
    </button>
  );
}

// ── ROAS Gauge ────────────────────────────────────────────────────────────────
function RoasGauge() {
  const cx = 130, cy = 132, R = 96, rInner = 56;
  const startDeg = 225, totalDeg = 270;

  const [liveVal, setLiveVal] = React.useState(6.5);
  useEffect(() => {
    let raf: number;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const t = (ts - t0) / 1000;
      const v = 6.5 + Math.sin(t * 0.55) * 0.9 + Math.sin(t * 1.3) * 0.35 + Math.sin(t * 2.8) * 0.15;
      setLiveVal(Math.max(0.5, Math.min(19.5, v)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = liveVal / 20;

  function polar(deg: number, r: number) {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arcPath(fromDeg: number, sweepDeg: number, outerR: number, innerR: number) {
    const toDeg = fromDeg + sweepDeg;
    const s = polar(fromDeg, outerR), e = polar(toDeg, outerR);
    const is = polar(fromDeg, innerR), ie = polar(toDeg, innerR);
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${outerR} ${outerR} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} L ${ie.x.toFixed(2)} ${ie.y.toFixed(2)} A ${innerR} ${innerR} 0 ${large} 0 ${is.x.toFixed(2)} ${is.y.toFixed(2)} Z`;
  }

  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= 80; i++) {
    const deg = startDeg + (totalDeg * i) / 80;
    const isMajor = i % 20 === 0, isMed = i % 5 === 0;
    const len = isMajor ? 11 : isMed ? 7 : 4;
    const p1 = polar(deg, R + 2 + len);
    const p2 = polar(deg, R + 2);
    const done = i / 80 <= pct;
    ticks.push(
      <line key={i} x1={p1.x.toFixed(1)} y1={p1.y.toFixed(1)} x2={p2.x.toFixed(1)} y2={p2.y.toFixed(1)}
        stroke={done ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.17)'}
        strokeWidth={isMajor ? 1.4 : 0.7} />
    );
  }

  const scaleLabels = [
    { val: '0',  deg: startDeg },
    { val: '5',  deg: startDeg + totalDeg * 0.25 },
    { val: '10', deg: startDeg + totalDeg * 0.5 },
    { val: '20', deg: startDeg + totalDeg },
  ];

  const glowSize = 4 + (pct * 8);
  const displayVal = liveVal.toFixed(1) + 'x';

  return (
    <div style={{
      background: c.bgCard, border: `1px solid ${c.border}`,
      borderRadius: 10, padding: '16px 18px', flex: '0 0 420px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <M upper size={10} color={c.textSec}>Real-Time ROAS</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: c.accent,
            boxShadow: `0 0 6px ${c.accent}`,
            animation: 'roasPulse 1.4s ease-in-out infinite',
          }} />
          <M upper size={9} color={c.accent}>Live</M>
        </div>
      </div>
      <svg width="100%" viewBox="0 0 260 222" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="rGrad" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%"   stopColor="#003D38" stopOpacity={1} />
            <stop offset="55%"  stopColor="#006E66" stopOpacity={1} />
            <stop offset="100%" stopColor={c.accent}  stopOpacity={1} />
          </linearGradient>
          <filter id="rGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={glowSize} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={arcPath(startDeg, totalDeg, R, rInner)} fill={c.bgBase} opacity={0.7} />
        <path d={arcPath(startDeg, totalDeg, R, rInner)} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <path d={arcPath(startDeg, totalDeg * pct, R, rInner)} fill="url(#rGrad)" filter="url(#rGlow)" />
        {(() => {
          const tipDeg = startDeg + totalDeg * pct;
          const tipR = (R + rInner) / 2;
          const tip = polar(tipDeg, tipR);
          return <circle cx={tip.x.toFixed(1)} cy={tip.y.toFixed(1)} r="4" fill={c.accent}
            style={{ filter: `drop-shadow(0 0 ${glowSize}px ${c.accent})` }} />;
        })()}
        {ticks}
        {scaleLabels.map(({ val, deg }) => {
          const p = polar(deg, R + 22);
          return <text key={val} x={p.x.toFixed(1)} y={p.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fill={c.textSec} fontFamily={c.mono} fontSize={9}>{val}</text>;
        })}
        <text x={cx} y={cy - 14} textAnchor="middle" fill={c.accent}
          fontFamily={c.sans} fontWeight={400} fontSize={24}
          style={{ filter: `drop-shadow(0 0 ${glowSize + 6}px ${c.accent})` }}>
          {displayVal}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={c.textSec} fontFamily={c.mono} fontSize={10}>ROAS</text>
        <text x={cx} y={cy + 32} textAnchor="middle" fill={c.textMute} fontFamily={c.mono} fontSize={9}>Real-time</text>
      </svg>

      {/* Launch standard assessment */}
      {(() => {
        const THRESHOLD_MIN = 4.0, THRESHOLD_GOOD = 5.5;
        const isExceeds = liveVal >= THRESHOLD_GOOD;
        const isMeets   = liveVal >= THRESHOLD_MIN && liveVal < THRESHOLD_GOOD;
        const status = isExceeds
          ? { label: 'Exceeds Target', color: '#00CC77', bg: 'rgba(0,204,119,0.06)',  border: 'rgba(0,204,119,0.18)' }
          : isMeets
          ? { label: 'Meets Standard', color: c.accent,  bg: 'rgba(0,177,162,0.06)', border: c.borderStrong }
          : { label: 'Below Standard', color: '#FF4466', bg: 'rgba(255,68,102,0.06)', border: 'rgba(255,68,102,0.25)' };
        const verdict = isExceeds
          ? `${liveVal.toFixed(1)}× exceeds the ≥${THRESHOLD_GOOD}× target — campaign is performing above expectations. Safe to scale.`
          : isMeets
          ? `${liveVal.toFixed(1)}× meets the minimum ≥${THRESHOLD_MIN}× threshold — proceed with standard monitoring.`
          : `${liveVal.toFixed(1)}× is below the ≥${THRESHOLD_MIN}× minimum. Review bid strategy before proceeding.`;
        return (
          <div style={{ marginTop: 2, borderTop: `1px solid ${c.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                {[{ k: 'Min', v: `≥${THRESHOLD_MIN}×` }, { k: 'Target', v: `≥${THRESHOLD_GOOD}×` }, { k: 'Current', v: `${liveVal.toFixed(1)}×` }].map(({ k, v }) => (
                  <div key={k}>
                    <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 2 }}>{k}</M>
                    <M size={10} color={k === 'Current' ? status.color : c.textSec}>{v}</M>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: status.bg, border: `1px solid ${status.border}`, borderRadius: 4, padding: '3px 9px' }}>
                <M size={9} color={status.color} upper>{status.label}</M>
              </div>
            </div>
            <div style={{ background: status.bg, border: `1px solid ${status.border}`, borderRadius: 6, padding: '8px 12px' }}>
              <M size={9} color={c.textSec} style={{ lineHeight: 1.7 }}>{verdict}</M>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Ad Signal Analysis — realistic 24h ROAS + CTR chart ──────────────────────
function WaveformCard() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [svgW, setSvgW] = React.useState(500);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) setSvgW(Math.max(200, entry.contentRect.width));
    });
    obs.observe(el);
    setSvgW(Math.max(200, el.clientWidth));
    return () => obs.disconnect();
  }, []);

  const W = svgW, H = 100, PL = 32, PR = 8, PT = 6, PB = 18;
  const CW = W - PL - PR, CH = H - PT - PB;

  const roas = [3.8,3.2,2.9,2.7,3.1,4.2,6.8,9.4,12.1,14.8,16.2,17.1,15.4,13.8,12.9,14.2,16.8,18.3,17.6,15.2,12.4,9.8,7.1,5.2];
  const ctr  = [0.8,0.7,0.6,0.6,0.8,1.1,1.8,2.4,3.1,3.6,3.9,4.1,3.7,3.2,3.0,3.4,4.0,4.3,4.1,3.5,2.8,2.1,1.5,1.1];
  const maxR = 22, maxC = 5.5;

  const xOf  = (i: number) => PL + (i / 23) * CW;
  const yR   = (v: number) => PT + CH - (v / maxR) * CH;
  const yC   = (v: number) => PT + CH - (v / maxC) * CH;

  const roasPts = roas.map((v, i) => `${xOf(i).toFixed(1)},${yR(v).toFixed(1)}`).join(' ');
  const ctrPts  = ctr.map((v,  i) => `${xOf(i).toFixed(1)},${yC(v).toFixed(1)}`).join(' ');
  const area    = `M${xOf(0).toFixed(1)},${(PT+CH).toFixed(1)} ` +
    roas.map((v,i)=>`L${xOf(i).toFixed(1)},${yR(v).toFixed(1)}`).join(' ') +
    ` L${xOf(23).toFixed(1)},${(PT+CH).toFixed(1)}Z`;

  const yTicks  = [0, 10, 20];
  const xLabels = [{h:0,t:'00'},{h:6,t:'06'},{h:12,t:'12'},{h:18,t:'18'},{h:23,t:'23'}];
  const events  = [{h:9,label:'Budget↑',color:'#00CC77'},{h:16,label:'Creative',color:'#3B82F6'}];
  const nowH    = 21;

  const avgRoas = (roas.reduce((a,b)=>a+b,0)/roas.length).toFixed(1);
  const peakR   = Math.max(...roas).toFixed(1);
  const avgCtr  = (ctr.reduce((a,b)=>a+b,0)/ctr.length).toFixed(2);

  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <M size={10} color={c.textPri} upper style={{ letterSpacing: '0.08em' }}>Ad Signal Analysis</M>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute }}>Last 24h</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 14, height: 1.5, background: c.accent, borderRadius: 1 }} />
            <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec, textTransform: 'uppercase' }}>ROAS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 14, height: 1.5, background: '#3B82F6', borderRadius: 1, opacity: 0.7 }} />
            <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec, textTransform: 'uppercase' }}>CTR</span>
          </div>
          <Badge text="LIVE" variant="live" dot />
        </div>
      </div>

      {/* Responsive chart container */}
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="wcGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.accent} stopOpacity={0.16}/>
              <stop offset="100%" stopColor={c.accent} stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          {/* Grid */}
          {yTicks.map(v=>(
            <line key={v} x1={PL} y1={yR(v).toFixed(1)} x2={W-PR} y2={yR(v).toFixed(1)}
              stroke="rgba(255,255,255,0.045)" strokeWidth={0.7} strokeDasharray={v===0?'none':'3,3'} />
          ))}
          {yTicks.filter(v=>v>0).map(v=>(
            <text key={v} x={PL-3} y={yR(v)+3} textAnchor="end" fontFamily={c.mono} fontSize={7} fill={c.textMute}>{v}×</text>
          ))}
          {/* Area + lines */}
          <path d={area} fill="url(#wcGrad)" />
          <polyline points={ctrPts} fill="none" stroke="#3B82F6" strokeWidth={1.2} strokeLinejoin="round" opacity={0.6} strokeDasharray="4,2" />
          <polyline points={roasPts} fill="none" stroke={c.accent} strokeWidth={1.8} strokeLinejoin="round" opacity={0.92}
            style={{ filter:`drop-shadow(0 0 3px rgba(0,177,162,0.5))` }} />
          {/* Key dots */}
          {[9,17,21].map(h=>(
            <circle key={h} cx={xOf(h)} cy={yR(roas[h])} r={2.5} fill={c.bgCard} stroke={c.accent} strokeWidth={1.5} />
          ))}
          {/* Events */}
          {events.map(ev=>(
            <g key={ev.h}>
              <line x1={xOf(ev.h)} y1={PT} x2={xOf(ev.h)} y2={PT+CH}
                stroke={ev.color} strokeWidth={0.8} strokeDasharray="3,2" opacity={0.5} />
              <text x={xOf(ev.h)} y={PT+9} textAnchor="middle" fontFamily={c.mono} fontSize={7} fill={ev.color} opacity={0.85}>{ev.label}</text>
            </g>
          ))}
          {/* Now */}
          <line x1={xOf(nowH)} y1={PT} x2={xOf(nowH)} y2={PT+CH} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          {/* X labels */}
          {xLabels.map(({h,t})=>(
            <text key={h} x={xOf(h)} y={PT+CH+13} textAnchor="middle" fontFamily={c.mono} fontSize={7}
              fill={h===nowH ? c.textSec : c.textMute}>{h===nowH?'NOW':t}</text>
          ))}
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, paddingTop: 8, borderTop: `1px solid ${c.border}`, flexWrap: 'wrap' }}>
        {[
          { label: 'Peak ROAS', val: `${peakR}×`, color: c.accent },
          { label: 'Avg ROAS',  val: `${avgRoas}×` },
          { label: 'Avg CTR',   val: `${avgCtr}%` },
          { label: 'Active Ads', val: '74' },
          { label: 'Anomalies', val: '0' },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontFamily: c.mono, fontSize: 7, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{m.label}</div>
            <span style={{ fontFamily: c.mono, fontSize: 12, fontWeight: 700, color: m.color ?? c.textPri }}>{m.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Signal Resonance Asset Testing ───────────────────────────────────────────
const testAssets = [
  { name: 'Signal_Interfer_V1', freq: '2.4 kHz', harmonic: 'H-2', score: 94.2, status: 'match'   as const },
  { name: 'Neural_Flow_X',      freq: '3.1 kHz', harmonic: 'H-3', score: 87.8, status: 'match'   as const },
  { name: 'Campaign_Alpha_09',  freq: '1.8 kHz', harmonic: 'H-1', score: 71.3, status: 'partial' as const },
  { name: 'Retro_Beat_Loop',    freq: '4.2 kHz', harmonic: 'H-5', score: 52.1, status: 'testing' as const },
];

function MiniWave({ phase, amp = 1, color = c.accent }: { phase: number; amp?: number; color?: string }) {
  const w = 64, h = 22;
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = (i / 80) * w, t = (i / 80) * Math.PI * 6 + phase;
    pts.push(`${x.toFixed(1)},${(h / 2 + Math.sin(t) * 8 * amp).toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color}
        strokeWidth="1.5" strokeLinejoin="round" opacity={0.85}
        style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
}

function SignalAssetTesting() {
  const [phase, setPhase] = React.useState(0);
  useEffect(() => {
    let raf: number; let t0: number | null = null;
    const tick = (ts: number) => { if (t0 === null) t0 = ts; setPhase((ts - t0) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const statusCfg = {
    match:   { color: '#00CC77', label: 'Match',   dot: '●' },
    partial: { color: '#FFB800', label: 'Partial',  dot: '◑' },
    testing: { color: c.textSec, label: 'Testing',  dot: '○' },
  };

  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: `1px solid ${c.border}`, background: 'rgba(0,177,162,0.025)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <M size={10} color={c.textPri} bold upper>Signal Resonance Testing</M>
        </div>
        <Badge text={`Running ${testAssets.filter(a => a.status !== 'testing').length}/${testAssets.length}`} variant="live" dot />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 80px 80px 90px 72px', padding: '7px 18px', borderBottom: `1px solid ${c.border}`, gap: 12 }}>
        {['Asset', 'Signal', 'Frequency', 'Harmonic', 'Resonance', 'Status'].map(h => (
          <M key={h} size={8} color={c.textSec} upper>{h}</M>
        ))}
      </div>
      {testAssets.map((a, i) => {
        const sc = statusCfg[a.status];
        return (
          <div key={a.name} style={{
            display: 'grid', gridTemplateColumns: '1fr 64px 80px 80px 90px 72px',
            padding: '10px 18px', gap: 12, alignItems: 'center',
            borderBottom: i < testAssets.length - 1 ? `1px solid ${c.border}` : 'none',
            background: i % 2 === 1 ? 'rgba(0,177,162,0.012)' : 'transparent',
          }}>
            <M size={10} color={c.textPri} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</M>
            <MiniWave phase={phase * (1 + i * 0.3)} amp={a.score / 100} color={sc.color} />
            <M size={10} color={c.textSec}>{a.freq}</M>
            <Badge text={a.harmonic} variant={a.status === 'match' ? 'active' : a.status === 'partial' ? 'warn' : 'muted'} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <M size={8} color={sc.color}>{a.score}%</M>
              <div style={{ height: 3, background: c.bgBase, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${a.score}%`, height: '100%', borderRadius: 2, background: sc.color, boxShadow: a.status === 'match' ? `0 0 6px ${sc.color}` : 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: sc.color, fontSize: 9 }}>{sc.dot}</span>
              <M size={9} color={sc.color} upper>{sc.label}</M>
            </div>
          </div>
        );
      })}
      <div style={{ padding: '9px 18px', borderTop: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,177,162,0.018)' }}>
        <M size={8} color={c.textSec} upper>Avg Resonance</M>
        <M size={10} color={c.accent} bold>{(testAssets.reduce((s, a) => s + a.score, 0) / testAssets.length).toFixed(1)}%</M>
        <div style={{ width: 1, height: 12, background: c.border }} />
        <M size={8} color={c.textSec} upper>Dominant Harmonic</M>
        <M size={10} color={c.textSec}>H-2 / H-3</M>
        <div style={{ flex: 1 }} />
        <button style={{
          fontFamily: c.mono, fontSize: 9, padding: '4px 12px',
          background: c.accentDim, border: `1px solid ${c.borderStrong}`,
          borderRadius: 4, color: c.accent, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Re-run all</button>
      </div>
    </div>
  );
}

// ── Plan Analyzer ─────────────────────────────────────────────────────────────
const analysisSteps = [
  { label: 'Fetching plan document',      dur: 600  },
  { label: 'Parsing ad structure',        dur: 500  },
  { label: 'Validating budget config',    dur: 700  },
  { label: 'Checking asset availability', dur: 550  },
  { label: 'Running feasibility check',   dur: 800  },
];
const analysisResults = [
  { label: 'Ad account',   value: '1323740839497080 — access confirmed',      status: 'pass' as const },
  { label: 'Budget',       value: '$1/ad set × 74 — below recommended $100',  status: 'warn' as const },
  { label: 'Targeting',    value: 'female · 25–60 · US/CA/GB/AU — valid',     status: 'pass' as const },
  { label: 'Asset bundles', value: '5 books · 74 files — all reachable',      status: 'pass' as const },
  { label: 'Pixel config', value: '8834…853 · PURCHASE event — active',       status: 'pass' as const },
  { label: 'Ad format',    value: '1080×1080 IMAGE · aspect ratio OK',         status: 'pass' as const },
  { label: 'Status',       value: 'All ads will launch as PAUSED — confirmed', status: 'pass' as const },
];

function PlanAnalyzer() {
  const [state, setState] = React.useState<'idle' | 'analyzing' | 'done'>('idle');
  const [stepIdx, setStepIdx] = React.useState(-1);

  const runAnalysis = () => {
    setState('analyzing'); setStepIdx(0);
    let i = 0;
    const next = () => {
      if (i >= analysisSteps.length - 1) { setTimeout(() => setState('done'), 300); return; }
      i++; setStepIdx(i); setTimeout(next, analysisSteps[i].dur);
    };
    setTimeout(next, analysisSteps[0].dur);
  };

  const passCount = analysisResults.filter(r => r.status === 'pass').length;
  const warnCount = analysisResults.filter(r => r.status === 'warn').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <M size={11} color={c.accent} style={{ textDecoration: 'underline', textDecorationColor: 'rgba(0,177,162,0.3)', cursor: 'pointer' }}>
          sandwichlab.feishu.cn / wiki / MDJxwNZd2iagyYkOawrcHMyHnnh
        </M>
        {state === 'idle' && (
          <button onClick={runAnalysis} style={{
            fontFamily: c.mono, fontSize: 9, padding: '3px 10px', borderRadius: 4,
            border: `1px solid ${c.borderStrong}`, background: c.accentDim, color: c.accent,
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0,
          }}>Analyze plan</button>
        )}
        {state === 'done' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#00CC77', fontSize: 10 }}>✓</span>
            <M size={9} color="#00CC77" upper>Plan valid</M>
          </span>
        )}
      </div>
      {state === 'analyzing' && (
        <div style={{ background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: 7, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <M size={8} color={c.accent} upper style={{ display: 'block', marginBottom: 4, letterSpacing: '0.12em' }}>Analyzing…</M>
          {analysisSteps.map((step, i) => {
            const done = i < stepIdx, active = i === stepIdx;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, textAlign: 'center', fontSize: 10, flexShrink: 0, color: done ? '#00CC77' : active ? c.accent : c.textMute }}>{done ? '✓' : active ? '●' : '○'}</span>
                <M size={9} color={done ? c.textSec : active ? c.textPri : c.textMute}>{step.label}</M>
                {active && <span style={{ fontFamily: c.mono, fontSize: 9, color: c.accent, animation: 'planBlink 0.8s step-start infinite' }}>_</span>}
              </div>
            );
          })}
        </div>
      )}
      {state === 'done' && (
        <div style={{ background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: 7, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderBottom: `1px solid ${c.border}`, background: 'rgba(0,204,119,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#00CC77', fontSize: 11 }}>✓</span>
              <M size={9} color="#00CC77" upper bold>Plan is executable</M>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge text={`${passCount} passed`} variant="live" dot />
              {warnCount > 0 && <Badge text={`${warnCount} warning`} variant="warn" />}
            </div>
          </div>
          {analysisResults.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 14px', padding: '7px 14px', gap: 10, alignItems: 'center', borderBottom: i < analysisResults.length - 1 ? `1px solid ${c.border}` : 'none', background: i % 2 === 1 ? 'rgba(0,177,162,0.012)' : 'transparent' }}>
              <M size={8} color={c.textSec} upper>{r.label}</M>
              <M size={9} color={r.status === 'warn' ? '#FFB800' : c.textSec}>{r.value}</M>
              <span style={{ fontSize: 10, color: r.status === 'pass' ? '#00CC77' : '#FFB800', textAlign: 'right' }}>{r.status === 'pass' ? '✓' : '⚠'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Campaign config ───────────────────────────────────────────────────────────
const configRows = [
  { label: 'Objective',    value: 'OUTCOME_SALES',              badge: 'active' as const },
  { label: 'Pixel',        value: '883482667767853 / PURCHASE', badge: 'active' as const },
  { label: 'Daily budget', value: '$1 / ad set',                badge: 'warn'   as const },
  { label: 'Targeting',    value: 'female · 25–60 · US / CA / GB / AU', badge: 'active' as const },
  { label: 'Status',       value: 'PAUSED',                     badge: 'active' as const },
  { label: 'Billing',      value: 'IMPRESSIONS',                badge: 'active' as const },
  { label: 'Optimization', value: 'OFFSITE_CONVERSIONS',        badge: 'active' as const },
  { label: 'Bid strategy', value: 'LOWEST_COST_WITHOUT_CAP',    badge: 'active' as const },
  { label: 'Headline',     value: 'short drama name (locked)',   badge: 'active' as const },
];

// ── Chip preset reply components ─────────────────────────────────────────────

function ScaleTopAdSetsReply() {
  const rows = [
    { id: 'LNB-0042', book: 'Drama-01', roas: 18.4, rec: 5.0 },
    { id: 'LNB-0011', book: 'Drama-03', roas: 17.2, rec: 4.5 },
    { id: 'LNB-0067', book: 'Drama-02', roas: 16.8, rec: 4.0 },
    { id: 'LNB-0029', book: 'Drama-01', roas: 15.9, rec: 3.5 },
    { id: 'LNB-0055', book: 'Drama-05', roas: 15.3, rec: 3.0 },
    { id: 'LNB-0038', book: 'Drama-04', roas: 14.7, rec: 3.0 },
    { id: 'LNB-0021', book: 'Drama-02', roas: 14.1, rec: 2.5 },
    { id: 'LNB-0073', book: 'Drama-03', roas: 13.8, rec: 2.5 },
  ];
  return (
    <>
      <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
        8 top ad sets identified — scaling budgets
      </M>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <M size={9} color={c.textSec} upper>ROAS by ad set</M>
          <M size={9} color={c.textMute}>target 20×</M>
        </div>
        {rows.map(row => (
          <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <M size={9} color={c.textMute} style={{ width: 56, flexShrink: 0 }}>{row.id}</M>
            <div style={{ flex: 1, height: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3,
                width: `${(row.roas / 20) * 100}%`,
                background: `linear-gradient(90deg, ${c.accent}, rgba(0,177,162,0.55))`,
              }} />
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.12)' }} />
            </div>
            <M size={9} color={c.accent} style={{ width: 34, textAlign: 'right', flexShrink: 0 }}>{row.roas}×</M>
            <M size={9} color='#00CC77' style={{ width: 42, textAlign: 'right', flexShrink: 0 }}>${row.rec}</M>
          </div>
        ))}
      </div>
      <M size={10} color={c.textSec} style={{ display: 'block', lineHeight: 1.75 }}>
        Scaling these 8 ad sets by an average +94% daily budget. Remaining 66 ad sets held at $2.00.
      </M>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Badge text="+$16.00 / day" variant="live" />
        <Badge text="8 ad sets" variant="active" />
        <Badge text="avg +94% budget" variant="blue" />
      </div>
    </>
  );
}

function PauseUnderperformingReply() {
  const rows = [
    { id: 'LNB-0031', book: 'Drama-04', roas: 3.2 },
    { id: 'LNB-0048', book: 'Drama-02', roas: 4.1 },
    { id: 'LNB-0062', book: 'Drama-05', roas: 5.8 },
    { id: 'LNB-0017', book: 'Drama-01', roas: 6.3 },
    { id: 'LNB-0034', book: 'Drama-03', roas: 7.1 },
    { id: 'LNB-0059', book: 'Drama-04', roas: 7.6 },
  ];
  const THRESHOLD = 8;
  return (
    <>
      <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
        6 ad sets below threshold — pausing now
      </M>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: `1px solid ${c.border}` }}>
          <M upper size={9} color={c.accent}>Underperforming ad sets</M>
          <Badge text={`< ${THRESHOLD}× ROAS`} variant="danger" />
        </div>
        {rows.map((row, i) => (
          <div key={row.id} style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 44px 72px',
            padding: '8px 14px', alignItems: 'center', gap: 8,
            borderBottom: i < rows.length - 1 ? `1px solid ${c.border}` : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,45,120,0.015)',
          }}>
            <M size={9} color={c.textMute}>{row.id}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${(row.roas / THRESHOLD) * 100}%`, background: row.roas < 5 ? '#FF2D78' : '#FFB800' }} />
              </div>
              <M size={9} color={row.roas < 5 ? '#FF2D78' : '#FFB800'} style={{ width: 26, textAlign: 'right', flexShrink: 0 }}>{row.roas}×</M>
            </div>
            <M size={9} color={c.textMute} style={{ textAlign: 'right' }}>$2.00</M>
            <Badge text="→ Paused" variant="danger" />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Badge text="6 paused" variant="danger" />
        <Badge text="-$12.00 / day" variant="warn" />
        <Badge text="68 active" variant="active" />
      </div>
    </>
  );
}

function RefreshRoasReply() {
  const campaigns = [
    { name: 'Drama-01', data: [10.2, 11.4, 12.8, 13.5, 14.1, 13.8, 14.9, 15.2], color: c.accent },
    { name: 'Drama-02', data: [8.9,  9.2, 10.1, 11.3, 12.0, 11.8, 12.4, 13.0], color: '#3B82F6' },
    { name: 'Drama-03', data: [12.1, 13.0, 13.4, 12.8, 13.9, 14.2, 14.8, 15.6], color: '#00CC77' },
    { name: 'Drama-04', data: [6.5,  7.1,  7.8,  8.2,  7.9,  8.8,  9.1,  9.4], color: '#FFB800' },
    { name: 'Drama-05', data: [9.8, 10.2, 11.0, 10.7, 11.5, 12.1, 12.8, 13.5], color: '#A78BFA' },
  ];
  const W = 112, H = 28;
  const sparkline = (data: number[], color: string) => {
    const min = Math.min(...data) - 0.5;
    const max = Math.max(...data) + 0.5;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / (max - min)) * H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const last = data[data.length - 1];
    const lx = W, ly = H - ((last - min) / (max - min)) * H;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        <circle cx={lx} cy={ly} r="2.5" fill={color} />
      </svg>
    );
  };
  return (
    <>
      <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
        ROAS refreshed · 5 campaigns · 7-day trend
      </M>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 14px', borderBottom: `1px solid ${c.border}` }}>
          <M upper size={9} color={c.accent}>Campaign ROAS · last 7 days</M>
          <M size={9} color={c.textMute}>Target: 20×</M>
        </div>
        {campaigns.map((camp, i) => {
          const today = camp.data[camp.data.length - 1];
          const delta = today - camp.data[camp.data.length - 2];
          return (
            <div key={camp.name} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 44px 38px',
              padding: '8px 14px', alignItems: 'center', gap: 10,
              borderBottom: i < campaigns.length - 1 ? `1px solid ${c.border}` : 'none',
            }}>
              <M size={10} color={c.textSec}>{camp.name}</M>
              {sparkline(camp.data, camp.color)}
              <M size={10} color={camp.color} style={{ textAlign: 'right' }}>{today}×</M>
              <M size={9} color={delta >= 0 ? '#00CC77' : '#FF2D78'} style={{ textAlign: 'right' }}>
                {delta >= 0 ? '↑' : '↓'}{Math.abs(delta).toFixed(1)}
              </M>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Badge text="Portfolio 13.3×" variant="active" />
        <Badge text="Target 20×" variant="warn" />
        <Badge text="+0.7 vs yesterday" variant="live" />
      </div>
    </>
  );
}

function ExportReportReply() {
  const metrics = [
    { label: 'Impressions', value: '2.41M',  sub: '+8.3% wow',     color: c.accent },
    { label: 'Clicks',      value: '18.7K',  sub: 'CTR 0.78%',     color: '#3B82F6' },
    { label: 'Spend',       value: '$1,036', sub: '7-day total',    color: '#A78BFA' },
    { label: 'ROAS',        value: '13.2×',  sub: 'vs 20× target', color: '#00CC77' },
    { label: 'CPA',         value: '$1.94',  sub: 'per conversion', color: '#FFB800' },
    { label: 'Conversions', value: '534',    sub: 'PURCHASE event', color: c.accent },
  ];
  return (
    <>
      <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
        Q2 performance report · 7-day window
      </M>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 7, padding: '10px 12px' }}>
            <M size={9} color={c.textMute} upper style={{ display: 'block', marginBottom: 4 }}>{m.label}</M>
            <M size={14} color={m.color} bold style={{ display: 'block', letterSpacing: '-0.01em' }}>{m.value}</M>
            <M size={8} color={c.textMute} style={{ display: 'block', marginTop: 2 }}>{m.sub}</M>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(0,204,119,0.05)', border: `1px solid rgba(0,204,119,0.2)`,
        borderRadius: 8, padding: '10px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00CC77" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <div>
            <M size={10} color={c.textPri} style={{ display: 'block' }}>report_Q2_20250519.xlsx</M>
            <M size={9} color={c.textMute}>2.4 MB · 5 campaigns · 74 ad sets · 7-day window</M>
          </div>
        </div>
        <Badge text="Ready" variant="live" />
      </div>
    </>
  );
}

function ABTestReply() {
  const variants = [
    { name: 'Variant A', headline: '"Binge-worthy drama — free today"', ctr: 1.24, cpc: 0.38, cvr: 3.8 },
    { name: 'Variant B', headline: '"5 short dramas, zero cost"',        ctr: 0.97, cpc: 0.51, cvr: 2.9 },
    { name: 'Variant C', headline: '"Your next obsession awaits"',        ctr: 0.82, cpc: 0.63, cvr: 2.1 },
  ];
  return (
    <>
      <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
        A/B test · 3 headline variants · equal split
      </M>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 40px 40px', padding: '9px 14px', borderBottom: `1px solid ${c.border}`, gap: 10 }}>
          <M upper size={9} color={c.accent}>Headline</M>
          <M upper size={9} color={c.textMute} style={{ textAlign: 'right' }}>CTR</M>
          <M upper size={9} color={c.textMute} style={{ textAlign: 'right' }}>CPC</M>
          <M upper size={9} color={c.textMute} style={{ textAlign: 'right' }}>CVR</M>
        </div>
        {variants.map((v, i) => (
          <div key={v.name} style={{
            display: 'grid', gridTemplateColumns: '1fr 40px 40px 40px',
            padding: '10px 14px', gap: 10, alignItems: 'center',
            borderBottom: i < variants.length - 1 ? `1px solid ${c.border}` : 'none',
            background: i === 0 ? 'rgba(0,177,162,0.04)' : 'transparent',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <M size={9} color={i === 0 ? c.accent : c.textMute} upper>{v.name}</M>
                {i === 0 && <Badge text="Winner" variant="live" />}
              </div>
              <M size={9} color={c.textSec} style={{ fontStyle: 'italic' }}>{v.headline}</M>
            </div>
            <M size={10} color={i === 0 ? '#00CC77' : c.textSec} bold style={{ textAlign: 'right' }}>{v.ctr}%</M>
            <M size={10} color={i === 0 ? c.textPri : c.textSec}       style={{ textAlign: 'right' }}>${v.cpc}</M>
            <M size={10} color={i === 0 ? '#00CC77' : c.textSec}       style={{ textAlign: 'right' }}>{v.cvr}%</M>
          </div>
        ))}
      </div>
      <M size={10} color={c.textSec} style={{ display: 'block', lineHeight: 1.75 }}>
        Variant A leads with +27.8% CTR and +31% CVR over B. Recommend reallocating 70% of budget to Variant A.
      </M>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Badge text="Variant A dominant" variant="live" />
        <Badge text="+27.8% CTR" variant="active" />
        <Badge text="budget reallocation ready" variant="blue" />
      </div>
    </>
  );
}

function PixelEventsReply() {
  const funnel = [
    { event: 'ViewContent',      count: 48230, rate: null, color: c.accent },
    { event: 'AddToCart',        count: 12840, rate: 26.6, color: '#3B82F6' },
    { event: 'InitiateCheckout', count:  4890, rate: 38.1, color: '#A78BFA' },
    { event: 'Purchase',         count:   534, rate: 10.9, color: '#00CC77' },
  ];
  const maxCount = funnel[0].count;
  return (
    <>
      <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
        Pixel 8834…853 · event funnel · 7 days
      </M>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 14px', borderBottom: `1px solid ${c.border}` }}>
          <M upper size={9} color={c.accent}>Conversion funnel</M>
          <Badge text="• Live" variant="live" dot />
        </div>
        {funnel.map((row, i) => (
          <div key={row.event} style={{ padding: '10px 14px', borderBottom: i < funnel.length - 1 ? `1px solid ${c.border}` : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <M size={10} color={c.textSec} upper>{row.event}</M>
              <div style={{ display: 'flex', gap: 10 }}>
                {row.rate !== null && <M size={9} color={c.textMute}>→ {row.rate}% conv.</M>}
                <M size={10} color={row.color} bold>{row.count.toLocaleString()}</M>
              </div>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, width: `${(row.count / maxCount) * 100}%`, background: row.color, opacity: 0.8 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Badge text="534 purchases" variant="live" />
        <Badge text="1.11% overall CVR" variant="active" />
        <Badge text="signal nominal" variant="blue" />
      </div>
      <M size={9} color={c.textMute} style={{ display: 'block' }}>
        Last event: PURCHASE · 2 min ago · No data gaps in last 24h
      </M>
    </>
  );
}

const CHIP_REPLIES: Record<string, () => React.ReactNode> = {
  'Scale top ad sets':   () => <ScaleTopAdSetsReply />,
  'Pause underperforming': () => <PauseUnderperformingReply />,
  'Refresh ROAS':        () => <RefreshRoasReply />,
  'Export report':       () => <ExportReportReply />,
  'A/B test variants':   () => <ABTestReply />,
  'Check pixel events':  () => <PixelEventsReply />,
};

// ── Quick suggestions chips ───────────────────────────────────────────────────
const SUGGESTIONS = [
  { text: 'Scale top ad sets', icon: '↗' },
  { text: 'Pause underperforming', icon: '⏸' },
  { text: 'Refresh ROAS', icon: '⟳' },
  { text: 'Export report', icon: '⬇' },
  { text: 'A/B test variants', icon: '⚡' },
  { text: 'Check pixel events', icon: '◎' },
];

function QuickSuggestions({ onSelect, usedChips }: { onSelect: (text: string) => void; usedChips: Set<string> }) {
  const [hov, setHov] = React.useState<number | null>(null);
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
      {SUGGESTIONS.map((s, i) => {
        const used = usedChips.has(s.text);
        return (
          <button
            key={i}
            onClick={() => onSelect(s.text)}
            onMouseEnter={() => !used && setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              fontFamily: c.mono, fontSize: 9,
              padding: '5px 11px',
              background: used
                ? 'rgba(255,255,255,0.02)'
                : hov === i ? 'rgba(0,177,162,0.10)' : 'rgba(0,177,162,0.03)',
              border: `1px solid ${used ? 'rgba(255,255,255,0.05)' : hov === i ? 'rgba(0,177,162,0.38)' : 'rgba(0,177,162,0.12)'}`,
              borderRadius: 20,
              color: used ? c.textMute : hov === i ? c.accent : c.textSec,
              cursor: used ? 'default' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              transition: 'all 0.15s',
              transform: !used && hov === i ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: !used && hov === i ? `0 0 12px rgba(0,177,162,0.14)` : 'none',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              animation: `chatChipIn 0.3s ease both`,
              animationDelay: `${i * 45}ms`,
              opacity: used ? 0.4 : 1,
            }}
          >
            <span style={{ fontSize: 10, opacity: 0.8 }}>{s.icon}</span>
            {s.text}
          </button>
        );
      })}
    </div>
  );
}

// ── Animated input bar ────────────────────────────────────────────────────────
function AnimatedInputBar({ value, onChange, onFocus, onBlur, focused, onSend }: {
  value: string; onChange: (v: string) => void;
  onFocus: () => void; onBlur: () => void;
  focused: boolean; onSend: (v: string) => void;
}) {
  const [hovBtn, setHovBtn] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) { e.preventDefault(); onSend(value); }
  };

  const canSend = value.trim().length > 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: focused ? 'rgba(0,177,162,0.025)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${focused ? 'rgba(0,177,162,0.45)' : c.border}`,
      borderRadius: 10, padding: '9px 10px 9px 14px',
      boxShadow: focused ? `0 0 0 3px rgba(0,177,162,0.07), 0 0 28px rgba(0,177,162,0.04)` : 'none',
      transition: 'all 0.2s',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Shimmer when focused */}
      {focused && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,177,162,0.035) 50%, transparent 100%)',
          animation: 'chatShimmer 2.4s linear infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Attach icon */}
      <button
        onMouseEnter={() => setHovBtn('att')} onMouseLeave={() => setHovBtn(null)}
        onClick={() => inputRef.current?.focus()}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
          color: hovBtn === 'att' ? c.accent : c.textMute,
          transition: 'color 0.15s', fontSize: 14, lineHeight: 1, flexShrink: 0,
        }}>⊕</button>

      {/* Input */}
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKey}
        placeholder="Message Lanbow…"
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          color: c.textPri, fontFamily: c.mono, fontSize: 11,
          letterSpacing: '0.03em', lineHeight: 1.5,
        }}
      />

      {/* Slash hint (not focused, no text) */}
      {!focused && !value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginRight: 4 }}>
          <kbd style={{
            fontFamily: c.mono, fontSize: 8, padding: '2px 5px',
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.border}`,
            borderRadius: 3, color: c.textMute, letterSpacing: '0.06em',
          }}>/</kbd>
          <M size={8} color={c.textMute}>commands</M>
        </div>
      )}

      {/* Divider */}
      <div style={{ width: 1, height: 18, background: c.border, flexShrink: 0 }} />

      {/* Voice icon */}
      <button
        onMouseEnter={() => setHovBtn('voice')} onMouseLeave={() => setHovBtn(null)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
          color: hovBtn === 'voice' ? c.accent : c.textMute,
          transition: 'color 0.15s', fontSize: 12, lineHeight: 1, flexShrink: 0,
        }}>◉</button>

      {/* Send button */}
      <button
        onClick={() => canSend && onSend(value)}
        onMouseEnter={() => setHovBtn('send')} onMouseLeave={() => setHovBtn(null)}
        style={{
          fontFamily: c.mono, fontSize: 9, padding: '6px 14px',
          background: canSend
            ? (hovBtn === 'send' ? 'rgba(0,177,162,0.9)' : c.accent)
            : 'transparent',
          border: `1px solid ${canSend ? 'transparent' : c.border}`,
          borderRadius: 6, color: canSend ? c.bgBase : c.textMute,
          cursor: canSend ? 'pointer' : 'default',
          transition: 'all 0.16s', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0,
          boxShadow: canSend ? `0 0 14px ${c.accentGlow}` : 'none',
          transform: hovBtn === 'send' && canSend ? 'translateY(-1px)' : 'translateY(0)',
        }}>Send</button>
    </div>
  );
}

// ── Local chat message ────────────────────────────────────────────────────────
function LocalUserMsg({ text }: { text: string }) {
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: 440, animation: 'chatMsgIn 0.28s ease' }}>
      <div style={{
        background: c.bgBubble, border: `1px solid ${c.border}`,
        borderRadius: 10, borderBottomRightRadius: 3, padding: '12px 16px',
      }}>
        <M size={11} color={c.textSec}>{text}</M>
      </div>
    </div>
  );
}

function LocalAgentMsg({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'chatMsgIn 0.28s ease' }}>
      <M size={9} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>Lanbow ›</M>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderLeft: `2px solid ${c.accent}`, borderRadius: 8, padding: '12px 16px' }}>
        <M size={11} color={c.textSec} style={{ lineHeight: 1.75 }}>{text}</M>
      </div>
    </div>
  );
}

// ── Session history ───────────────────────────────────────────────────────────
interface SessionRecord {
  id: string;
  title: string;
  timestamp: number;
  localMsgs: { id: string; role: 'user' | 'agent'; text?: string; chipKey?: string }[];
  usedChips: string[];
  showPreset: boolean;
  showSetup: boolean;
  setupAuthorized: boolean;
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function HistoryPanel({
  sessions, onLoad, onClose, onNewChat,
}: {
  sessions: SessionRecord[];
  onLoad: (s: SessionRecord) => void;
  onClose: () => void;
  onNewChat: () => void;
}) {
  const [hov, setHov] = React.useState<string | null>(null);
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10,
      width: 220, background: '#0d1e2a',
      borderRight: `1px solid rgba(0,177,162,0.22)`,
      boxShadow: '4px 0 24px rgba(0,0,0,0.55)',
      display: 'flex', flexDirection: 'column',
      animation: 'historySlideIn 0.22s cubic-bezier(.2,0,.2,1) both',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '13px 14px', borderBottom: `1px solid ${c.border}`, flexShrink: 0,
      }}>
        <M size={9} color={c.accent} upper bold style={{ letterSpacing: '0.1em' }}>Chat History</M>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: c.textMute, cursor: 'pointer',
          fontSize: 15, lineHeight: 1, padding: 4,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = c.textPri; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = c.textMute; }}
        >×</button>
      </div>

      {/* New chat button */}
      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${c.border}`, flexShrink: 0 }}>
        <button onClick={onNewChat} style={{
          width: '100%', fontFamily: c.mono, fontSize: 9, letterSpacing: '0.09em',
          textTransform: 'uppercase', padding: '8px 0',
          background: 'rgba(0,177,162,0.07)', border: `1px solid rgba(0,177,162,0.22)`,
          borderRadius: 7, color: c.accent, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'background 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,177,162,0.14)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 14px rgba(0,177,162,0.2)`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,177,162,0.07)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Chat
        </button>
      </div>

      {/* Session list */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${c.borderStrong} transparent` }}>
        {sessions.length === 0 ? (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <M size={9} color={c.textMute} upper style={{ display: 'block', letterSpacing: '0.06em' }}>No history yet</M>
          </div>
        ) : (
          [...sessions].reverse().map(s => (
            <div
              key={s.id}
              onClick={() => onLoad(s)}
              onMouseEnter={() => setHov(s.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                padding: '11px 14px', borderBottom: `1px solid ${c.border}`,
                cursor: 'pointer',
                background: hov === s.id ? 'rgba(0,177,162,0.05)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                  background: c.accentDim, boxShadow: `0 0 5px ${c.accentDim}`,
                }} />
                <div style={{ minWidth: 0 }}>
                  <M size={10} color={c.textSec} style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.title}
                  </M>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                    <M size={8} color={c.textMute}>{timeAgo(s.timestamp)}</M>
                    <span style={{ width: 2, height: 2, borderRadius: '50%', background: c.textMute, flexShrink: 0 }} />
                    <M size={8} color={c.textMute}>{s.localMsgs.length} msg{s.localMsgs.length !== 1 ? 's' : ''}</M>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Global keyframes ──────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes roasPulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  @keyframes planBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes chatShimmer { from{transform:translateX(-100%)} to{transform:translateX(200%)} }
  @keyframes chatChipIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes chatMsgIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes chatFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes historySlideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
`;

// ── Main Content ──────────────────────────────────────────────────────────────
export function CommChatContent({ msgs, typing, onAuthorize }: { msgs: ChatMsg[]; typing: boolean; onAuthorize?: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = React.useState('');
  const [inputFocused, setInputFocused] = React.useState(false);
  const [localMsgs, setLocalMsgs] = React.useState<{ id: string; role: 'user' | 'agent'; text?: string; chipKey?: string }[]>([]);
  const [localTyping, setLocalTyping] = React.useState(false);
  const [showPreset, setShowPreset] = React.useState(false);
  const [showSetup, setShowSetup] = React.useState(false);
  const [setupAuthorized, setSetupAuthorized] = React.useState(false);
  const [usedChips, setUsedChips] = React.useState<Set<string>>(new Set());
  const [sessions, setSessions] = React.useState<SessionRecord[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [showReports, setShowReports] = React.useState(false);

  const handleAuthorize = () => {
    setSetupAuthorized(true);
    onAuthorize?.();
  };

  const saveCurrentSession = () => {
    if (localMsgs.length === 0 && !showPreset && !showSetup) return;
    const firstUser = localMsgs.find(m => m.role === 'user')?.text;
    const title = firstUser
      ? firstUser.slice(0, 44) + (firstUser.length > 44 ? '…' : '')
      : showSetup ? 'Workspace setup' : 'Session';
    setSessions(prev => [...prev, {
      id: Date.now().toString(),
      title,
      timestamp: Date.now(),
      localMsgs,
      usedChips: Array.from(usedChips),
      showPreset,
      showSetup,
      setupAuthorized,
    }]);
  };

  const handleNewChat = () => {
    saveCurrentSession();
    setLocalMsgs([]);
    setUsedChips(new Set());
    setShowPreset(false);
    setShowSetup(false);
    setSetupAuthorized(false);
    setInputVal('');
    setShowHistory(false);
  };

  const handleLoadSession = (s: SessionRecord) => {
    saveCurrentSession();
    setLocalMsgs([...s.localMsgs]);
    setUsedChips(new Set(s.usedChips));
    setShowPreset(s.showPreset);
    setShowSetup(s.showSetup);
    setSetupAuthorized(s.setupAuthorized);
    setSessions(prev => prev.filter(p => p.id !== s.id));
    setShowHistory(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing, localMsgs, localTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const id = Date.now().toString();
    setLocalMsgs(p => [...p, { id, role: 'user', text }]);
    setInputVal('');
    setLocalTyping(true);
    setTimeout(() => {
      setLocalTyping(false);
      setLocalMsgs(p => [...p, {
        id: id + '_r', role: 'agent',
        text: 'Understood. Analyzing current campaign data and ROAS signals. I\'ll have a full recommendation ready shortly.',
      }]);
    }, 1800);
  };

  const handleChipSelect = (text: string) => {
    if (usedChips.has(text)) return;
    setUsedChips(prev => new Set(prev).add(text));
    const id = Date.now().toString();
    setLocalMsgs(p => [...p, { id, role: 'user', text }]);
    setLocalTyping(true);
    const replyFn = CHIP_REPLIES[text];
    setTimeout(() => {
      setLocalTyping(false);
      setLocalMsgs(p => [...p, {
        id: id + '_r', role: 'agent',
        ...(text in CHIP_REPLIES ? { chipKey: text } : { text: 'Understood. Processing your request now.' }),
      }]);
    }, 1200 + Math.random() * 500);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{KEYFRAMES}</style>

      {/* ── Chat header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 16px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,0,0,0.06)', flexShrink: 0,
      }}>
        {/* History toggle */}
        <button
          onClick={() => setShowHistory(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: showHistory ? 'rgba(0,177,162,0.1)' : 'transparent',
            border: `1px solid ${showHistory ? 'rgba(0,177,162,0.3)' : c.border}`,
            borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!showHistory) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,177,162,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,177,162,0.05)'; } }}
          onMouseLeave={e => { if (!showHistory) { (e.currentTarget as HTMLButtonElement).style.borderColor = c.border; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; } }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={showHistory ? c.accent : c.textSec} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <M size={9} color={showHistory ? c.accent : c.textSec} upper style={{ letterSpacing: '0.07em' }}>
            History{sessions.length > 0 ? ` (${sessions.length})` : ''}
          </M>
        </button>

        {/* Session label */}
        <M size={9} color={c.textMute} upper style={{ letterSpacing: '0.07em' }}>Lanbow Chat</M>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* Reports toggle */}
        <button
          onClick={() => setShowReports(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: showReports ? 'rgba(0,177,162,0.1)' : 'transparent',
            border: `1px solid ${showReports ? 'rgba(0,177,162,0.3)' : c.border}`,
            borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (!showReports) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,177,162,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,177,162,0.05)'; } }}
          onMouseLeave={e => { if (!showReports) { (e.currentTarget as HTMLButtonElement).style.borderColor = c.border; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; } }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={showReports ? c.accent : c.textSec} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>
          </svg>
          <M size={9} color={showReports ? c.accent : c.textSec} upper style={{ letterSpacing: '0.07em' }}>Reports</M>
        </button>

        {/* New chat */}
        <button
          onClick={handleNewChat}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'transparent', border: `1px solid ${c.border}`,
            borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,177,162,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,177,162,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = c.border; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <M size={9} color={c.textSec} upper style={{ letterSpacing: '0.07em' }}>New Chat</M>
        </button>
        </div>{/* end right actions */}
      </div>

      {/* ── Body: history panel + messages ── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          sessions={sessions}
          onLoad={handleLoadSession}
          onClose={() => setShowHistory(false)}
          onNewChat={handleNewChat}
        />
      )}

      {/* ── Messages scroll area ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Empty state + Demo Chat entry ── */}
        {localMsgs.length === 0 && msgs.length === 0 && !showPreset && !showSetup && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 32,
            padding: '40px 24px', minHeight: 320,
          }}>
            {/* Greeting */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: c.mono, fontSize: 9, color: c.accent,
                textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12,
              }}>
                Lanbow · Enterprise Growth Decision System
              </div>
              <div style={{
                fontFamily: c.sans, fontSize: 20, fontWeight: 700,
                color: c.textPri, marginBottom: 8,
              }}>
                What would you like to do today?
              </div>
              <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textSec, lineHeight: 1.7 }}>
                Ask me to launch ads, analyse ROAS, generate creatives, or pull reports.
              </div>
            </div>

            {/* Demo Chat card */}
            <div
              onClick={() => { setShowSetup(true); setShowPreset(true); }}
              style={{
                cursor: 'pointer', width: '100%', maxWidth: 380,
                background: 'rgba(0,177,162,0.04)',
                border: `1px solid rgba(0,177,162,0.18)`,
                borderRadius: 12, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(0,177,162,0.09)';
                el.style.borderColor = 'rgba(0,177,162,0.4)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(0,177,162,0.04)';
                el.style.borderColor = 'rgba(0,177,162,0.18)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: 'rgba(0,177,162,0.1)',
                border: `1px solid rgba(0,177,162,0.22)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: c.sans, fontSize: 13, fontWeight: 600, color: c.textPri, marginBottom: 4 }}>
                  Demo Chat
                </div>
                <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, lineHeight: 1.6 }}>
                  Workspace setup · Ad campaign run · 7 messages
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        )}

        {/* ── Setup / auth session (only shown in demo mode) ── */}
        {showSetup && (
          <div style={{ display: 'contents', animation: 'chatFadeIn 0.4s ease' }}>

            {/* SETUP MSG 1 — Agent: access request */}
            <AgentBlock>
              <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
                Workspace access required
              </M>
              <M size={11} color={c.textSec} style={{ display: 'block', lineHeight: 1.75 }}>
                To operate on your behalf I need read access to the following workspace connections.
                Please review and authorize.
              </M>

              {/* Access request table */}
              <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px', borderBottom: `1px solid ${c.border}` }}>
                  <M upper size={9} color={c.accent}>Connection Request</M>
                  <Badge text="7 scopes" variant="blue" />
                </div>
                {[
                  { scope: 'Feishu Working Folder',  detail: 'Sandwichlab.Feishu.Cn' },
                  { scope: 'Context File',           detail: './Generated/Q2-Romance...' },
                  { scope: 'User Identity',          detail: 'Siye @ Sandwichlab.Ai' },
                  { scope: 'Meta Ad Account',        detail: '8048 9042 9093 816' },
                  { scope: 'Dataset ID',             detail: '8834 8266 7767 853' },
                  { scope: 'Facebook Page + ID',     detail: 'LexiCollection_85 · 8313…375' },
                  { scope: 'Data Tracking + Pixel',  detail: '8834 8266 7767 853' },
                ].map((row, i, arr) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto',
                    padding: '8px 16px', alignItems: 'center', gap: 12,
                    background: i % 2 === 0 ? 'transparent' : 'rgba(0,177,162,0.018)',
                    borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : 'none',
                  }}>
                    <div>
                      <M size={10} color={c.textSec} upper style={{ display: 'block', marginBottom: 2 }}>{row.scope}</M>
                      <M size={9} color={c.textMute}>{row.detail}</M>
                    </div>
                    <Badge
                      text={setupAuthorized ? 'Granted' : 'Pending'}
                      variant={setupAuthorized ? 'live' : 'warn'}
                    />
                  </div>
                ))}
              </div>

              {/* Authorize button — hides after auth */}
              {!setupAuthorized && (
                <button
                  onClick={handleAuthorize}
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: c.mono, fontSize: 9, letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: c.accent, color: c.bgBase, border: 'none',
                    borderRadius: 6, padding: '9px 20px', cursor: 'pointer',
                    boxShadow: `0 0 18px rgba(0,177,162,0.35)`,
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(0,177,162,0.55)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(0,177,162,0.35)'; }}
                >
                  Authorize All
                </button>
              )}
            </AgentBlock>

            {/* SETUP MSG 2 — User: confirms authorization */}
            {setupAuthorized && (
              <UserBubble>
                <M size={11} color={c.textSec} style={{ display: 'block' }}>Authorized.</M>
              </UserBubble>
            )}

            {/* SETUP MSG 3 — Agent: confirms fetch + shows resolved values */}
            {setupAuthorized && (
              <AgentBlock>
                <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
                  Access granted — workspace context loaded
                </M>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { label: 'Working Folder',       value: 'Sandwichlab.Feishu.Cn' },
                    { label: 'Context',              value: './Generated/Q2-Romance...' },
                    { label: 'User',                 value: 'Siye @ Sandwichlab.Ai' },
                    { label: 'Meta Ad Account',      value: '8048 9042 9093 816' },
                    { label: 'Dataset',              value: '8834 8266 7767 853' },
                    { label: 'Facebook Page',        value: 'LexiCollection_85' },
                    { label: 'Facebook ID',          value: '8313 5178 0067 375' },
                    { label: 'Data Tracking',        value: '8834 8266 7767 853' },
                    { label: 'Pixel ID',             value: '8834 8266 7767 853' },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#00CC77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <M size={9} color={c.textMute} upper style={{ minWidth: 110, flexShrink: 0 }}>{row.label}</M>
                      <M size={10} color={c.textSec}>{row.value}</M>
                    </div>
                  ))}
                </div>
              </AgentBlock>
            )}

          </div>
        )}

        {/* Pre-set session (only shown in demo mode) */}
        {showPreset && (
          <div style={{ display: 'contents', animation: 'chatFadeIn 0.4s ease' }}>

        {/* MSG 1 — User */}
        <UserBubble>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <M size={11} color={c.textPri} style={{ display: 'block' }}>
              I want to run ads. Tenant lsn test, ad account 1323740839497080.
            </M>
            <M size={11} color={c.textSec} style={{ display: 'block', marginTop: 6 }}>Plan is here:</M>
            <PlanAnalyzer />
            <M size={11} color={c.textSec} style={{ display: 'block', marginTop: 4 }}>
              Pull the materials, generate copy + creatives, submit to Meta. Keep everything paused so I can review.
            </M>
          </div>
        </UserBubble>

        {/* MSG 2 — Agent */}
        <AgentBlock>
          <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
            Got it. Here is the execution plan I'll run before anything goes live:
          </M>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              'Verify auth on siye2 / dev for ad account 1323…7080',
              'Read the ad plan from Feishu and resolve the booklist + assets',
              'Download booklist CSV + per-book asset bundles',
              'Generate ~500-word English ad bodies per book',
              'Build 1080×1080 creatives, assemble copies',
              <>Submit campaigns / ad sets / ads to Meta — <Badge text="ALL PAUSED" variant="danger" /></>,
              'Cross-check every config and hand back to you',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <M size={11} color={c.accentDim} style={{ flexShrink: 0, minWidth: 16 }}>{i + 1}.</M>
                <M size={11} color={c.textSec} upper style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{item}</M>
              </div>
            ))}
          </div>
          <M upper size={10} color={c.textSec} bold style={{ marginTop: 2 }}>Execution Pipeline:</M>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <PipelineStep label="01_Feishu"   value="74 files"  status="done" />
            <PipeArrow />
            <PipelineStep label="02_ETL"      value="validated" status="done" />
            <PipeArrow />
            <PipelineStep label="03_Generate" value="5 + 74"    status="done" />
            <PipeArrow />
            <PipelineStep label="04_Submit"   value="5/5/74/74" status="done" />
            <PipeArrow />
            <PipelineStep label="05_Publish"  value="paused"    status="paused" />
          </div>
          <div style={{ display: 'flex', background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {[
              { label: 'Creative & Copy',     desc: '5 books · 74 creatives · 505 words avg', icon: '↗' },
              { label: 'Campaigns Submitted', desc: '5 campaigns · 74 ad sets · 74 ads',       icon: '⏸' },
              { label: 'Targeting',           desc: 'female · 25–60 · US / CA / GB / AU',      icon: '↗' },
            ].map((card, i) => (
              <React.Fragment key={card.label}>
                {i > 0 && <div style={{ width: 1, background: c.border }} />}
                <div style={{ flex: 1, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <M upper size={9} color={c.textSec} style={{ display: 'block', marginBottom: 5 }}>{card.label}</M>
                    <M size={10} color={c.textPri}>{card.desc}</M>
                  </div>
                  <span style={{ color: c.textSec, fontSize: 13, marginLeft: 8 }}>{card.icon}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px', borderBottom: `1px solid ${c.border}` }}>
              <M upper size={9} color={c.accent}>Campaign / Ad Set / Ad — All Matched</M>
              <Badge text="+9 / 9 checks" variant="blue" />
            </div>
            {configRows.map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '130px 1fr auto',
                padding: '9px 16px', alignItems: 'center', gap: 12,
                background: i % 2 === 0 ? 'transparent' : 'rgba(0,177,162,0.018)',
                borderBottom: i < configRows.length - 1 ? `1px solid ${c.border}` : 'none',
              }}>
                <M size={11} color={c.textSec}>{row.label}</M>
                <M size={11} color={row.badge === 'warn' ? '#FFB800' : c.textPri}>{row.value}</M>
                <Badge text={row.badge === 'warn' ? 'Review' : 'Active'} variant={row.badge} />
              </div>
            ))}
          </div>
          <div><AnimatedLaunch /></div>
        </AgentBlock>

        {/* MSG 3 — User */}
        <UserBubble>
          <M size={11} color={c.textSec} style={{ display: 'block' }}>Are you still working?</M>
        </UserBubble>

        {/* MSG 4 — Agent */}
        <AgentBlock>
          <M size={11} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>
            All done — nothing on my side. Recap:
          </M>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <M size={9} color={c.textSec} upper>Status</M>
            <Badge text="• 74 Published" variant="live" />
            <M size={9} color={c.textSec}>Released as scheduled and currently in testing</M>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
            <RoasGauge />
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 12, scrollbarWidth: 'thin', scrollbarColor: `${c.borderStrong} transparent` }}>
              <WaveformCard />
              <SignalAssetTesting />
            </div>
          </div>
        </AgentBlock>

          </div>
        )}

        {/* Dynamic msgs from props */}
        {msgs.map(msg =>
          msg.role === 'user' ? (
            <UserBubble key={msg.id}>
              <M size={11} color={c.textSec} style={{ display: 'block' }}>{msg.text}</M>
            </UserBubble>
          ) : (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <M size={9} color={c.accent} upper bold style={{ display: 'block', letterSpacing: '0.1em' }}>Lanbow ›</M>
              <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderLeft: `2px solid ${c.accent}`, borderRadius: 8, padding: '12px 16px' }}>
                <M size={11} color={c.textSec} style={{ display: 'block', lineHeight: 1.75 }}>{msg.text}</M>
              </div>
            </div>
          )
        )}
        {typing && <TypingIndicator />}

        {/* Local conversation */}
        {localMsgs.map(msg =>
          msg.role === 'user'
            ? <LocalUserMsg key={msg.id} text={msg.text ?? ''} />
            : msg.chipKey
              ? <AgentBlock key={msg.id}>{CHIP_REPLIES[msg.chipKey]?.()}</AgentBlock>
              : <LocalAgentMsg key={msg.id} text={msg.text ?? ''} />
        )}
        {localTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* ── Reports panel ── */}
      {showReports && (
        <div style={{
          width: 580, flexShrink: 0,
          borderLeft: `1px solid ${c.border}`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'historySlideIn 0.22s cubic-bezier(.2,0,.2,1) both',
        }}>
          {/* Panel title bar */}
          <div style={{
            height: 36, flexShrink: 0,
            background: c.bgPanel,
            borderBottom: `1px solid ${c.border}`,
            display: 'flex', alignItems: 'center',
            padding: '0 14px', gap: 8,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
            <M size={9} color={c.accent} upper bold style={{ letterSpacing: '0.1em', flex: 1 }}>Reporting Engine</M>
            <button
              onClick={() => setShowReports(false)}
              style={{ background: 'none', border: 'none', color: c.textMute, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 4px', transition: 'color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = c.textPri; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = c.textMute; }}
            >×</button>
          </div>
          {/* Reports content scrollable */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <ReportsContent />
          </div>
        </div>
      )}

      </div>{/* end body row */}

      {/* ── Bottom input area ── */}
      <div style={{
        flexShrink: 0,
        padding: '10px 24px 20px',
        borderTop: `1px solid ${c.border}`,
        background: 'rgba(0,0,0,0.08)',
        backdropFilter: 'blur(8px)',
      }}>
        {(showPreset || showSetup || localMsgs.length > 0 || msgs.length > 0) && (
          <QuickSuggestions onSelect={handleChipSelect} usedChips={usedChips} />
        )}
        <AnimatedInputBar
          value={inputVal}
          onChange={setInputVal}
          focused={inputFocused}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onSend={sendMessage}
        />
        {/* Hint row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 7, alignItems: 'center' }}>
          <M size={8} color={c.textMute}>↵ to send</M>
          <div style={{ width: 1, height: 10, background: c.border }} />
          <M size={8} color={c.textMute}>/ for commands</M>
          <div style={{ width: 1, height: 10, background: c.border }} />
          <M size={8} color={c.textMute}>⇧↵ new line</M>
        </div>
      </div>
    </div>
  );
}
