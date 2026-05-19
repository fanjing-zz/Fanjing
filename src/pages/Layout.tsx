import React, { ReactNode } from 'react';
import { t } from './theme';

export type PageId = 'comm' | 'dashboard';

// ── Icons (inline SVG) ──────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Sidebar ─────────────────────────────────────────────────────────────────
function SidebarIcon({
  icon, active, onClick,
}: { icon: ReactNode; active?: boolean; onClick?: () => void }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 40, height: 40, borderRadius: 8,
        border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: active ? t.accentGlow : hov ? 'rgba(0,229,191,0.07)' : 'transparent',
        color: active ? t.accent : hov ? t.accent : t.textSecondary,
        transition: 'all 0.15s',
      }}
    >
      {icon}
    </button>
  );
}

function Sidebar({ page, onNav }: { page: PageId; onNav: (p: PageId) => void }) {
  return (
    <div style={{
      width: 60, background: t.bgPanel,
      borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '16px 0', gap: 4,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        width: 32, height: 32, borderRadius: 6,
        background: t.accent, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <span style={{ fontFamily: t.mono, fontWeight: 700, fontSize: 12, color: t.bgDeep }}>L</span>
      </div>

      <SidebarIcon icon={<IconHome />} onClick={() => onNav('dashboard')} active={page === 'dashboard'} />
      <SidebarIcon icon={<IconChat />} onClick={() => onNav('comm')} active={page === 'comm'} />
      <SidebarIcon icon={<IconChart />} onClick={() => onNav('dashboard')} />
      <SidebarIcon icon={<IconGrid />} />

      <div style={{ flex: 1 }} />
      <SidebarIcon icon={<IconSettings />} />
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(0,229,191,0.15)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: t.accent, marginTop: 8,
      }}>
        <IconUser />
      </div>
    </div>
  );
}

// ── TopBar ──────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      height: 52, background: t.bgPanel,
      borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 8, flexShrink: 0,
    }}>
      <span style={{ fontFamily: t.mono, fontWeight: 700, fontSize: 13, color: t.accent, letterSpacing: '0.12em' }}>
        LANBOW
      </span>
      <span style={{ color: t.textMuted, fontSize: 12 }}>/</span>
      <span style={{ fontFamily: t.mono, fontSize: 11, color: t.textSecondary, letterSpacing: '0.08em' }}>
        {title}
      </span>
      {subtitle && (
        <>
          <span style={{ color: t.textMuted, fontSize: 12 }}>/</span>
          <span style={{ fontFamily: t.mono, fontSize: 10, color: t.textMuted, letterSpacing: '0.06em' }}>
            {subtitle}
          </span>
        </>
      )}
      <div style={{ flex: 1 }} />
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: `1px solid ${t.borderStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: t.textSecondary, cursor: 'pointer',
      }}>
        <IconUser />
      </div>
    </div>
  );
}

// ── Right Panel ──────────────────────────────────────────────────────────────
const recentTasks = [
  { id: 'SandwichXtest_01_Pl...', tag: '#400 8481 8081 832', active: true },
  { id: 'Team(xxx) Bonus Pl...', tag: '#422 8481 8081 832', active: false },
  { id: '#401 8481 8081 832', tag: '', active: false },
  { id: '#409 8481 8081 832', tag: '', active: false },
  { id: '#410 8481 8081 832', tag: '', active: false },
  { id: '#411 8481 8081 832', tag: '', active: false },
  { id: '#412 8481 8081 832', tag: '', active: false },
  { id: '#413 8481 8081 832', tag: '', active: false },
];

function RightPanel() {
  return (
    <div style={{
      width: 228, background: t.bgPanel,
      borderLeft: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
    }}>
      {recentTasks.map((task, i) => {
        const isHeader = i < 2;
        return (
          <div
            key={i}
            style={{
              padding: isHeader ? '12px 14px' : '8px 14px',
              borderBottom: `1px solid ${t.border}`,
              background: task.active ? 'rgba(0,229,191,0.05)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <div style={{
              fontFamily: t.mono, fontSize: isHeader ? 11 : 10,
              color: task.active ? t.accent : t.textSecondary,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {task.id}
            </div>
            {task.tag && (
              <div style={{
                fontFamily: t.mono, fontSize: 10,
                color: t.textMuted, marginTop: 2,
              }}>
                {task.tag}
              </div>
            )}
            {isHeader && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                <span style={{
                  fontFamily: t.mono, fontSize: 9, padding: '2px 6px',
                  background: task.active ? t.accentGlow : 'rgba(255,255,255,0.04)',
                  color: task.active ? t.accent : t.textMuted,
                  borderRadius: 3, letterSpacing: '0.08em',
                }}>
                  {task.active ? 'ACTIVE' : 'COMPLETED'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Layout Shell ─────────────────────────────────────────────────────────────
export function Layout({
  page, onNav, title, subtitle, children,
}: {
  page: PageId;
  onNav: (p: PageId) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: t.bgDeep, overflow: 'hidden' }}>
      <Sidebar page={page} onNav={onNav} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <TopBar title={title} subtitle={subtitle} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export { IconArrowRight, IconChart };
