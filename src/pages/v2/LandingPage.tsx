import React, { useState, useEffect, useRef } from 'react';
import { c } from './theme2';

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@700;800&display=swap');

  @keyframes lp_up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lp_fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lp_out {
    from { opacity: 1; }
    to   { opacity: 0; transform: scale(1.015); filter: blur(8px); }
  }
  @keyframes lp_scan {
    0%   { top: -1px; opacity: 0; }
    4%   { opacity: 1; }
    96%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes lp_scanGlow {
    from { top: -1px; }
    to   { top: 100%; }
  }
  @keyframes lp_ringBreath {
    0%, 100% { opacity: 0.045; }
    50%      { opacity: 0.075; }
  }
`;

// ── Particle grid ─────────────────────────────────────────────────────────────
function ParticleGrid({ glowRef }: { glowRef: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SPACING = 52;
    const PUSH_R  = 160;
    const PUSH_F  = 44;
    const SPRING  = 0.048;
    const DAMP    = 0.74;

    type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };
    let dots: Dot[] = [];

    const build = () => {
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

    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; build(); };
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
      const { x: mx, y: my } = mouse.current;
      for (const d of dots) {
        const dxm = d.x - mx, dym = d.y - my;
        const dm  = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < PUSH_R && dm > 0) {
          const t = 1 - dm / PUSH_R;
          const f = t * t * PUSH_F * 0.13;
          d.vx += (dxm / dm) * f;
          d.vy += (dym / dm) * f;
        }
        d.vx += (d.hx - d.x) * SPRING;
        d.vy += (d.hy - d.y) * SPRING;
        d.vx *= DAMP; d.vy *= DAMP;
        d.x  += d.vx; d.y  += d.vy;

        const dxh  = d.x - d.hx, dyh = d.y - d.hy;
        const disp = Math.min(Math.sqrt(dxh * dxh + dyh * dyh) / (PUSH_F * 0.7), 1);
        const prox = dm < PUSH_R * 1.1 ? (1 - dm / (PUSH_R * 1.1)) : 0;
        const alpha = 0.06 + disp * 0.40 + prox * 0.28;
        const rad   = 0.9  + disp * 1.3  + prox * 0.9;

        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.min(rad, 2.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,177,162,${Math.min(alpha, 0.80)})`;
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

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

// ── Scan-line ─────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1, zIndex: 30,
        background: `linear-gradient(90deg,transparent 0%,${c.accent} 25%,rgba(255,255,255,0.85) 50%,${c.accent} 75%,transparent 100%)`,
        animation: 'lp_scan 0.8s cubic-bezier(.38,0,.62,1) forwards',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 60, zIndex: 29,
        background: `linear-gradient(180deg,rgba(0,177,162,0.05) 0%,transparent 100%)`,
        animation: 'lp_scanGlow 0.8s cubic-bezier(.38,0,.62,1) forwards',
        pointerEvents: 'none',
      }} />
    </>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [ready,    setReady]    = useState(false);
  const [exiting,  setExiting]  = useState(false);
  const [showScan, setShowScan] = useState(true);
  const [hovBtn,   setHovBtn]   = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setShowScan(false), 820);
    const t1 = setTimeout(() => setReady(true),     560);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, []);

  const enter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: c.bgBase,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      animation: exiting ? 'lp_out 0.5s ease forwards' : undefined,
    }}>
      <style>{KEYFRAMES}</style>

      {/* ── Ambient radial bloom ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(0,177,162,0.055) 0%, transparent 70%)',
      }} />

      {/* ── Particle grid ── */}
      <ParticleGrid glowRef={glowRef} />

      {/* ── Cursor follow glow ── */}
      <div ref={glowRef} style={{
        position: 'absolute', zIndex: 1, pointerEvents: 'none',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,177,162,0.08) 0%, rgba(0,177,162,0.02) 50%, transparent 72%)',
        transform: 'translate(-50%,-50%)',
        opacity: 0, transition: 'opacity 0.5s ease',
      }} />

      {/* ── Two faint concentric rings — purely decorative ── */}
      {ready && (
        <>
          <div style={{
            position: 'absolute', zIndex: 1, pointerEvents: 'none',
            width: 560, height: 560, borderRadius: '50%',
            border: '1px solid rgba(0,177,162,0.06)',
            animation: 'lp_fadeIn 1.8s ease both, lp_ringBreath 6s ease-in-out 2s infinite',
          }} />
          <div style={{
            position: 'absolute', zIndex: 1, pointerEvents: 'none',
            width: 380, height: 380, borderRadius: '50%',
            border: '1px solid rgba(0,177,162,0.08)',
            animation: 'lp_fadeIn 1.4s ease both, lp_ringBreath 6s ease-in-out 2.8s infinite',
          }} />
        </>
      )}

      {/* ── Scan-line ── */}
      {showScan && <ScanLine />}

      {/* ── Content ── */}
      {ready && (
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
        }}>

          {/* Logo */}
          <img
            src="/lanbow-logo-light.png"
            alt="LANBOW"
            style={{
              height: 14, width: 'auto', display: 'block',
              opacity: 0.7, marginBottom: 52,
              animation: 'lp_up 0.7s cubic-bezier(.16,1,.3,1) both',
              animationDelay: '0ms',
            }}
          />

          {/* Headline */}
          <h1 style={{
            margin: 0,
            fontFamily: "'Abhaya Libre', Georgia, serif",
            fontSize: 72, lineHeight: 1.0, fontWeight: 800,
            color: c.accent,
            letterSpacing: '-0.02em',
            animation: 'lp_up 0.8s cubic-bezier(.16,1,.3,1) both',
            animationDelay: '80ms',
            marginBottom: 22,
          }}>
            Advertising is investing.
          </h1>

          {/* Tagline */}
          <p style={{
            margin: 0,
            fontFamily: c.mono, fontSize: 9, fontWeight: 400,
            color: c.textMute, letterSpacing: '0.20em',
            textTransform: 'uppercase',
            animation: 'lp_up 0.7s cubic-bezier(.16,1,.3,1) both',
            animationDelay: '180ms',
            marginBottom: 52,
          }}>
            Enterprise Growth Decision System
          </p>

          {/* CTA */}
          <div style={{
            animation: 'lp_up 0.7s cubic-bezier(.16,1,.3,1) both',
            animationDelay: '280ms',
          }}>
            <button
              onClick={enter}
              onMouseEnter={() => setHovBtn(true)}
              onMouseLeave={() => setHovBtn(false)}
              style={{
                fontFamily: c.mono, fontSize: 9,
                padding: '12px 36px',
                background: hovBtn ? c.accent : 'transparent',
                color:      hovBtn ? c.bgBase  : c.accent,
                border: `1px solid rgba(0,177,162,${hovBtn ? '0' : '0.35'})`,
                borderRadius: 5, cursor: 'pointer',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.22s, color 0.22s, border-color 0.22s, transform 0.18s',
                transform: hovBtn ? 'translateY(-1px)' : 'none',
              }}
            >
              Enter Workspace
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
