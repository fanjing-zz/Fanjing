import React, { useState, useEffect, useRef } from 'react';
import { c } from './theme2';

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;500;600;700;800&display=swap');

  @keyframes lp_fadeUp {
    from { opacity: 0; transform: translateY(18px); filter: blur(5px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
  }
  @keyframes lp_fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lp_pageOut {
    from { opacity: 1; filter: blur(0);   transform: scale(1);    }
    to   { opacity: 0; filter: blur(12px); transform: scale(1.02); }
  }
  @keyframes lp_scan {
    0%   { top: -2px; opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes lp_scanGlow {
    0%   { top: -2px; }
    100% { top: 100%; }
  }
  @keyframes lp_ringIn {
    from { opacity: 0; transform: scale(0.82); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lp_centerPulse {
    0%, 100% { opacity: 0.75; }
    50%      { opacity: 1; }
  }
  @keyframes lp_statusBlink {
    0%, 85%, 100% { opacity: 1; }
    91% { opacity: 0.12; }
  }
  @keyframes lp_ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes lp_tickerIn {
    from { opacity: 0; transform: translateY(100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lp_hudIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── Spring dot-grid background ────────────────────────────────────────────────
function ParticleBackground({ glowRef }: { glowRef: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SPACING = 44;
    const PUSH_R  = 180;
    const PUSH_F  = 52;
    const SPRING  = 0.055;
    const DAMP    = 0.76;

    type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; };
    let dots: Dot[] = [];

    const buildGrid = () => {
      dots = [];
      const cols = Math.ceil(canvas.width  / SPACING) + 2;
      const rows = Math.ceil(canvas.height / SPACING) + 2;
      const ox   = (canvas.width  - (cols - 1) * SPACING) / 2;
      const oy   = (canvas.height - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++)
        for (let col = 0; col < cols; col++) {
          const hx = ox + col * SPACING, hy = oy + r * SPACING;
          dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
        }
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      buildGrid();
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (glowRef.current) {
        glowRef.current.style.left    = `${e.clientX}px`;
        glowRef.current.style.top     = `${e.clientY}px`;
        glowRef.current.style.opacity = '1';
      }
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.current.x, my = mouse.current.y;
      for (const d of dots) {
        const dxm = d.x - mx, dym = d.y - my;
        const dm  = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < PUSH_R && dm > 0) {
          const t = 1 - dm / PUSH_R;
          const f = t * t * PUSH_F * 0.14;
          d.vx += (dxm / dm) * f;
          d.vy += (dym / dm) * f;
        }
        d.vx += (d.hx - d.x) * SPRING;
        d.vy += (d.hy - d.y) * SPRING;
        d.vx *= DAMP; d.vy *= DAMP;
        d.x  += d.vx; d.y  += d.vy;

        const dxh  = d.x - d.hx, dyh = d.y - d.hy;
        const disp = Math.min(Math.sqrt(dxh * dxh + dyh * dyh) / (PUSH_F * 0.7), 1);
        const prox = dm < PUSH_R * 1.2 ? (1 - dm / (PUSH_R * 1.2)) : 0;
        const alpha = 0.08 + disp * 0.52 + prox * 0.32;
        const rad   = 1    + disp * 1.5  + prox * 1.1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.min(rad, 3.0), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,177,162,${Math.min(alpha, 0.85)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [glowRef]);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
    }} />
  );
}

// ── Scan-line intro ───────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1, zIndex: 20,
        background: `linear-gradient(90deg, transparent 0%, ${c.accent} 20%, rgba(255,255,255,0.9) 50%, ${c.accent} 80%, transparent 100%)`,
        boxShadow: `0 0 12px 2px ${c.accent}`,
        animation: 'lp_scan 0.75s cubic-bezier(.4,0,.6,1) forwards',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 80, zIndex: 19,
        background: `linear-gradient(180deg, rgba(0,177,162,0.07) 0%, transparent 100%)`,
        animation: 'lp_scanGlow 0.75s cubic-bezier(.4,0,.6,1) forwards',
        pointerEvents: 'none',
      }} />
    </>
  );
}

// ── Orbital Orrery ─────────────────────────────────────────────────────────────
// SVG size: 300×300 — center at (150, 150)
const CX = 150, CY = 150;

function OrbitalOrrery({ visible }: { visible: boolean }) {
  return (
    <div style={{
      width: 300, height: 300, flexShrink: 0,
      opacity: visible ? 1 : 0,
      animation: visible ? 'lp_ringIn 1.1s cubic-bezier(.2,0,.2,1) both' : undefined,
    }}>
      <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
        <defs>
          {/* Soft glow filter for dots */}
          <filter id="lp_glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Stronger center glow */}
          <filter id="lp_glow2" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Center radial glow */}
          <radialGradient id="lp_centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00B1A2" stopOpacity="0.5"/>
            <stop offset="45%"  stopColor="#00B1A2" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#00B1A2" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* ── Static boundary ring (no rotation) ── */}
        <circle cx={CX} cy={CY} r={136}
          fill="none" stroke="#00B1A2" strokeWidth="0.4"
          strokeDasharray="1 7" opacity={0.10}
        />
        {/* Tick marks at N/E/S/W on boundary ring */}
        {[[CX, CY-136],[CX+136,CY],[CX,CY+136],[CX-136,CY]].map(([tx,ty],i) => (
          <line key={i}
            x1={tx} y1={ty}
            x2={tx + (i===1?4:i===3?-4:0)}
            y2={ty + (i===0?-4:i===2?4:0)}
            stroke="#00B1A2" strokeWidth="0.6" opacity={0.22}
          />
        ))}

        {/* ── Ring 1: outermost, CW slow ── */}
        <g>
          {/* Ring arc */}
          <circle cx={CX} cy={CY} r={110}
            fill="none" stroke="#00B1A2" strokeWidth="0.5"
            strokeDasharray="5 9" opacity={0.14}>
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="360 150 150" dur="88s" repeatCount="indefinite"/>
          </circle>
          {/* Orbit dot */}
          <circle cx={CX} cy={CY-110} r={2.8} fill="#00B1A2" opacity={0.5}
            filter="url(#lp_glow)">
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="360 150 150" dur="88s" repeatCount="indefinite"/>
          </circle>
          {/* Second dim dot, offset 200° */}
          <circle cx={CX} cy={CY-110} r={1.8} fill="#00B1A2" opacity={0.25}
            filter="url(#lp_glow)">
            <animateTransform attributeName="transform" type="rotate"
              from="200 150 150" to="560 150 150" dur="88s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* ── Ring 2: mid, CCW medium ── */}
        <g>
          <circle cx={CX} cy={CY} r={80}
            fill="none" stroke="#00B1A2" strokeWidth="0.6"
            strokeDasharray="3 7" opacity={0.20}>
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="-360 150 150" dur="58s" repeatCount="indefinite"/>
          </circle>
          {/* Primary dot */}
          <circle cx={CX} cy={CY-80} r={3.2} fill="#00B1A2" opacity={0.70}
            filter="url(#lp_glow)">
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="-360 150 150" dur="58s" repeatCount="indefinite"/>
          </circle>
          {/* Secondary dot, offset 145° */}
          <circle cx={CX} cy={CY-80} r={2.2} fill="#00B1A2" opacity={0.35}
            filter="url(#lp_glow)">
            <animateTransform attributeName="transform" type="rotate"
              from="145 150 150" to="-215 150 150" dur="58s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* ── Ring 3: inner, CW fast ── */}
        <g>
          <circle cx={CX} cy={CY} r={50}
            fill="none" stroke="#00B1A2" strokeWidth="0.8" opacity={0.28}>
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="360 150 150" dur="36s" repeatCount="indefinite"/>
          </circle>
          {/* Bright fast dot */}
          <circle cx={CX} cy={CY-50} r={4} fill="#00B1A2" opacity={0.90}
            filter="url(#lp_glow)">
            <animateTransform attributeName="transform" type="rotate"
              from="0 150 150" to="360 150 150" dur="36s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* ── Center glow halo ── */}
        <circle cx={CX} cy={CY} r={30} fill="url(#lp_centerGrad)">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.2s" repeatCount="indefinite"/>
        </circle>

        {/* ── Center crosshairs ── */}
        {[[-22,-8],[-8,-22],[8,-22],[22,-8],[22,8],[8,22],[-8,22],[-22,8]].map(([dx,dy],i) =>
          i % 2 === 0 ? null : (
            <line key={i}
              x1={CX + (dx > 0 ? 9 : -9)} y1={CY + (dy > 0 ? 9 : -9)}
              x2={CX + dx} y2={CY + dy}
              stroke="#00B1A2" strokeWidth="0.5" opacity={0.30}
            />
          )
        )}
        <line x1={CX-20} y1={CY} x2={CX-9} y2={CY} stroke="#00B1A2" strokeWidth="0.5" opacity={0.28}/>
        <line x1={CX+9}  y1={CY} x2={CX+20} y2={CY} stroke="#00B1A2" strokeWidth="0.5" opacity={0.28}/>
        <line x1={CX} y1={CY-20} x2={CX} y2={CY-9}  stroke="#00B1A2" strokeWidth="0.5" opacity={0.28}/>
        <line x1={CX} y1={CY+9}  x2={CX} y2={CY+20} stroke="#00B1A2" strokeWidth="0.5" opacity={0.28}/>

        {/* ── Center point ── */}
        <circle cx={CX} cy={CY} r={5} fill="#00B1A2" opacity={0.85}
          filter="url(#lp_glow2)">
          <animate attributeName="opacity" values="0.75;1;0.75" dur="2.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx={CX} cy={CY} r={2.2} fill="rgba(255,255,255,0.95)"/>
      </svg>
    </div>
  );
}

// ── HUD corner element ─────────────────────────────────────────────────────────
function HudCorner({ pos, lines, delay = 0 }: {
  pos: 'tl'|'tr'|'bl'|'br';
  lines: { text: string; bright?: boolean }[];
  delay?: number;
}) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute', zIndex: 10,
    display: 'flex', flexDirection: 'column', gap: 5,
    animation: `lp_hudIn 0.5s cubic-bezier(.2,0,.2,1) ${delay}ms both`,
  };
  const positioned: Record<string, React.CSSProperties> = {
    tl: { top: 28,    left: 32  },
    tr: { top: 28,    right: 32, alignItems: 'flex-end' },
    bl: { bottom: 46, left: 32  },
    br: { bottom: 46, right: 32, alignItems: 'flex-end' },
  };
  return (
    <div style={{ ...baseStyle, ...positioned[pos] }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {ln.bright && (
            <div style={{
              width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
              background: '#00CC77',
              animation: 'lp_statusBlink 4s ease infinite',
            }}/>
          )}
          <span style={{
            fontFamily: c.mono, fontSize: 8, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: ln.bright ? '#00CC77' : c.textMute,
          }}>{ln.text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Divider line ──────────────────────────────────────────────────────────────
function Divider({ delay = 0 }: { delay?: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      width: 360,
      animation: `lp_fadeIn 0.7s ease ${delay}ms both`,
    }}>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(0,177,162,0.22), transparent)`,
      }}/>
      <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(0,177,162,0.4)' }}/>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(0,177,162,0.22), transparent)`,
      }}/>
    </div>
  );
}

