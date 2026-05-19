import React, { useState } from 'react';
import { c } from './theme2';

// ─── Primitives ───────────────────────────────────────────────────────────────
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

// Selectable wrapper — same interaction as Dashboard modules
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
        cursor: 'pointer', borderRadius: 8, position: 'relative',
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

// ─── Campaign data ─────────────────────────────────────────────────────────────
const campaigns = [
  { id: 'camp.alpha',   code: 'BK-ALPHA', adSets: 14, ads: 14, dotColor: '#888' },
  { id: 'camp.master',  code: 'BK-MSTR',  adSets: 15, ads: 15, dotColor: '#F59E0B' },
  { id: 'camp.yue',     code: 'BK-YUE',   adSets: 16, ads: 16, dotColor: c.accent },
  { id: 'camp.echo',    code: 'BK-ECHO',  adSets: 15, ads: 15, dotColor: '#888' },
  { id: 'camp.horizon', code: 'BK-HRZ',   adSets: 14, ads: 14, dotColor: '#888' },
];
const TOTAL_SETS = campaigns.reduce((s, cp) => s + cp.adSets, 0);
const TOTAL_ADS  = campaigns.reduce((s, cp) => s + cp.ads, 0);

// ─── Stat Box ─────────────────────────────────────────────────────────────────
function StatBox({ val, label, active }: { val: string; label: string; active?: boolean }) {
  return (
    <div style={{
      border: `1px solid ${active ? c.accent : c.border}`,
      borderRadius: 8, padding: '10px 18px', textAlign: 'center', minWidth: 76,
      background: active ? `rgba(0,177,162,0.07)` : c.bgCard,
    }}>
      <div style={{ fontFamily: c.mono, fontSize: 22, fontWeight: 700, color: active ? c.accent : c.textPri, lineHeight: 1.1 }}>{val}</div>
      <div style={{ fontFamily: c.mono, fontSize: 7, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── Submission Funnel ────────────────────────────────────────────────────────
function SubmissionFunnel() {
  const rows = [
    { label: 'PLANS',     val: 5,  desc: 'OUTCOME_SALES',   pct: 6  },
    { label: 'CAMPAIGNS', val: 5,  desc: '5 books',          pct: 6  },
    { label: 'AD SETS',   val: 74, desc: 'female 25–60',     pct: 44 },
    { label: 'ADS',       val: 74, desc: 'headline-locked',  pct: 44 },
    { label: 'CREATIVES', val: 74, desc: '1080²',            pct: 44 },
  ];
  return (
    <div style={{ flex: 1, background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mono size={7} color={c.textMute} upper>VIS · 04A</Mono>
          <Mono size={10} color={c.textPri} bold>Submission funnel</Mono>
        </div>
        <span style={{
          fontFamily: c.mono, fontSize: 7, padding: '3px 8px',
          background: 'rgba(255,255,255,0.04)', color: c.textMute,
          border: `1px solid ${c.border}`, borderRadius: 3,
          textTransform: 'uppercase' as const, letterSpacing: '0.08em',
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.textMute, display: 'inline-block' }} />
          All Paused
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {rows.map(row => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', alignItems: 'center', gap: 14 }}>
            <Mono size={8} color={c.textMute} upper>{row.label}</Mono>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${row.pct}%`, background: c.accent, opacity: 0.4, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 140, justifyContent: 'flex-end' }}>
              <Mono size={11} color={c.textPri} bold>{row.val}</Mono>
              <Mono size={8} color={c.textMute}>× {row.desc}</Mono>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status Mix Donut ─────────────────────────────────────────────────────────
function StatusMix() {
  const CX = 52, CY = 52, R = 38;
  const segments = [
    { label: 'LIVE',    val: 0,  color: c.accent },
    { label: 'PAUSED',  val: 74, color: '#555' },
    { label: 'PENDING', val: 0,  color: '#F59E0B' },
    { label: 'FAILED',  val: 0,  color: '#EF4444' },
  ];
  return (
    <div style={{ width: 252, flexShrink: 0, background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, padding: '16px 20px', boxSizing: 'border-box', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mono size={7} color={c.textMute} upper>VIS · 04B</Mono>
          <Mono size={10} color={c.textPri} bold>Status mix</Mono>
        </div>
        <Mono size={7} color={c.textMute}>● 0 Live</Mono>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg width={104} height={104} viewBox="0 0 104 104" style={{ flexShrink: 0 }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#3a3a3a" strokeWidth={11} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#555" strokeWidth={11}
            strokeDasharray={`${2 * Math.PI * R} 0`} />
          <text x={CX} y={CY + 7} textAnchor="middle" fontFamily={c.mono} fontSize={19} fontWeight={700} fill={c.textSec}>74</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
          {segments.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block', flexShrink: 0 }} />
                <Mono size={8} color={c.textMute} upper>{s.label}</Mono>
              </div>
              <Mono size={9} color={s.val > 0 ? c.textPri : c.textMute}>{s.val}</Mono>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Tree ─────────────────────────────────────────────────────────────
function CampaignTree() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 18px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mono size={7} color={c.textMute} upper>TREE · 01</Mono>
          <Mono size={10} color={c.textPri} bold>Campaign / ad set / ad — tree</Mono>
        </div>
        <Mono size={7} color={c.textMute} upper>Click row to expand</Mono>
      </div>

      {campaigns.map((camp, ci) => {
        const isOpen = expanded.has(camp.id);
        const prefix = camp.id.split('.')[1];
        const adSets = Array.from({ length: camp.adSets }, (_, i) => ({
          num: String(i + 1).padStart(2, '0'),
          name: `adset.${prefix}.${String(i + 1).padStart(2, '0')}`,
        }));
        return (
          <div key={camp.id}>
            <div
              onClick={e => { e.stopPropagation(); toggle(camp.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px',
                cursor: 'pointer', borderBottom: `1px solid ${c.border}`,
                background: isOpen ? 'rgba(0,177,162,0.04)' : ci % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                transition: 'background 0.15s',
              }}
            >
              <span style={{
                fontFamily: c.mono, fontSize: 10, color: c.textMute, width: 12, flexShrink: 0,
                display: 'inline-block', transition: 'transform 0.18s',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              }}>›</span>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: camp.dotColor, flexShrink: 0,
                boxShadow: camp.dotColor !== '#888' ? `0 0 6px ${camp.dotColor}90` : 'none',
              }} />
              <Mono size={10} color={c.textPri} bold style={{ flex: 1 }}>{camp.id}</Mono>
              <Mono size={8} color={c.textMute} style={{ minWidth: 64 }}>{camp.code}</Mono>
              <div style={{ textAlign: 'right', minWidth: 130 }}>
                <Mono size={9} color={c.textSec}>
                  <span style={{ color: c.textPri, fontWeight: 700 }}>{camp.adSets}</span> ad sets ·{' '}
                  <span style={{ color: c.textPri, fontWeight: 700 }}>{camp.ads}</span> ads
                </Mono>
              </div>
              <span style={{
                fontFamily: c.mono, fontSize: 7, padding: '2px 7px',
                border: `1px solid ${c.border}`, borderRadius: 3,
                color: c.textMute, letterSpacing: '0.08em', textTransform: 'uppercase',
                marginLeft: 8, flexShrink: 0,
              }}>Pause</span>
            </div>
            {isOpen && (
              <div style={{ borderBottom: `1px solid ${c.border}` }}>
                {adSets.map((as, ai) => (
                  <div key={as.num} onClick={e => e.stopPropagation()} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 18px 6px 44px',
                    background: ai % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    borderBottom: ai < adSets.length - 1 ? `1px solid rgba(255,255,255,0.03)` : 'none',
                  }}>
                    <Mono size={8} color={c.textMute} style={{ minWidth: 22, textAlign: 'right' }}>{as.num}</Mono>
                    <Mono size={9} color={c.textSec} style={{ flex: 1 }}>{as.name}</Mono>
                    {['$1/D', 'F · 25–60', 'US/CA/GB/AU'].map(tag => (
                      <span key={tag} style={{
                        fontFamily: c.mono, fontSize: 7, padding: '2px 6px',
                        border: `1px solid ${c.border}`, borderRadius: 3,
                        color: c.textMute, letterSpacing: '0.04em', flexShrink: 0,
                      }}>{tag}</span>
                    ))}
                    <Mono size={8} color={c.textMute} style={{ minWidth: 24, textAlign: 'right' }}>1 ad</Mono>
                    <span style={{ color: c.accent, fontSize: 11, marginLeft: 4, flexShrink: 0 }}>✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini previews ────────────────────────────────────────────────────────────
const miniFunnel = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    {[
      { label: 'Plans',     val: 5,  pct: 6  },
      { label: 'Campaigns', val: 5,  pct: 6  },
      { label: 'Ad Sets',   val: 74, pct: 44 },
      { label: 'Ads',       val: 74, pct: 44 },
      { label: 'Creatives', val: 74, pct: 44 },
    ].map(r => (
      <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, width: 56, flexShrink: 0 }}>{r.label}</span>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${r.pct}%`, background: c.accent, opacity: 0.4, borderRadius: 2 }} />
        </div>
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textPri, minWidth: 16, textAlign: 'right' }}>{r.val}</span>
      </div>
    ))}
  </div>
);

const miniStatusMix = (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={20} fill="none" stroke="#3a3a3a" strokeWidth={8} />
      <circle cx={28} cy={28} r={20} fill="none" stroke="#555" strokeWidth={8} />
      <text x={28} y={33} textAnchor="middle" fontFamily={c.mono} fontSize={11} fontWeight={700} fill={c.textSec}>74</text>
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[['LIVE', '0', c.accent], ['PAUSED', '74', '#555'], ['PENDING', '0', '#F59E0B'], ['FAILED', '0', '#EF4444']].map(([l, v, col]) => (
        <div key={l} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 6, height: 6, borderRadius: 1, background: col as string, display: 'inline-block' }} />
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute }}>{l}</span>
          <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, marginLeft: 'auto' }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const miniTree = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    {campaigns.slice(0, 4).map(cp => (
      <div key={cp.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cp.dotColor, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textPri, flex: 1 }}>{cp.id}</span>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute }}>{cp.code}</span>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec }}>{cp.adSets} sets</span>
      </div>
    ))}
    <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, marginTop: 2 }}>+1 more · {TOTAL_SETS} ad sets total</span>
  </div>
);

