import React, { useState, useEffect } from 'react';
import { c } from './theme2';

const KEYFRAMES = `
  @keyframes tourOverlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes tourTooltipIn {
    from { opacity: 0; transform: translateX(-10px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0)    scale(1);     }
  }
  @keyframes tourSpotIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes tourRingPulse {
    0%   { box-shadow: 0 0 0 0   rgba(0,177,162,0.55), 0 0 0 9999px rgba(4,12,10,0.8); }
    60%  { box-shadow: 0 0 0 8px rgba(0,177,162,0),    0 0 0 9999px rgba(4,12,10,0.8); }
    100% { box-shadow: 0 0 0 0   rgba(0,177,162,0),    0 0 0 9999px rgba(4,12,10,0.8); }
  }
  @keyframes tourArrowBounce {
    0%, 100% { transform: translateX(0); }
    50%      { transform: translateX(4px); }
  }
`;

interface TourStep {
  selector?: string;
  title: string;
  description: string;
  tag?: string;
  side: 'right' | 'bottom' | 'center';
  pad?: number;
}

const STEPS: TourStep[] = [
  {
    title: 'Welcome to LANBOW',
    description:
      'Your AI-powered enterprise growth system for independent publishers. ' +
      'I\'ll walk you through the key features in a few quick steps.',
    tag: 'INTRO',
    side: 'center',
  },
  {
    selector: '[data-tour="chat"]',
    title: 'Lanbow AI',
    description:
      'Your intelligent growth partner. Ask questions, request campaign reports, ' +
      'or trigger ad actions — Lanbow handles execution end-to-end.',
    tag: 'AI AGENT',
    side: 'right',
    pad: 10,
  },
  {
    selector: '[data-tour="campaigns"]',
    title: 'Campaign Management',
    description:
      'Monitor 5 Meta Ads campaigns across 74 ad sets in real time. ' +
      'Upload assets, track ROAS, and manage bids from a single view.',
    tag: 'CAMPAIGNS',
    side: 'right',
    pad: 10,
  },
  {
    selector: '[data-tour="dashboard"]',
    title: 'Campaign Monitor',
    description:
      'Full analytics dashboard: ROAS benchmarks, threshold alerts, system health, ' +
      'audience distribution by geo, and live ad signal analysis.',
    tag: 'DASHBOARD',
    side: 'right',
    pad: 10,
  },
  {
    selector: '[data-tour="creative"]',
    title: 'Creative Studio',
    description:
      'Bulk-upload ad creatives with automatic format validation and processing. ' +
      'Assign assets to campaigns and track upload progress in real time.',
    tag: 'CREATIVE',
    side: 'right',
    pad: 10,
  },
];

interface Rect { x: number; y: number; w: number; h: number; }

// ── Spotlight ─────────────────────────────────────────────────────────────────
function Spotlight({ rect, animate }: { rect: Rect; animate: boolean }) {
  return (
    <div style={{
      position: 'fixed',
      left: rect.x, top: rect.y,
      width: rect.w, height: rect.h,
      borderRadius: 10,
      background: 'transparent',
      border: `1.5px solid rgba(0,177,162,0.65)`,
      zIndex: 9001,
      pointerEvents: 'none',
      animation: animate
        ? `tourSpotIn 0.28s ease both, tourRingPulse 2s ease 0.28s infinite`
        : `tourRingPulse 2s ease infinite`,
      transition: 'left 0.32s cubic-bezier(.4,0,.2,1), top 0.32s cubic-bezier(.4,0,.2,1), width 0.32s, height 0.32s',
    }} />
  );
}

