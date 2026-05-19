import React, { useState } from 'react';
import { c } from './theme2';

// ─── Micro helpers ────────────────────────────────────────────────────────────
const Mono = ({ children, size = 11, color = c.textSec, upper = false, bold = false, style }: {
  children: React.ReactNode; size?: number; color?: string;
  upper?: boolean; bold?: boolean; style?: React.CSSProperties;
}) => (
  <span style={{
    fontFamily: c.mono, fontSize: size, color,
    fontWeight: bold ? 700 : 400,
    textTransform: upper ? 'uppercase' : undefined,
    letterSpacing: upper ? '0.1em' : '0.05em',
    lineHeight: 1.5, ...style,
  }}>{children}</span>
);

const Tag = ({ text, color = c.accent }: { text: string; color?: string }) => (
  <span style={{
    fontFamily: c.mono, fontSize: 8, padding: '2px 7px',
    background: 'rgba(0,0,0,0.55)', color, border: `1px solid ${color}44`,
    borderRadius: 3, letterSpacing: '0.12em', textTransform: 'uppercase',
  }}>{text}</span>
);

// ─── Asset card data ──────────────────────────────────────────────────────────
const assets = [
  {
    name: 'Signal_Interfer',
    score: 9.2,
    type: 'IMAGE',
    dim: '1080×1350',
    meta: '2.4 MB',
    metaLabel: 'SIZE',
    gradient: 'radial-gradient(ellipse at 35% 45%, #0a3d4d 0%, #051218 55%, #020a0e 100%)',
    accent: c.accent,
    overlay: (
      <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
        {[30,50,70,90,110,130].map(r => (
          <circle key={r} cx="80" cy="80" r={r} fill="none" stroke="#00B1A2" strokeWidth="0.6" opacity={0.6 - r/220}/>
        ))}
        <circle cx="80" cy="80" r="8" fill="#00B1A2" opacity={0.9} style={{ filter: 'blur(3px)' }}/>
        <circle cx="80" cy="80" r="3" fill="#fff"/>
      </svg>
    ),
  },
  {
    name: 'Architecture_L',
    score: 7.8,
    type: 'VIDEO',
    dim: '1920×1080',
    meta: '00:15s',
    metaLabel: 'DURATION',
    gradient: 'linear-gradient(170deg, #0c2020 0%, #071515 40%, #040f10 100%)',
    accent: '#2CCDC2',
    overlay: (
      <svg viewBox="0 0 160 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={i * 18} y={0} width={2} height={120} fill="#00B1A2" opacity={0.15 + (i%3)*0.1}/>
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={0} y={i * 18} width={160} height={1} fill="#00B1A2" opacity={0.1}/>
        ))}
        <circle cx="80" cy="60" r="18" fill="none" stroke="#2CCDC2" strokeWidth="1.5" opacity={0.8}/>
        <polygon points="74,52 74,68 90,60" fill="#2CCDC2" opacity={0.9}/>
      </svg>
    ),
  },
  {
    name: 'Retro_Precisio',
    score: 8.9,
    type: 'IMAGE',
    dim: '2048×2048',
    meta: '4.1 MB',
    metaLabel: 'SIZE',
    gradient: 'linear-gradient(135deg, #0e1520 0%, #141c2a 40%, #080e18 100%)',
    accent: '#7B8FFF',
    overlay: (
      <svg viewBox="0 0 160 140" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }}>
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => (
            <rect key={`${row}-${col}`} x={col*28+4} y={row*26+4} width={22} height={20}
              fill={`rgba(60,80,140,${0.3 + (row+col)%3 * 0.15})`} rx={2}/>
          ))
        )}
        <rect x={60} y={52} width={44} height={38} fill="rgba(100,130,220,0.25)" rx={3}
          style={{ filter: 'blur(4px)' }}/>
      </svg>
    ),
  },
  {
    name: 'Mobile_Signal_',
    score: 9.5,
    type: 'STORY',
    dim: '1080×1920',
    meta: '1.8 MB',
    metaLabel: 'SIZE',
    gradient: 'linear-gradient(160deg, #1a0535 0%, #0a1850 35%, #003d55 65%, #004d40 100%)',
    accent: '#CC44FF',
    overlay: (
      <svg viewBox="0 0 160 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }}>
        <defs>
          <linearGradient id="wg1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7B2FFF" stopOpacity={0.9}/>
            <stop offset="50%" stopColor="#0066FF" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#00FFCC" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <path d="M 0 160 Q 40 100 80 130 Q 120 160 160 80 L 160 200 L 0 200 Z" fill="url(#wg1)" opacity={0.6}/>
        <path d="M 0 130 Q 50 70 100 100 Q 130 120 160 60 L 160 200 L 0 200 Z" fill="url(#wg1)" opacity={0.4}/>
      </svg>
    ),
  },
];