// ─── Module registry (used by LanbowApp) ─────────────────────────────────────
export const CAMPAIGN_MODULES: Record<string, { label: string; preview: React.ReactNode }> = {
  'camp-funnel':     { label: 'Submission Funnel', preview: miniFunnel     },
  'camp-status-mix': { label: 'Status Mix',        preview: miniStatusMix  },
  'camp-tree':       { label: 'Campaign Tree',     preview: miniTree       },
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CampaignsContent({
  onSelect,
  selectedId,
  onUploadAssets: _onUploadAssets,
}: {
  onSelect: (id: string) => void;
  selectedId: string | null;
  onUploadAssets?: () => void;
}) {
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
          <Mono size={8} color={c.textLabel} upper>Status: Campaign_Submitted · Pending_Launch</Mono>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,184,0,0.06)', border: `1px solid rgba(255,184,0,0.2)`,
          borderRadius: 5, padding: '4px 10px',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FFB800', boxShadow: '0 0 5px #FFB800' }} />
          <Mono size={9} color="#FFB800" upper>All Paused · Waiting Launch</Mono>
        </div>
      </div>

      <div style={{ padding: '24px 24px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Breadcrumb ── */}
        <Mono size={8} color={c.textMute} upper>View · 04 / 05 · Campaigns</Mono>

        {/* ── Title + Stat Boxes ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: c.sans, fontSize: 17, fontWeight: 700, color: c.textPri, marginBottom: 6 }}>
              Campaigns submitted
            </div>
            <Mono size={9} color={c.textMute}>
              5 campaigns · {TOTAL_SETS} ad sets · {TOTAL_ADS} ads · all PAUSED · waiting on launch
            </Mono>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <StatBox val="5"                   label="Campaigns" active />
            <StatBox val={String(TOTAL_SETS)}  label="Ad Sets" />
            <StatBox val={String(TOTAL_ADS)}   label="Ads" />
            <StatBox val={`$${TOTAL_SETS}`}    label="Daily" />
          </div>
        </div>

        {/* ── Vis row: Funnel + Status Mix ── */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
          <Sel id="camp-funnel" selectedId={selectedId} onSelect={onSelect} style={{ flex: 1 }}>
            <SubmissionFunnel />
          </Sel>
          <Sel id="camp-status-mix" selectedId={selectedId} onSelect={onSelect} style={{ display: 'flex', flexDirection: 'column' }}>
            <StatusMix />
          </Sel>
        </div>

        {/* ── Campaign Tree ── */}
        <Sel id="camp-tree" selectedId={selectedId} onSelect={onSelect}>
          <CampaignTree />
        </Sel>

      </div>
    </div>
  );
}
