import React, { useState, useEffect, useRef } from 'react';
import { c } from './theme2';

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;500;600;700;800&display=swap');

  @keyframes lp_fadeUp {
    from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
  }
  @keyframes lp_pageOut {
    from { opacity: 1; filter: blur(0);  }
    to   { opacity: 0; filter: blur(8px); transform: scale(1.01); }
  }
  @keyframes lp_scan {
    0%   { top: -2px; opacity: 0;   }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 100%;  opacity: 0;  }
  }
  @keyframes lp_scanGlow {
    0%   { top: -2px; }
    100% { top: 100%; }
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
    const PUSH_R  = 180;   // repulsion radius
    const PUSH_F  = 52;    // max displacement
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
        for (let c = 0; c < cols; c++) {
          const hx = ox + c * SPACING, hy = oy + r * SPACING;
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
        // Mouse repulsion
        const dxm = d.x - mx, dym = d.y - my;
        const dm  = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < PUSH_R && dm > 0) {
          const t = 1 - dm / PUSH_R;
          const f = t * t * PUSH_F * 0.14;
          d.vx += (dxm / dm) * f;
          d.vy += (dym / dm) * f;
        }
        // Spring → home
        d.vx += (d.hx - d.x) * SPRING;
        d.vy += (d.hy - d.y) * SPRING;
        // Dampen + integrate
        d.vx *= DAMP; d.vy *= DAMP;
        d.x  += d.vx; d.y  += d.vy;

        // Visual: displacement amount drives brightness
        const dxh  = d.x - d.hx, dyh = d.y - d.hy;
        const disp = Math.min(Math.sqrt(dxh * dxh + dyh * dyh) / (PUSH_F * 0.7), 1);
        // Mouse proximity adds extra glow
        const prox = dm < PUSH_R * 1.2 ? (1 - dm / (PUSH_R * 1.2)) : 0;

        const alpha = 0.1 + disp * 0.55 + prox * 0.35;
        const rad   = 1   + disp * 1.6  + prox * 1.2;

        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.min(rad, 3.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,177,162,${Math.min(alpha, 0.9)})`;
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
      {/* thin bright line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1, zIndex: 20,
        background: `linear-gradient(90deg, transparent 0%, ${c.accent} 20%, rgba(255,255,255,0.9) 50%, ${c.accent} 80%, transparent 100%)`,
        boxShadow: `0 0 12px 2px ${c.accent}`,
        animation: 'lp_scan 0.75s cubic-bezier(.4,0,.6,1) forwards',
        pointerEvents: 'none',
      }} />
      {/* diffuse glow trail */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 80, zIndex: 19,
        background: `linear-gradient(180deg, rgba(0,177,162,0.06) 0%, transparent 100%)`,
        animation: 'lp_scanGlow 0.75s cubic-bezier(.4,0,.6,1) forwards',
        pointerEvents: 'none',
      }} />
    </>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [exiting, setExiting]   = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [showScan, setShowScan]         = useState(true);
  const [showContent, setShowContent]   = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  // Sequence: scan line plays → content appears
  useEffect(() => {
    const t1 = setTimeout(() => setShowScan(false),   750);
    const t2 = setTimeout(() => setShowContent(true), 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 480);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: c.bgBase,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      animation: exiting ? 'lp_pageOut 0.48s ease forwards' : undefined,
    }}>
      <style>{KEYFRAMES}</style>

      {/* Spring dot-grid */}
      <ParticleBackground glowRef={glowRef} />

      {/* Cursor ambient glow — updated directly via ref, no re-renders */}
      <div ref={glowRef} style={{
        position: 'absolute', zIndex: 1, pointerEvents: 'none',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,177,162,0.09) 0%, rgba(0,177,162,0.03) 40%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        opacity: 0, transition: 'opacity 0.4s ease',
      }} />

      {/* Scan-line opening */}
      {showScan && <ScanLine />}

      {/* ── Centered content ── */}
      {showContent && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 0, zIndex: 2, width: 480,
        }}>

          {/* Logo */}
          <img
            src="/lanbow-logo.png"
            alt="LANBOW"
            style={{
              height: 32, width: 'auto', marginBottom: 32,
              opacity: 0.9, display: 'block',
              animation: 'lp_fadeUp 0.55s cubic-bezier(.2,0,.2,1) both',
              animationDelay: '0ms',
            }}
          />

          {/* Slogan */}
          <div style={{
            fontFamily: "'Abhaya Libre', Georgia, serif",
            fontSize: 68, lineHeight: 1.05, fontWeight: 700,
            color: '#00B1A2', letterSpacing: '-0.01em',
            textAlign: 'center', marginBottom: 52, whiteSpace: 'nowrap',
            animation: 'lp_fadeUp 0.6s cubic-bezier(.2,0,.2,1) both',
            animationDelay: '160ms',
          }}>
            Advertising is investing.
          </div>

          {/* Enter button */}
          <div style={{
            animation: 'lp_fadeUp 0.55s cubic-bezier(.2,0,.2,1) both',
            animationDelay: '320ms',
          }}>
            <button
              onClick={handleEnter}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                fontFamily: c.mono, fontSize: 11,
                padding: '14px 44px',
                background: hoverBtn ? '#00c8b6' : '#00B1A2',
                color: c.bgBase, border: 'none',
                borderRadius: 8, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.18em',
                boxShadow: hoverBtn
                  ? `0 0 40px rgba(0,177,162,0.6), 0 0 80px rgba(0,177,162,0.2)`
                  : `0 0 24px rgba(0,177,162,0.35)`,
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.15s, box-shadow 0.2s, transform 0.15s',
                transform: hoverBtn ? 'translateY(-1px)' : 'translateY(0)',
              }}
            >
              Enter Workspace
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
