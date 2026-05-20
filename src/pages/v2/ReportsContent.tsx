import React, { useState } from 'react';
import { c } from './theme2';

// ─── Injected keyframes ───────────────────────────────────────────────────────
const STYLE_ID = 'reports-animations';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes rpt-live-pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 6px #00CC77; }
      50%       { opacity: 0.5; box-shadow: 0 0 2px #00CC77; }
    }
    @keyframes rpt-gen-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes rpt-card-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

// ─── Project data model ───────────────────────────────────────────────────────
interface ProjectKPI {
  label: string;
  value: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  desc: string;
  account: string;
  latestWeek: string;
  latestRange: string;
  status: 'ready' | 'pending' | 'generating';
  kpis: ProjectKPI[];
  reportCount: number;
  lastUpdated: string;
  criticalCount?: number;
}

const PROJECTS: Project[] = [
  {
    id: 'drama',
    name: 'drama',
    desc: '短剧投放复盘 · PopularReels & Bestshort',
    account: 'act_800509389474426',
    latestWeek: 'W20',
    latestRange: 'May 13–19',
    status: 'ready',
    kpis: [
      { label: 'ROAS',         value: '0.051×', color: '#FF4466' },
      { label: 'Beacon Gap',   value: '60.8%',  color: '#FFB800' },
      { label: 'Paywall Flush',value: '98%',    color: '#FF4466' },
    ],
    reportCount: 3,
    lastUpdated: '2026-05-20',
    criticalCount: 3,
  },
  {
    id: 'lexi',
    name: 'LexiCollection',
    desc: '电商投放复盘 · LexiCollection_85',
    account: 'act_804290394826',
    latestWeek: 'W20',
    latestRange: 'May 13–19',
    status: 'generating',
    kpis: [],
    reportCount: 1,
    lastUpdated: '2026-05-19',
  },
  {
    id: 'bk-alpha',
    name: 'BK-ALPHA',
    desc: '品牌广告投放 · Bookclub Campaign',
    account: 'act_809304928742',
    latestWeek: 'W19',
    latestRange: 'May 6–12',
    status: 'pending',
    kpis: [],
    reportCount: 2,
    lastUpdated: '2026-05-13',
  },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Mono({
  children, size = 11, color = c.textSec, upper = false, bold = false,
  style,
}: {
  children: React.ReactNode; size?: number; color?: string;
  upper?: boolean; bold?: boolean; style?: React.CSSProperties;
}) {
  return (
    <span style={{
      fontFamily: c.mono, fontSize: size, color,
      fontWeight: bold ? 700 : 400,
      textTransform: upper ? 'uppercase' : undefined,
      letterSpacing: upper ? '0.1em' : '0.05em',
      lineHeight: 1.5, ...style,
    }}>{children}</span>
  );
}

function Badge({ text, variant = 'mute' }: { text: string; variant?: 'mute' | 'accent' | 'green' }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    mute:   { bg: 'rgba(255,255,255,0.04)', color: c.textSec,  border: c.border },
    accent: { bg: (c as any).accentDim ?? 'rgba(0,177,162,0.12)', color: c.accent, border: (c as any).borderStrong ?? c.border },
    green:  { bg: 'rgba(0,204,119,0.12)',   color: '#00CC77',  border: 'rgba(0,204,119,0.3)' },
  };
  const sv = colors[variant];
  return (
    <span style={{
      fontFamily: c.mono, fontSize: 9, padding: '3px 8px',
      background: sv.bg, color: sv.color,
      border: `1px solid ${sv.border}`, borderRadius: 3,
      letterSpacing: '0.08em', textTransform: 'uppercase' as const, flexShrink: 0,
    }}>{text}</span>
  );
}