// ── Bottom data ticker ────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'System Status: Operational',
  'Meta Ads · Connected',
  'Pixel Dataset · Synced',
  'Analytics Engine · Active',
  'ROAS Tracking · Enabled',
  '5 Active Ad Nodes',
  'Last Sync: 2m ago',
  'Engine: Lanbow AI Command V4.2.1',
  'Build: 2025.01',
];

function BottomTicker({ visible }: { visible: boolean }) {
  const text = TICKER_ITEMS.join('  ·  ');
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 30,
      zIndex: 10, overflow: 'hidden',
      borderTop: `1px solid rgba(0,177,162,0.07)`,
      background: 'rgba(7,16,21,0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center',
      opacity: visible ? 1 : 0,
      animation: visible ? 'lp_tickerIn 0.5s ease both' : undefined,
    }}>
      {/* Separator left */}
      <div style={{
        width: 1, height: 14, flexShrink: 0, marginLeft: 18,
        background: 'rgba(0,177,162,0.2)',
      }}/>
      <div style={{ width: 6 }}/>
      {/* Scrolling text */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex', whiteSpace: 'nowrap',
          animation: 'lp_ticker 40s linear infinite',
        }}>
          {[0, 1].map(i => (
            <span key={i} style={{
              fontFamily: c.mono, fontSize: 8, color: c.textMute,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              paddingRight: 80,
            }}>
              {text}
            </span>
          ))}
        </div>
      </div>
      {/* Separator right */}
      <div style={{ width: 6 }}/>
      <div style={{
        width: 1, height: 14, flexShrink: 0, marginRight: 18,
        background: 'rgba(0,177,162,0.2)',
      }}/>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export function LandingPage({ onEnter }: { onEnter: () => void }) {
  // phase 0 = initial dark, 1 = rings appear, 2 = text content, 3 = hud + ticker
  const [phase,      setPhase]      = useState(0);
  const [exiting,    setExiting]    = useState(false);
  const [hoverBtn,   setHoverBtn]   = useState(false);
  const [showScan,   setShowScan]   = useState(true);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setShowScan(false), 750);
    const t1 = setTimeout(() => setPhase(1), 480);
    const t2 = setTimeout(() => setPhase(2), 820);
    const t3 = setTimeout(() => setPhase(3), 1520);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 520);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: c.bgBase,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      animation: exiting ? 'lp_pageOut 0.52s ease forwards' : undefined,
    }}>
      <style>{KEYFRAMES}</style>

      {/* ── Deep radial focal glow ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 55% at 50% 42%,
            rgba(0,177,162,0.065) 0%,
            rgba(0,177,162,0.02) 50%,
            transparent 75%
          )
        `,
      }}/>

      {/* ── Spring dot grid ── */}
      <ParticleBackground glowRef={glowRef} />

      {/* ── Cursor ambient glow ── */}
      <div ref={glowRef} style={{
        position: 'absolute', zIndex: 1, pointerEvents: 'none',
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,177,162,0.11) 0%, rgba(0,177,162,0.03) 45%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        opacity: 0, transition: 'opacity 0.4s ease',
      }}/>

      {/* ── Scanline opening ── */}
      {showScan && <ScanLine />}

      {/* ── HUD Corners ── */}
      {phase >= 3 && (
        <>
          <HudCorner pos="tl" delay={0} lines={[
            { text: 'Lanbow Enterprise · V1' },
            { text: 'Build 2025.01' },
          ]}/>
          <HudCorner pos="tr" delay={60} lines={[
            { text: 'Systems Operational', bright: true },
            { text: '5 Active Nodes' },
          ]}/>
          <HudCorner pos="bl" delay={120} lines={[
            { text: 'Engine: AI Command V4.2.1' },
          ]}/>
          <HudCorner pos="br" delay={80} lines={[
            { text: 'Last Sync: 2m ago' },
          ]}/>
        </>
      )}

      {/* ── Centered composition ── */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 0,
      }}>

        {/* Orbital orrery */}
        <OrbitalOrrery visible={phase >= 1} />

        {/* Spacer */}
        <div style={{ height: 20 }}/>

        {/* Divider */}
        {phase >= 2 && <Divider delay={0} />}

        {/* Spacer */}
        <div style={{ height: 26 }}/>

        {/* Logo */}
        {phase >= 2 && (
          <img
            src="/lanbow-logo-light.png"
            alt="LANBOW"
            style={{
              height: 17, width: 'auto', display: 'block',
              marginBottom: 24, opacity: 0.88,
              animation: 'lp_fadeUp 0.55s cubic-bezier(.2,0,.2,1) both',
              animationDelay: '0ms',
            }}
          />
        )}

        {/* Headline */}
        {phase >= 2 && (
          <div style={{
            fontFamily: "'Abhaya Libre', Georgia, serif",
            fontSize: 62, lineHeight: 1.05, fontWeight: 700,
            color: '#00B1A2', letterSpacing: '-0.01em',
            textAlign: 'center',
            animation: 'lp_fadeUp 0.6s cubic-bezier(.2,0,.2,1) both',
            animationDelay: '100ms',
            marginBottom: 14,
          }}>
            Advertising is investing.
          </div>
        )}

        {/* Tagline */}
        {phase >= 2 && (
          <div style={{
            fontFamily: c.mono, fontSize: 9.5,
            color: c.textSec, letterSpacing: '0.15em',
            textTransform: 'uppercase', textAlign: 'center',
            animation: 'lp_fadeUp 0.55s cubic-bezier(.2,0,.2,1) both',
            animationDelay: '210ms',
            marginBottom: 36,
          }}>
            Enterprise Growth Decision System
          </div>
        )}

        {/* Enter button */}
        {phase >= 2 && (
          <div style={{
            animation: 'lp_fadeUp 0.55s cubic-bezier(.2,0,.2,1) both',
            animationDelay: '330ms',
          }}>
            <button
              onClick={handleEnter}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                fontFamily: c.mono, fontSize: 10,
                padding: '13px 42px',
                background: hoverBtn ? '#00c8b6' : '#00B1A2',
                color: c.bgBase, border: 'none',
                borderRadius: 7, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.18em',
                boxShadow: hoverBtn
                  ? `0 0 44px rgba(0,177,162,0.6), 0 0 88px rgba(0,177,162,0.18)`
                  : `0 0 22px rgba(0,177,162,0.32)`,
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.15s, box-shadow 0.22s, transform 0.15s',
                transform: hoverBtn ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              Enter Workspace
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        )}

      </div>

      {/* ── Bottom ticker ── */}
      <BottomTicker visible={phase >= 3} />

    </div>
  );
}