// ── Tooltip card ──────────────────────────────────────────────────────────────
function TooltipCard({
  step, total, current,
  onPrev, onNext, onSkip,
  style,
}: {
  step: number; total: number; current: TourStep;
  onPrev: () => void; onNext: () => void; onSkip: () => void;
  style?: React.CSSProperties;
}) {
  const isLast  = step === total - 1;
  const isFirst = step === 0;

  return (
    <div style={{
      position: 'fixed', zIndex: 9002, width: 310,
      animation: `tourTooltipIn 0.28s cubic-bezier(.2,0,.2,1) both`,
      ...style,
    }}>
      {/* Arrow (right-pointing) */}
      {current.side === 'right' && (
        <div style={{
          position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '7px solid transparent',
          borderBottom: '7px solid transparent',
          borderRight: `10px solid ${c.bgCard}`,
          filter: 'drop-shadow(-2px 0 4px rgba(0,0,0,0.4))',
          animation: 'tourArrowBounce 1.8s ease-in-out infinite',
        }} />
      )}

      <div style={{
        background: c.bgCard,
        border: `1px solid ${c.borderStrong}`,
        borderRadius: 12,
        padding: '20px 22px',
        boxShadow: `0 24px 64px rgba(0,0,0,0.72), 0 0 0 1px rgba(0,177,162,0.14), 0 0 32px rgba(0,177,162,0.06)`,
      }}>
        {/* Header: tag + step count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {current.tag ? (
            <span style={{
              fontFamily: c.mono, fontSize: 8, color: c.accent,
              background: 'rgba(0,177,162,0.1)',
              border: `1px solid rgba(0,177,162,0.25)`,
              borderRadius: 4, padding: '3px 8px', letterSpacing: '0.1em',
            }}>{current.tag}</span>
          ) : <span />}
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, letterSpacing: '0.05em' }}>
            {step + 1} / {total}
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              height: 3, borderRadius: 2,
              width: i === step ? 20 : 5,
              background: i === step ? c.accent : i < step ? 'rgba(0,177,162,0.38)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: c.mono, fontSize: 14, color: c.accent,
          marginBottom: 10, letterSpacing: '0.03em',
          textShadow: `0 0 16px rgba(0,177,162,0.35)`,
        }}>
          {current.title}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: c.mono, fontSize: 10.5, color: c.textSec,
          lineHeight: 1.75, marginBottom: 22,
        }}>
          {current.description}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onSkip} style={{
            fontFamily: c.mono, fontSize: 9, background: 'transparent', border: 'none',
            color: c.textMute, cursor: 'pointer', letterSpacing: '0.06em', padding: '6px 0',
          }}>
            SKIP TOUR
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button onClick={onPrev} style={{
                fontFamily: c.mono, fontSize: 9,
                background: 'transparent', border: `1px solid ${c.border}`,
                borderRadius: 6, color: c.textSec, cursor: 'pointer',
                padding: '8px 14px', letterSpacing: '0.07em',
                transition: 'border-color 0.15s',
              }}>
                ← PREV
              </button>
            )}
            <button onClick={onNext} style={{
              fontFamily: c.mono, fontSize: 9,
              background: c.accent, border: 'none',
              borderRadius: 6, color: c.bgBase, cursor: 'pointer',
              padding: '8px 18px', letterSpacing: '0.09em',
              boxShadow: `0 0 16px rgba(0,177,162,0.35)`,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'box-shadow 0.15s',
            }}>
              {isLast ? 'GET STARTED' : 'NEXT'}
              {!isLast && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── OnboardingTour ────────────────────────────────────────────────────────────
export function OnboardingTour({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete: () => void;
}) {
  const [step, setStep]         = useState(0);
  const [spotRect, setSpotRect] = useState<Rect | null>(null);
  const [fresh, setFresh]       = useState(true); // fresh = first time spotlighting this step

  const current = STEPS[step];

  // Query element position whenever step changes
  useEffect(() => {
    if (!isActive || !current.selector) { setSpotRect(null); return; }
    setFresh(true);

    const query = () => {
      const el = document.querySelector(current.selector!);
      if (!el) return;
      const r   = el.getBoundingClientRect();
      const pad = current.pad ?? 8;
      setSpotRect({ x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 });
      // After first paint, allow CSS transition
      requestAnimationFrame(() => setFresh(false));
    };
    // Small delay so page has settled after navigation
    const t = setTimeout(query, 60);
    return () => clearTimeout(t);
  }, [step, isActive, current.selector, current.pad]);

  const advance = (delta: number) => {
    const next = step + delta;
    if (next < 0) return;
    if (next >= STEPS.length) { onComplete(); return; }
    setStep(next);
  };

  if (!isActive) return null;

  // ── Tooltip position ──
  const getTooltipStyle = (): React.CSSProperties => {
    if (current.side === 'center' || !spotRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    if (current.side === 'right') {
      return {
        left: spotRect.x + spotRect.w + 22,
        top: Math.max(16, spotRect.y + spotRect.h / 2 - 160),
      };
    }
    if (current.side === 'bottom') {
      return { left: spotRect.x, top: spotRect.y + spotRect.h + 20 };
    }
    return { left: spotRect.x - 330, top: spotRect.y + spotRect.h / 2 - 80 };
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      animation: `tourOverlayIn 0.3s ease both`,
      pointerEvents: 'none',
    }}>
      <style>{KEYFRAMES}</style>

      {/* Dark overlay — rendered only when no spotlight (center step) */}
      {!spotRect && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4,12,10,0.82)',
          backdropFilter: 'blur(3px)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Spotlight (handles its own dimming via box-shadow) */}
      {spotRect && <Spotlight rect={spotRect} animate={fresh} />}

      {/* Tooltip */}
      <div style={{ pointerEvents: 'all' }}>
        <TooltipCard
          step={step} total={STEPS.length} current={current}
          onPrev={() => advance(-1)}
          onNext={() => advance(1)}
          onSkip={onComplete}
          style={getTooltipStyle()}
        />
      </div>
    </div>
  );
}