// ─── Asset Card ───────────────────────────────────────────────────────────────
function AssetCard({ asset }: { asset: typeof assets[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${hov ? c.borderStrong : c.border}`,
        background: c.bgCard,
        cursor: 'pointer',
        transition: 'border-color 0.18s, transform 0.18s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.5)` : 'none',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 160, position: 'relative', overflow: 'hidden',
        background: asset.gradient,
      }}>
        {asset.overlay}
        {/* Type badge */}
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          <Tag text={asset.type} color={asset.accent} />
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <Mono size={11} color={c.textPri} style={{ display: 'block', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {asset.name}
        </Mono>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <Mono size={8} color={c.textLabel} upper style={{ display: 'block', marginBottom: 2 }}>Dimensions</Mono>
            <Mono size={10} color={c.textSec}>{asset.dim}</Mono>
          </div>
          <div>
            <Mono size={8} color={c.textLabel} upper style={{ display: 'block', marginBottom: 2 }}>{asset.metaLabel}</Mono>
            <Mono size={10} color={c.textSec}>{asset.meta}</Mono>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CampaignsContent({ onUploadAssets }: { onUploadAssets?: () => void }) {
  const [search, setSearch] = useState('');
  const [assetType, setAssetType] = useState('All Assets');
  const [perf, setPerf] = useState('All Metrics');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: c.bgBase }}>

      {/* ── Status Bar ── */}
      <div style={{
        height: 44, flexShrink: 0,
        background: c.bgPanel, borderBottom: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: c.accentDim, border: `1px solid ${c.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Mono size={9} color={c.accent} upper>Global AI Command Orchestrator</Mono>
          <Mono size={8} color={c.textLabel} upper>Status: Optimizing_Campaign_Flow_V4.2.1</Mono>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,204,119,0.06)', border: `1px solid rgba(0,204,119,0.18)`,
          borderRadius: 5, padding: '4px 10px',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.green, boxShadow: `0 0 5px ${c.green}` }} />
          <Mono size={9} color={c.green} upper>Latent Space Syncing…</Mono>
        </div>
        {[
          <path key="a" d="M18 8h1a4 4 0 0 1 0 8h-1"/>,
          <><path key="b" d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line key="c" x1="6" y1="1" x2="6" y2="4"/><line key="d" x1="10" y1="1" x2="10" y2="4"/><line key="e" x1="14" y1="1" x2="14" y2="4"/></>,
        ].map((path, i) => (
          <button key={i} style={{
            width: 28, height: 28, borderRadius: 5, border: `1px solid ${c.border}`,
            background: 'transparent', color: c.textSec, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 22px 100px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* ── Hero Card ── */}
        <div style={{
          background: c.bgCard, border: `1px solid ${c.border}`,
          borderRadius: 12, padding: '28px 28px 28px 32px',
          display: 'flex', gap: 24, alignItems: 'stretch',
        }}>
          {/* Left */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 1.5, background: c.accent, borderRadius: 2, boxShadow: `0 0 5px ${c.accent}` }} />
              <Mono size={9} color={c.accent} upper>Value Conservation Engine</Mono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Mono size={14} color={c.textPri} style={{ lineHeight: 1.45, letterSpacing: '0.02em' }}>
                Creative Optimization
              </Mono>
              <Mono size={14} color={c.textPri} style={{ lineHeight: 1.45, letterSpacing: '0.02em' }}>
                at Infrastructure Scale.
              </Mono>
            </div>
            <div style={{ maxWidth: 420 }}>
              <Mono size={11} color={c.textSec} style={{ lineHeight: 1.75 }}>
                Browse and analyze high-velocity signals from your campaign assets. Each item is indexed by algorithmic performance metrics.
              </Mono>
            </div>
            <div>
              <button
                onClick={onUploadAssets}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  fontFamily: c.mono, fontSize: 10,
                  padding: '8px 18px', borderRadius: 6, border: 'none',
                  background: c.accent, color: c.bgBase, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  boxShadow: `0 0 18px ${c.accentGlow}`,
                  transition: 'opacity 0.15s',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Assets
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div style={{
            width: 260, flexShrink: 0,
            background: c.bgPanel, border: `1px solid ${c.border}`,
            borderRadius: 10, padding: '16px 16px 14px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Mono size={8} color={c.textLabel} upper>Creative Optimization Engine</Mono>
              <div style={{
                width: 18, height: 18, borderRadius: 3,
                background: c.accentDim, border: `1px solid ${c.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
            </div>

            {/* Big metric */}
            <div style={{ textAlign: 'center', padding: '4px 0 2px' }}>
              <div style={{
                fontFamily: c.mono, fontSize: 22, fontWeight: 400, color: c.accent,
                letterSpacing: '0.02em', lineHeight: 1,
                textShadow: `0 0 14px ${c.accentGlow}`,
              }}>98.4%</div>
              <Mono size={8} color={c.textSec} upper style={{ display: 'block', marginTop: 4 }}>Asset Efficiency</Mono>
            </div>

            {/* Real-time row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Mono size={8} color={c.textSec} upper>Real-Time Analysis</Mono>
              <Tag text="Active" color={c.green} />
            </div>
            <div style={{ height: 2, background: c.bgBase, borderRadius: 1, overflow: 'hidden' }}>
              <div style={{ width: '73%', height: '100%', background: c.accent, borderRadius: 1, boxShadow: `0 0 6px ${c.accent}` }} />
            </div>

            {/* Mini stat cards */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'CTR Forecast', value: '+12.4%', color: c.accent },
                { label: 'Engagement', value: 'High', color: '#FF4466' },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: c.bgBase, border: `1px solid ${c.border}`,
                  borderRadius: 6, padding: '8px 10px',
                }}>
                  <Mono size={7} color={c.textLabel} upper style={{ display: 'block', marginBottom: 4 }}>{s.label}</Mono>
                  <Mono size={12} color={s.color}>{s.value}</Mono>
                </div>
              ))}
            </div>

            {/* System readout */}
            <div style={{
              background: c.bgBase, border: `1px solid ${c.border}`,
              borderRadius: 6, padding: '8px 10px',
            }}>
              <Mono size={7} color={c.textLabel} upper style={{ display: 'block', marginBottom: 6 }}>System Readout</Mono>
              {[
                '> Analyzing Signal_Interference_V1',
                '> Vector identified: Neural_Flow_X',
                '> Enhancing saturation +14%',
                '> Recalculating metrics...',
              ].map((line, i) => (
                <Mono key={i} size={8} color={i === 3 ? c.accent : c.textSec} style={{ display: 'block', lineHeight: 1.7 }}>{line}</Mono>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, overflow: 'hidden',
        }}>
          {[
            { label: 'Total Assets',    value: '2,841', accent: false },
            { label: 'Active Variants', value: '156',   accent: false },
            { label: 'Avg Score',       value: '8.4',   sub: '/10', accent: true },
            { label: 'Storage Used',    value: '1.2',   sub: ' TB', accent: false },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '18px 22px',
              borderRight: i < 3 ? `1px solid ${c.border}` : 'none',
            }}>
              <Mono size={8} color={c.textLabel} upper style={{ display: 'block', marginBottom: 8 }}>{s.label}</Mono>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Mono size={18} color={s.accent ? c.accent : c.textPri}
                  style={{ textShadow: s.accent ? `0 0 12px ${c.accentGlow}` : undefined }}>
                  {s.value}
                </Mono>
                {s.sub && <Mono size={11} color={s.accent ? c.accentMid : c.textSec}>{s.sub}</Mono>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Search / Filter ── */}
        <div style={{
          background: c.bgCard, border: `1px solid ${c.border}`,
          borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Probe signals..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: c.mono, fontSize: 11, color: c.textPri,
                letterSpacing: '0.06em',
              } as React.CSSProperties}
            />
          </div>
          <div style={{ width: 1, height: 20, background: c.border }} />
          {[
            { label: 'Asset Type', val: assetType, set: setAssetType, opts: ['All Assets', 'Image', 'Video', 'Story'] },
            { label: 'Performance', val: perf, set: setPerf, opts: ['All Metrics', 'Top Rated', 'Trending', 'New'] },
          ].map(({ label, val, set, opts }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Mono size={7} color={c.textLabel} upper>{label}</Mono>
              <select
                value={val}
                onChange={e => set(e.target.value)}
                style={{
                  background: c.bgInput, border: `1px solid ${c.borderStrong}`,
                  borderRadius: 5, color: c.textPri, fontFamily: c.mono, fontSize: 10,
                  padding: '4px 24px 4px 8px', outline: 'none', cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L4 4L7 1' stroke='%233D6575' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
                } as React.CSSProperties}
              >
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <button style={{
            width: 32, height: 32, borderRadius: 6,
            border: `1px solid ${c.borderStrong}`,
            background: c.accentDim, color: c.accent,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Asset Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {assets.map(a => <AssetCard key={a.name} asset={a} />)}
        </div>

      </div>
    </div>
  );
}