// ─── Status badge for project card ───────────────────────────────────────────
function StatusBadge({ status }: { status: Project['status'] }) {
  if (status === 'ready') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(0,204,119,0.08)', border: '1px solid rgba(0,204,119,0.25)',
        borderRadius: 4, padding: '3px 9px',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%', background: '#00CC77',
          animation: 'rpt-live-pulse 2s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <Mono size={9} color="#00CC77" upper>Report Ready</Mono>
      </div>
    );
  }
  if (status === 'generating') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(0,177,162,0.06)', border: `1px solid rgba(0,177,162,0.2)`,
        borderRadius: 4, padding: '3px 9px',
      }}>
        <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2.5"
          style={{ animation: 'rpt-gen-spin 1.2s linear infinite', flexShrink: 0 }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <Mono size={9} color={c.accent} upper>Generating</Mono>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.border}`,
      borderRadius: 4, padding: '3px 9px',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.textMute, flexShrink: 0 }} />
      <Mono size={9} color={c.textMute} upper>Pending</Mono>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onOpen,
  animDelay,
}: {
  project: Project;
  onOpen: (id: string) => void;
  animDelay: number;
}) {
  const [hov, setHov] = useState(false);
  const clickable = project.status === 'ready';

  return (
    <div
      onClick={() => clickable && onOpen(project.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: c.bgCard,
        border: `1px solid ${hov && clickable ? 'rgba(0,177,162,0.4)' : c.border}`,
        borderRadius: 10,
        padding: '20px 22px',
        cursor: clickable ? 'pointer' : 'default',
        boxShadow: hov && clickable
          ? '0 0 0 1px rgba(0,177,162,0.2), 0 8px 24px rgba(0,0,0,0.28)'
          : '0 2px 8px rgba(0,0,0,0.15)',
        transform: hov && clickable ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
        animation: `rpt-card-in 0.35s ease ${animDelay}ms both`,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* ── Top row: name + status ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontFamily: c.sans, fontSize: 17, fontWeight: 700, color: c.textPri, marginBottom: 4 }}>
            {project.name}
          </div>
          <Mono size={10} color={c.textSec}>{project.desc}</Mono>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* ── KPI pills (if ready) ── */}
      {project.kpis.length > 0 ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
          {project.kpis.map(kpi => (
            <div key={kpi.label} style={{
              background: 'rgba(0,0,0,0.2)',
              border: `1px solid ${c.border}`,
              borderRadius: 6,
              padding: '7px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              <Mono size={8} color={c.textMute} upper>{kpi.label}</Mono>
              <span style={{ fontFamily: c.mono, fontSize: 15, fontWeight: 700, color: kpi.color, letterSpacing: '0.02em' }}>
                {kpi.value}
              </span>
            </div>
          ))}
          {project.criticalCount != null && project.criticalCount > 0 && (
            <div style={{
              background: 'rgba(255,68,102,0.06)',
              border: '1px solid rgba(255,68,102,0.2)',
              borderRadius: 6,
              padding: '7px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              <Mono size={8} color={c.textMute} upper>Critical</Mono>
              <span style={{ fontFamily: c.mono, fontSize: 15, fontWeight: 700, color: '#FF4466' }}>
                {project.criticalCount}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          height: 50,
          background: 'rgba(255,255,255,0.02)',
          border: `1px dashed ${c.border}`,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Mono size={10} color={c.textMute}>
            {project.status === 'generating' ? '报告生成中，请稍候…' : '暂无报告数据'}
          </Mono>
        </div>
      )}

      {/* ── Bottom row: meta ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTop: `1px solid ${c.border}`,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge text={project.latestWeek} variant="mute" />
          <Mono size={9} color={c.textMute}>{project.latestRange}</Mono>
          <Mono size={9} color={c.textMute}>· {project.reportCount} reports</Mono>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Mono size={9} color={c.textMute}>{project.account}</Mono>
          {clickable && (
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={hov ? c.accent : c.textMute} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'stroke 0.18s', flexShrink: 0 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Project Index View ───────────────────────────────────────────────────────
function ProjectIndex({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: c.bgBase }}>
      {/* ── Status Bar ── */}
      <ReportStatusBar />

      {/* ── Page header ── */}
      <div style={{
        padding: '28px 28px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontFamily: c.sans, fontSize: 22, fontWeight: 800, color: c.textPri, marginBottom: 4 }}>
            Projects
          </div>
          <Mono size={10} color={c.textMute}>选择项目查看投放分析报告</Mono>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Mono size={9} color={c.textMute}>{PROJECTS.length} projects</Mono>
          <div style={{
            width: 1, height: 12, background: c.border,
          }} />
          <Mono size={9} color={c.textMute}>
            {PROJECTS.filter(p => p.status === 'ready').length} ready
          </Mono>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: c.border, margin: '18px 28px' }} />

      {/* ── Project Grid ── */}
      <div style={{
        padding: '0 28px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 16,
      }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            onOpen={onOpen}
            animDelay={i * 60}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Shared Status Bar ────────────────────────────────────────────────────────
function ReportStatusBar({ projectName, onBack }: { projectName?: string; onBack?: () => void }) {
  return (
    <div style={{
      height: 44, flexShrink: 0,
      background: c.bgPanel, borderBottom: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10,
    }}>
      {/* Icon */}
      <div style={{
        width: 26, height: 26, borderRadius: 6,
        background: (c as any).accentDim ?? 'rgba(0,177,162,0.1)',
        border: `1px solid ${(c as any).borderStrong ?? c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6"  y1="20" x2="6"  y2="14"/>
        </svg>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontFamily: c.mono, fontSize: 9, color: c.accent, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
            Lanbow Reporting Engine
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
              Weekly Ops Review
            </span>
            {projectName && (
              <>
                <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute }}>›</span>
                <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textSec, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {projectName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: `1px solid ${c.border}`,
            borderRadius: 5,
            padding: '4px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginLeft: 4,
            transition: 'border-color 0.15s',
          }}
        >
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, letterSpacing: '0.06em' }}>Projects</span>
        </button>
      )}

      <div style={{ flex: 1 }} />

      {/* Ready badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(0,204,119,0.06)', border: '1px solid rgba(0,204,119,0.2)',
        borderRadius: 5, padding: '4px 10px',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%', background: '#00CC77',
          animation: 'rpt-live-pulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: c.mono, fontSize: 9, color: '#00CC77', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          {projectName ? 'Report Ready' : `${PROJECTS.filter(p => p.status === 'ready').length} Ready`}
        </span>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ labelLeft, metaRight, children }: {
  labelLeft: string; metaRight?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        padding: '10px 18px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.02)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
          {labelLeft}
        </span>
        {metaRight && (
          <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, letterSpacing: '0.05em' }}>{metaRight}</span>
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  );
}

// ─── Funnel bar row ───────────────────────────────────────────────────────────
function FunnelRow({ step, label, pct, count, drop, critical = false, proxy = false }: {
  step: string; label: string; pct: number; count: string; drop: string;
  critical?: boolean; proxy?: boolean;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 90px 80px', alignItems: 'center', gap: 12, padding: '3px 0' }}>
      <span style={{ fontFamily: c.mono, fontSize: 10, color: proxy ? c.textSec : c.textPri, fontStyle: proxy ? 'italic' : undefined, letterSpacing: '0.02em' }}>
        {step} {label}
      </span>
      <div style={{ height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.max(pct, 0.5)}%`,
          background: critical
            ? `linear-gradient(90deg, rgba(255,68,102,0.6), rgba(255,68,102,0.9))`
            : `linear-gradient(90deg, rgba(0,177,162,0.5), rgba(0,177,162,0.85))`,
          borderRadius: 3,
          boxShadow: critical ? `0 0 6px rgba(255,68,102,0.4)` : `0 0 6px rgba(0,177,162,0.25)`,
        }} />
      </div>
      <span style={{ fontFamily: c.mono, fontSize: 11, color: critical ? '#FF4466' : c.textPri, fontWeight: 700, textAlign: 'right' as const }}>{count}</span>
      <span style={{ fontFamily: c.mono, fontSize: 10, color: critical ? '#FF4466' : drop === '—' ? c.textMute : c.textSec, textAlign: 'right' as const }}>{drop}</span>
    </div>
  );
}

function Mod02Funnel() {
  const rows = [
    { step: '①', label: 'PageView',         pct: 100,  count: '1,516', drop: '—',      critical: false, proxy: true  },
    { step: '②', label: 'ViewContent',      pct: 100,  count: '1,516', drop: '0.0%',   critical: false, proxy: true  },
    { step: '③', label: 'PlayStart',        pct: 61.3, count: '930',   drop: '−38.7%', critical: false, proxy: false },
    { step: '④', label: 'WatchProgress',    pct: 20.9, count: '317',   drop: '−65.9%', critical: false, proxy: false },
    { step: '⑤', label: 'PaywallView',      pct: 19.5, count: '296',   drop: '−6.6%',  critical: false, proxy: true  },
    { step: '⑥', label: 'InitiateCheckout', pct: 0.4,  count: '6',     drop: '−98.0%', critical: true,  proxy: false },
    { step: '⑦', label: 'Purchase',         pct: 0.13, count: '2',     drop: '−66.7%', critical: false, proxy: false },
  ];
  return (
    <SectionCard labelLeft="MOD-02 · Full funnel · 7 nodes" metaRight="2026-05-13 → 2026-05-19">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 90px 80px', gap: 12, marginBottom: 4 }}>
          {['Stage', 'Volume', 'Count', 'Drop'].map((h, i) => (
            <span key={h} style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em', textAlign: i >= 2 ? 'right' as const : 'left' as const }}>{h}</span>
          ))}
        </div>
        {rows.map(r => <FunnelRow key={r.step} {...r} />)}
      </div>
      <div style={{ marginTop: 16, borderLeft: '3px solid #FF4466', padding: '10px 14px', background: 'rgba(255,68,102,0.04)', borderRadius: '0 4px 4px 0' }}>
        <span style={{ fontFamily: c.mono, fontSize: 10, color: '#FF4466', lineHeight: 1.6 }}>
          主要漏洞：⑤→⑥ 流失 98%。296 人看到付费墙，只有 6 人点击 Stripe。
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
        <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec }}>整体转化率（Click → Purchase）</span>
        <span style={{ fontFamily: c.mono, fontSize: 16, fontWeight: 700, color: c.accent }}>0.13%</span>
      </div>
    </SectionCard>
  );
}

function Mod03Meta() {
  const leftRows  = [
    { label: 'Spend',       value: '$274.21',    color: c.accent,  warn: false },
    { label: '外部收入',    value: '$13.99',     color: c.textPri, warn: false },
    { label: 'Impressions', value: '50,079',     color: c.textPri, warn: false },
    { label: '外部付费',    value: '2 笔',       color: c.textPri, warn: false },
    { label: 'Clicks',      value: '8,245',      color: c.accent,  warn: false },
  ];
  const rightRows = [
    { label: 'CTR',          value: '16.46%',        color: '#FFB800',   warn: true  },
    { label: 'Reach',        value: '42,741',         color: c.textPri,   warn: false },
    { label: 'Frequency',    value: '1.17',           color: c.textPri,   warn: false },
    { label: 'CPC',          value: '$0.033',         color: '#FFB800',   warn: true  },
    { label: 'ACTIVE 校园',  value: '0（已暂停）',   color: c.textMute,  warn: false },
  ];
  const MetaRow = ({ label, value, color, warn }: { label: string; value: string; color: string; warn: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px dotted ${c.border}` }}>
      <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec }}>{label}</span>
      <span style={{ fontFamily: c.mono, fontSize: 12, fontWeight: 700, color }}>
        {value}{warn && <span style={{ marginLeft: 4, fontSize: 10 }}>⚠</span>}
      </span>
    </div>
  );
  return (
    <SectionCard labelLeft="MOD-03 · Meta ad data · W20" metaRight="act_800509389474426">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
        <div>{leftRows.map(r => <MetaRow key={r.label} {...r} />)}</div>
        <div>{rightRows.map(r => <MetaRow key={r.label} {...r} />)}</div>
      </div>
      <div style={{ marginTop: 16, borderLeft: '3px solid #FFB800', padding: '10px 14px', background: 'rgba(255,184,0,0.04)', borderRadius: '0 4px 4px 0' }}>
        <span style={{ fontFamily: c.mono, fontSize: 10, color: '#FFB800', lineHeight: 1.6 }}>
          流量质量警示 — CTR 16% + CPC $0.033 = 点击农场签名。drama runbook §6: 低于 $0.01 + 4K+ 点击几乎必假
        </span>
      </div>
    </SectionCard>
  );
}

function Mod04Country() {
  const countries = [
    { flag: '🇵🇭', code: 'PH', pct: 100, mins: '785 min', share: '11.5%' },
    { flag: '🇳🇬', code: 'NG', pct: 89,  mins: '700 min', share: '10.2%' },
    { flag: '🇺🇸', code: 'US', pct: 55,  mins: '429 min', share: '6.3%'  },
    { flag: '🇨🇩', code: 'CD', pct: 53,  mins: '419 min', share: '6.1%'  },
    { flag: '🇮🇩', code: 'ID', pct: 50,  mins: '390 min', share: '5.7%'  },
  ];
  return (
    <SectionCard labelLeft="MOD-04 · Country distribution · CF Stream" metaRight="Top 5 by watch time">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {countries.map(ct => (
            <div key={ct.code} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 70px 60px', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>{ct.flag} {ct.code}</span>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ct.pct}%`, background: 'linear-gradient(90deg, rgba(0,177,162,0.4), rgba(0,177,162,0.8))', borderRadius: 3 }} />
              </div>
              <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, textAlign: 'right' as const }}>{ct.mins}</span>
              <span style={{ fontFamily: c.mono, fontSize: 10, fontWeight: 700, color: c.accent, textAlign: 'right' as const }}>{ct.share}</span>
            </div>
          ))}
        </div>
        <div style={{ border: `1px dashed ${(c as any).borderStrong ?? c.border}`, borderRadius: 6, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>DB Top 5</span>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, marginTop: 4 }}>SG · US · GB · ZA · FR</div>
          </div>
          <div>
            <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>CF Top 5</span>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, marginTop: 4 }}>PH · NG · US · CD · ID</div>
          </div>
          <div style={{ borderLeft: '3px solid #FFB800', padding: '8px 10px', background: 'rgba(255,184,0,0.04)', borderRadius: '0 4px 4px 0' }}>
            <span style={{ fontFamily: c.mono, fontSize: 9, color: '#FFB800', lineHeight: 1.6 }}>
              两边完全不重合 — 按 DB geo 做投放优化建立在错样本
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function Mod05DataGaps() {
  const gaps = [
    { num: '#1', variant: 'crit', title: 'Beacon coverage gap ~60%',          body: 'CF Stream 6,847 min vs DB 2,682 min。Next.js hydration 慢，player mount 晚，beacon miss rate 极高。', span: false },
    { num: '#2', variant: 'crit', title: 'DB geo ≠ CF Stream geo',            body: '新兴市场弱网失败用户不可见。DB 只记录成功流的会话，CF 记录所有尝试。', span: false },
    { num: '#3', variant: 'warn', title: 'Stripe 内部测试单占 31%',            body: 'filter @sandwichlab.ai + test_% 后真实付费仅 2 笔。需要在 Stripe 层过滤内部账号。', span: false },
    { num: '#4', variant: 'warn', title: 'Stripe customer_details 全空',       body: '用户根本没到填卡页。PaywallView → InitiateCheckout 流失 98% 意味着跳转链路断裂。', span: false },
    { num: '#5', variant: 'info', title: 'Subscribe→Purchase 命名漂移',        body: 'Stripe event subscribe 与 Meta Purchase 事件未对齐，导致 ROAS 分母错误。需要统一事件命名规范。', span: true },
  ];
  const borderColors: Record<string, string> = { crit: '#FF4466', warn: '#FFB800', info: '#3B82F6' };
  return (
    <SectionCard labelLeft="MOD-05 · Known data gaps · W20" metaRight="5 open items">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {gaps.map(g => (
          <div key={g.num} style={{ background: 'rgba(0,0,0,0.18)', border: `1px solid ${c.border}`, borderLeft: `3px solid ${borderColors[g.variant]}`, borderRadius: 6, padding: '12px 14px', gridColumn: g.span ? '1 / -1' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: c.mono, fontSize: 8, color: borderColors[g.variant], background: `${borderColors[g.variant]}18`, border: `1px solid ${borderColors[g.variant]}50`, borderRadius: 3, padding: '2px 6px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{g.variant}</span>
              <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute }}>{g.num}</span>
              <span style={{ fontFamily: c.sans, fontSize: 12, fontWeight: 600, color: c.textPri }}>{g.title}</span>
            </div>
            <p style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, margin: 0, lineHeight: 1.7 }}>{g.body}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Mod06Actions() {
  const actions = [
    { severity: 'HIGH', owner: 'product',   task: 'beacon 触发挪到 player load()，修复 60.8% beacon gap' },
    { severity: 'HIGH', owner: 'product',   task: '排查 PaywallView→Stripe 跳转链路，修复 98% paywall flush' },
    { severity: 'HIGH', owner: 'analytics', task: '信号量 < 30 时返回 insufficient_signal' },
    { severity: 'MED',  owner: 'content',   task: 'Top series 占 95.7% sessions，加单剧 dominance 警报' },
    { severity: 'MED',  owner: 'channels',  task: 'DB/CF geo 不重合定位 PH/NG/CD 边缘节点 stall ratio + TTFF' },
    { severity: 'LOW',  owner: 'reports',   task: 'funnel proxy 节点用斜体标注，视觉区分真实计数' },
  ];
  const severityStyles: Record<string, React.CSSProperties> = {
    HIGH: { background: 'rgba(255,68,102,0.15)',  color: '#FF4466', border: '1px solid rgba(255,68,102,0.4)' },
    MED:  { background: 'rgba(255,184,0,0.12)',   color: '#FFB800', border: '1px solid rgba(255,184,0,0.4)'  },
    LOW:  { background: 'rgba(59,130,246,0.12)',  color: '#3B82F6', border: '1px solid rgba(59,130,246,0.4)' },
  };
  return (
    <SectionCard labelLeft="MOD-06 · Next week actions · W21" metaRight="6 items">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actions.map((a, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 100px 1fr', gap: 12, padding: '11px 14px', background: 'rgba(0,0,0,0.18)', border: `1px solid ${c.border}`, borderRadius: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: c.mono, fontSize: 9, padding: '3px 8px', borderRadius: 3, textTransform: 'uppercase' as const, letterSpacing: '0.08em', textAlign: 'center' as const, ...severityStyles[a.severity] }}>{a.severity}</span>
            <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.border}`, borderRadius: 3, padding: '2px 8px', textAlign: 'center' as const }}>{a.owner}</span>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, lineHeight: 1.5 }}>{a.task}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Mod07Sources() {
  const sources = ['Supabase PG (26 表)', 'Stripe REST', 'Cloudflare Stream', 'Cloudflare Firewall', 'Meta Marketing API ×2', 'GitHub local clone'];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,177,162,0.02)', border: `1px solid ${c.border}`, borderRadius: 8, padding: '14px 18px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginRight: 4 }}>Sources</span>
        {sources.map(src => (
          <span key={src} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: c.mono, fontSize: 9, color: c.textSec, background: 'rgba(0,0,0,0.18)', border: `1px solid ${c.border}`, borderRadius: 4, padding: '3px 8px' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00CC77', flexShrink: 0, boxShadow: '0 0 4px #00CC77' }} />
            {src}
          </span>
        ))}
      </div>
      <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, flexShrink: 0, marginLeft: 16 }}>drama-pipeline-mcp v1.1</span>
    </div>
  );
}

function HeroKPIRow() {
  const cards = [
    { label: 'ROAS',                  value: '0.051×', valueColor: '#FF4466', border: 'rgba(255,68,102,0.35)', shadow: '0 0 32px rgba(255,68,102,0.06) inset',  note: '投 $1 收 $0.05 · 目标 ROAS = 0.5，差 10×' },
    { label: 'Beacon Coverage Gap',   value: '60.8%',  valueColor: '#FFB800', border: 'rgba(255,184,0,0.35)',  shadow: '0 0 32px rgba(255,184,0,0.06) inset',    note: 'CF Stream 6,847 min vs DB 2,682 min · ≈ 4,165 min 未被记录' },
    { label: 'Paywall → Checkout 流失',value: '98%',   valueColor: '#FF4466', border: 'rgba(255,68,102,0.35)', shadow: '0 0 32px rgba(255,68,102,0.06) inset',  note: '296 PaywallView → 6 InitiateCheckout · 几乎没进 Stripe' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
      {cards.map(card => (
        <div key={card.label} style={{ background: c.bgCard, border: `1px solid ${card.border}`, borderRadius: 8, padding: '18px 20px', boxShadow: card.shadow }}>
          <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginBottom: 10 }}>{card.label}</div>
          <div style={{ fontFamily: c.mono, fontSize: 48, fontWeight: 700, color: card.valueColor, lineHeight: 1, marginBottom: 12, textShadow: `0 0 24px ${card.valueColor}60` }}>{card.value}</div>
          <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, lineHeight: 1.6 }}>{card.note}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Report Detail View ───────────────────────────────────────────────────────
const TABS = [
  { id: 'w20', label: 'W20', range: 'May 13–19' },
  { id: 'w19', label: 'W19', range: 'May 6–12'  },
  { id: 'w18', label: 'W18', range: 'Apr 29–May 5' },
];

function ReportDetail({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const [selectedTab, setSelectedTab] = useState('w20');
  const project = PROJECTS.find(p => p.id === projectId)!;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: c.bgBase }}>
      {/* ── Status Bar with back ── */}
      <ReportStatusBar projectName={project.name} onBack={onBack} />

      {/* ── Week Tabs ── */}
      <div style={{
        padding: '0 24px',
        background: c.bgPanel,
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', gap: 0, overflowX: 'auto' as const, flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const active = tab.id === selectedTab;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                background: 'transparent', border: 'none',
                borderBottom: active ? `2px solid ${c.accent}` : '2px solid transparent',
                padding: '10px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: -1, transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent, boxShadow: `0 0 5px ${c.accent}`, flexShrink: 0 }} />}
              <span style={{ fontFamily: c.mono, fontSize: 11, fontWeight: active ? 700 : 400, color: active ? c.accent : c.textMute, letterSpacing: '0.06em' }}>
                {tab.label}
              </span>
              <span style={{ fontFamily: c.mono, fontSize: 9, color: active ? c.textSec : c.textMute }}>· {tab.range}</span>
            </button>
          );
        })}
      </div>

      {/* ── Scrollable report content ── */}
      <div style={{ padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Report Header */}
        <div style={{ padding: '20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <div style={{ fontFamily: c.sans, fontSize: 24, fontWeight: 800, color: c.textPri, marginBottom: 6 }}>
              {project.name} 投放复盘
            </div>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, marginBottom: 5, opacity: 0.75 }}>
              2026-05-13 → 2026-05-19 · PopularReels &amp; Bestshort (act_800509389474426)
            </div>
            <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec }}>
              数据导向的 7 天产品 + 投放诊断：核心异常 / 漏斗瓶颈 / 流量真相 / 缺口 / 行动
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
            <Badge text="W20" variant="mute" />
            <Badge text="7 day window" variant="mute" />
            <Badge text="USD" variant="mute" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: c.mono, fontSize: 9, padding: '3px 9px', background: 'rgba(0,204,119,0.12)', color: '#00CC77', border: '1px solid rgba(0,204,119,0.3)', borderRadius: 3, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00CC77' }} />
              data live
            </div>
          </div>
        </div>

        <HeroKPIRow />
        <Mod02Funnel />
        <Mod03Meta />
        <Mod04Country />
        <Mod05DataGaps />
        <Mod06Actions />
        <Mod07Sources />

        <div style={{ textAlign: 'center' as const, marginTop: 20, fontFamily: c.mono, fontSize: 9, color: c.textMute, paddingBottom: 8 }}>
          生成时间 2026-05-20 · 数据 100% 实测拉取 · 无人工填充 · 周期 2026-05-13 → 2026-05-19 (W20)
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function ReportsContent() {
  const [openProject, setOpenProject] = useState<string | null>(null);

  if (openProject) {
    return <ReportDetail projectId={openProject} onBack={() => setOpenProject(null)} />;
  }
  return <ProjectIndex onOpen={setOpenProject} />;
}
