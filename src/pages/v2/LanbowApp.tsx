import React, { useState } from 'react';
import { c, applyTheme } from './theme2';
import { CommChatContent }   from './CommChatContent';
import { CommDetailContent } from './CommDetailContent';
import { CampaignsContent }  from './CampaignsContent';
import { CreativeContent }   from './CreativeContent';
import { SettingsContent }   from './SettingsContent';
import { DashboardContent, DASH_MODULES }  from './DashboardContent';
import { CAMPAIGN_MODULES } from './CampaignsContent';
import { ChatMsg, getAgentResponse } from './agentLogic';
import { ReportsContent }  from './ReportsContent';
import { LandingPage }      from './LandingPage';
import { OnboardingTour }   from './OnboardingTour';

// ─── Page types ───────────────────────────────────────────────────────────────
type PageId = 'chat' | 'campaigns' | 'dashboard' | 'creative' | 'settings';

// ─── Sidebar Icons ────────────────────────────────────────────────────────────
const IChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const ILayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const ICampaign = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);
const ISettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ILink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IFile = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const sidebarItems: { id: PageId; icon: React.ReactNode; label: string; dot?: boolean; spacerBefore?: boolean }[] = [
  { id: 'chat',      icon: <IChat />,     label: 'Chat',      dot: true },
  { id: 'campaigns', icon: <ICampaign />, label: 'Campaigns' },
  { id: 'dashboard', icon: <IChart />,    label: 'Dashboard' },
  { id: 'creative',  icon: <IImage />,    label: 'Creative' },
  { id: 'settings',  icon: <ISettings />, label: 'Settings',  spacerBefore: true },
];

function Sidebar({ page, onNav }: { page: PageId; onNav: (p: PageId) => void }) {
  return (
    <div style={{
      width: 60, background: c.bgPanel,
      borderRight: `1px solid ${c.border}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '16px 0', gap: 2, flexShrink: 0,
    }}>
      {sidebarItems.map(({ id, icon, dot, spacerBefore }) => {
        const active = id === page;
        return (
          <React.Fragment key={id}>
            {spacerBefore && <div style={{ flex: 1 }} />}
            <div style={{ position: 'relative', width: 38, height: 38 }}>
              {dot && (
                <div style={{
                  position: 'absolute', top: 1, right: 1, width: 7, height: 7,
                  borderRadius: '50%', background: '#2CCDC2', zIndex: 1,
                }} />
              )}
              <button
                onClick={() => onNav(id)}
                data-tour={id}
                style={{
                  width: 38, height: 38, borderRadius: 9, border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? c.accentDim : 'transparent',
                  color: active ? c.accent : c.textSec,
                  transition: 'all 0.15s',
                }}
              >
                {icon}
              </button>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
type UserTab = 'profile' | 'workspace' | 'billing';

function TopBar({ onOpenUserCenter, isDark, onToggleDark }: {
  onOpenUserCenter: (tab: UserTab) => void;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const [dropOpen, setDropOpen] = React.useState(false);
  const dropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  const menuItems: { label: string; tab: UserTab; icon: React.ReactNode }[] = [
    { label: 'Profile',    tab: 'profile',   icon: <IUserIcon /> },
    { label: 'Workspace',  tab: 'workspace', icon: <ITeamIcon /> },
    { label: 'Billing',    tab: 'billing',   icon: <IBillIcon /> },
  ];

  return (
    <div style={{
      height: 56, display: 'flex', alignItems: 'center',
      padding: '0 28px', borderBottom: `1px solid ${c.border}`,
      background: c.bgPanel, flexShrink: 0,
    }}>
      <img
        src={isDark ? '/lanbow-logo-light.png' : '/lanbow-logo-dark.png'}
        alt="LANBOW"
        style={{ height: 15, width: 'auto', marginRight: 16, marginLeft: -6, display: 'block' }}
      />
      <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textSec, letterSpacing: '0.06em' }}>
        Enterprise Growth Decision System . V1
      </span>
      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <button
        onClick={onToggleDark}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          width: 32, height: 32, borderRadius: 8, border: `1px solid ${c.border}`,
          background: 'transparent', cursor: 'pointer', marginRight: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: c.textSec, transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderStrong; e.currentTarget.style.color = c.textPri; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
      >
        {isDark ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Avatar + dropdown */}
      <div ref={dropRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropOpen(o => !o)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1px solid ${dropOpen ? c.accent : c.borderStrong}`,
            background: 'linear-gradient(135deg, #1a4a35, #0d2418)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'border-color 0.15s',
            boxShadow: dropOpen ? `0 0 0 2px ${c.accentDim}` : 'none',
          }}
        >
          <span style={{ fontFamily: c.mono, fontSize: 13, color: c.accent }}>S</span>
        </button>

        {dropOpen && (
          <div style={{
            position: 'absolute', top: 44, right: 0, zIndex: 200,
            background: c.bgElevated, border: `1px solid ${c.borderStrong}`,
            borderRadius: 10, width: 200,
            boxShadow: `0 16px 48px ${c.shadowColor}, 0 0 0 1px ${c.border}`,
            overflow: 'hidden',
          }}>
            {/* User info header */}
            <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${c.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1a4a35, #0d2418)',
                  border: `1px solid ${c.borderStrong}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: c.mono, fontSize: 12, color: c.accent }}>S</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: c.sans, fontSize: 13, fontWeight: 600, color: c.textPri, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Siye
                  </div>
                  <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
                    Admin · Sandwichlab
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            {menuItems.map(({ label, tab, icon }) => (
              <button key={tab}
                onClick={() => { setDropOpen(false); onOpenUserCenter(tab); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  borderBottom: `1px solid ${c.border}`,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,177,162,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ color: c.textSec, display: 'flex', alignItems: 'center' }}>{icon}</span>
                <span style={{ fontFamily: c.sans, fontSize: 13, color: c.textPri }}>{label}</span>
              </button>
            ))}

            {/* Logout */}
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', background: 'transparent', border: 'none',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,80,80,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: '#FF5050', display: 'flex', alignItems: 'center' }}><ILogoutIcon /></span>
              <span style={{ fontFamily: c.sans, fontSize: 13, color: '#FF5050' }}>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TopBar icon helpers ──────────────────────────────────────────────────────
const IUserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const ITeamIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IBillIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const ILogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ─── User Center Drawer ───────────────────────────────────────────────────────
function UserCenterDrawer({ tab, onClose, onTabChange }: {
  tab: UserTab | null;
  onClose: () => void;
  onTabChange: (t: UserTab) => void;
}) {
  const open = tab !== null;
  const tabs: { id: UserTab; label: string }[] = [
    { id: 'profile',   label: 'Profile' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'billing',   label: 'Billing' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: c.overlayBg,
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 310,
        width: 520,
        background: c.bgPanel,
        borderLeft: `1px solid ${c.borderStrong}`,
        boxShadow: `-24px 0 80px ${c.shadowColor}`,
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32,0,0.15,1)',
      }}>
        {/* Drawer header */}
        <div style={{
          height: 56, display: 'flex', alignItems: 'center',
          padding: '0 24px', borderBottom: `1px solid ${c.border}`, flexShrink: 0,
          gap: 12,
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: c.textSec, display: 'flex', alignItems: 'center', padding: 4,
            borderRadius: 5, transition: 'color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = c.textPri)}
            onMouseLeave={e => (e.currentTarget.style.color = c.textSec)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <span style={{ fontFamily: c.sans, fontSize: 15, fontWeight: 600, color: c.textPri }}>
            Account
          </span>
          <div style={{ flex: 1 }} />
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', padding: '0 24px', gap: 0,
          borderBottom: `1px solid ${c.border}`, flexShrink: 0,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onTabChange(t.id)} style={{
              padding: '12px 16px', background: 'transparent', border: 'none',
              cursor: 'pointer', fontFamily: c.sans, fontSize: 13,
              color: tab === t.id ? c.accent : c.textSec,
              borderBottom: tab === t.id ? `2px solid ${c.accent}` : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s, border-color 0.15s',
              fontWeight: tab === t.id ? 600 : 400,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {tab === 'profile'   && <ProfileTab />}
          {tab === 'workspace' && <WorkspaceTab />}
          {tab === 'billing'   && <BillingTab />}
        </div>
      </div>
    </>
  );
}

// ─── Drawer field helpers ─────────────────────────────────────────────────────
function DrawerField({ label, value, editable }: { label: string; value: string; editable?: boolean }) {
  const [v, setV] = React.useState(value);
  const [editing, setEditing] = React.useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      {editing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={v}
            onChange={e => setV(e.target.value)}
            autoFocus
            style={{
              flex: 1, background: c.bgInput, border: `1px solid ${c.borderStrong}`,
              borderRadius: 7, padding: '8px 12px', fontFamily: c.mono, fontSize: 12,
              color: c.textPri, outline: 'none',
            }}
          />
          <button onClick={() => setEditing(false)} style={{
            background: c.accentDim, border: `1px solid ${c.borderStrong}`, borderRadius: 7,
            padding: '8px 14px', fontFamily: c.mono, fontSize: 11, color: c.accent, cursor: 'pointer',
          }}>Save</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: c.mono, fontSize: 13, color: c.textPri }}>{v}</span>
          {editable && (
            <button onClick={() => setEditing(true)} style={{
              background: 'transparent', border: `1px solid ${c.border}`, borderRadius: 5,
              padding: '3px 10px', fontFamily: c.mono, fontSize: 10, color: c.textSec, cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'border-color 0.12s, color 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderStrong; e.currentTarget.style.color = c.textPri; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
            >Edit</button>
          )}
        </div>
      )}
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: c.mono, fontSize: 9, color: c.accent,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 16, height: 1, background: c.accent, opacity: 0.4 }} />
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  return (
    <div style={{ padding: '28px 28px' }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a4a35, #0d2418)',
          border: `2px solid ${c.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: c.mono, fontSize: 22, color: c.accent }}>S</span>
        </div>
        <div>
          <div style={{ fontFamily: c.sans, fontSize: 18, fontWeight: 700, color: c.textPri, marginBottom: 4 }}>Siye</div>
          <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Admin · Sandwichlab
          </div>
          <button style={{
            marginTop: 8, background: 'transparent', border: `1px solid ${c.border}`,
            borderRadius: 5, padding: '4px 12px', fontFamily: c.mono, fontSize: 10,
            color: c.textSec, cursor: 'pointer', letterSpacing: '0.06em',
          }}>Change Photo</button>
        </div>
      </div>

      <DrawerSection title="Profile">
        <DrawerField label="Name" value="Siye" editable />
        <DrawerField label="Email" value="siye@sandwichlab.ai" editable />
        <DrawerField label="Phone" value="+86 138 **** 8866" editable />
        <DrawerField label="Role" value="Admin" />
      </DrawerSection>

      <DrawerSection title="Security">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Password</div>
            <span style={{ fontFamily: c.mono, fontSize: 13, color: c.textPri, letterSpacing: '0.2em' }}>••••••••</span>
          </div>
          <button style={{
            background: 'transparent', border: `1px solid ${c.border}`, borderRadius: 5,
            padding: '5px 12px', fontFamily: c.mono, fontSize: 10, color: c.textSec, cursor: 'pointer',
          }}>Change</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Two-Factor Auth</div>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: '#FFB800' }}>Not enabled</span>
          </div>
          <button style={{
            background: c.accentDim, border: `1px solid ${c.borderStrong}`, borderRadius: 5,
            padding: '5px 12px', fontFamily: c.mono, fontSize: 10, color: c.accent, cursor: 'pointer',
          }}>Enable</button>
        </div>
      </DrawerSection>

      <DrawerSection title="Recent Sessions">
        {[
          { device: 'MacBook Pro · Chrome', time: '2026-05-19 · just now', loc: '北京, CN', current: true },
          { device: 'iPhone 15 · Safari',   time: '2026-05-18 · 14:22',   loc: '北京, CN', current: false },
          { device: 'Windows · Edge',       time: '2026-05-15 · 09:05',   loc: '上海, CN', current: false },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: `1px solid ${c.border}`,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: c.mono, fontSize: 12, color: c.textPri }}>{r.device}</span>
                {r.current && (
                  <span style={{
                    fontFamily: c.mono, fontSize: 8, background: 'rgba(0,204,119,0.12)',
                    color: '#00CC77', padding: '2px 6px', borderRadius: 3,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>Current</span>
                )}
              </div>
              <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, marginTop: 3 }}>{r.time} · {r.loc}</div>
            </div>
            {!r.current && (
              <button style={{
                background: 'transparent', border: `1px solid rgba(255,80,80,0.2)`,
                borderRadius: 4, padding: '3px 8px', fontFamily: c.mono, fontSize: 9,
                color: '#FF6060', cursor: 'pointer', letterSpacing: '0.06em',
              }}>Revoke</button>
            )}
          </div>
        ))}
      </DrawerSection>
    </div>
  );
}

// ─── Workspace Tab ────────────────────────────────────────────────────────────
function WorkspaceTab() {
  const members = [
    { name: 'Siye',    email: 'siye@sandwichlab.ai',   role: 'Admin',  avatar: 'S', online: true },
    { name: 'Xiaoming',email: 'xm@sandwichlab.ai',     role: 'Editor', avatar: 'X', online: true },
    { name: 'Rachel',  email: 'rachel@sandwichlab.ai', role: 'Viewer', avatar: 'R', online: false },
    { name: 'Tom',     email: 'tom@sandwichlab.ai',    role: 'Editor', avatar: 'T', online: false },
  ];
  const roleColors: Record<string, string> = {
    Admin: c.accent, Editor: '#3B82F6', Viewer: c.textSec,
  };
  return (
    <div style={{ padding: '28px 28px' }}>
      <DrawerSection title="Workspace">
        <DrawerField label="Name" value="Sandwichlab" editable />
        <DrawerField label="Workspace ID" value="ws_8f2a91cc3d" />
        <DrawerField label="Created" value="2024-11-03" />
        <DrawerField label="Plan" value="Growth · Expires 2026-12-31" />
      </DrawerSection>

      <DrawerSection title="Members">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button style={{
            background: c.accentDim, border: `1px solid ${c.borderStrong}`,
            borderRadius: 6, padding: '6px 14px', fontFamily: c.mono, fontSize: 10,
            color: c.accent, cursor: 'pointer', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Invite Member
          </button>
        </div>
        {members.map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: `1px solid ${c.border}`,
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a4a35, #0d2418)',
                border: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: c.mono, fontSize: 12, color: c.accent }}>{m.avatar}</span>
              </div>
              {m.online && (
                <div style={{
                  position: 'absolute', bottom: 1, right: 1, width: 7, height: 7,
                  borderRadius: '50%', background: '#00CC77', border: `1.5px solid ${c.bgPanel}`,
                }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: c.sans, fontSize: 13, color: c.textPri, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
            </div>
            <div style={{
              fontFamily: c.mono, fontSize: 9, color: roleColors[m.role],
              background: `${roleColors[m.role]}18`, borderRadius: 4,
              padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0,
            }}>{m.role}</div>
            {m.role !== 'Admin' && (
              <button style={{
                background: 'transparent', border: 'none', color: c.textSec,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                padding: 4, borderRadius: 4,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </DrawerSection>

      <DrawerSection title="Permissions">
        {[
          { label: 'AI Agent Confirmation', desc: '每次 Agent 执行前需要人工确认', enabled: true },
          { label: 'API Auto-Sync',         desc: '自动拉取 Meta / Feishu 数据', enabled: true },
          { label: 'Member Invite Approval',desc: '新成员加入需要 Admin 批准', enabled: false },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0', borderBottom: `1px solid ${c.border}`,
          }}>
            <div>
              <div style={{ fontFamily: c.sans, fontSize: 12, color: c.textPri, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec }}>{item.desc}</div>
            </div>
            <ToggleSwitch on={item.enabled} />
          </div>
        ))}
      </DrawerSection>
    </div>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  const [state, setState] = React.useState(on);
  return (
    <button
      onClick={() => setState(s => !s)}
      style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: state ? c.accent : c.bgCard,
        border: `1px solid ${state ? c.accent : c.borderStrong}`,
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: state ? 17 : 2, width: 14, height: 14,
        borderRadius: '50%', background: state ? '#fff' : c.textSec,
        transition: 'left 0.2s, background 0.2s',
      }} />
    </button>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────
function BillingTab() {
  const usagePct = 68;
  return (
    <div style={{ padding: '28px 28px' }}>
      {/* Current plan card */}
      <div style={{
        background: `linear-gradient(135deg, rgba(0,177,162,0.08), rgba(0,177,162,0.02))`,
        border: `1px solid ${c.borderStrong}`,
        borderRadius: 12, padding: '20px 22px', marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(0,177,162,0.06)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: c.mono, fontSize: 9, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Current Plan</div>
            <div style={{ fontFamily: c.sans, fontSize: 22, fontWeight: 700, color: c.textPri }}>Growth</div>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textSec, marginTop: 4 }}>¥ 1,888 / mo · Auto-renew</div>
          </div>
          <div style={{
            fontFamily: c.mono, fontSize: 8, background: 'rgba(0,204,119,0.12)',
            color: '#00CC77', padding: '5px 10px', borderRadius: 4,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>Active</div>
        </div>
        <div style={{ height: 1, background: c.border, margin: '16px 0' }} />
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Expires',        value: '2026-12-31' },
            { label: 'AI Operations', value: '10,000 / mo' },
            { label: 'Team members',  value: 'Up to 10' },
          ].map((kv, i) => (
            <div key={i}>
              <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{kv.label}</div>
              <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>{kv.value}</div>
            </div>
          ))}
        </div>
      </div>

      <DrawerSection title="Usage">
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>AI Operations</span>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: c.accent }}>6,820 / 10,000</span>
          </div>
          <div style={{ height: 6, background: c.bgCard, borderRadius: 3, overflow: 'hidden', border: `1px solid ${c.border}` }}>
            <div style={{
              height: '100%', width: `${usagePct}%`,
              background: `linear-gradient(90deg, ${c.accentMid}, ${c.accent})`,
              borderRadius: 3, transition: 'width 0.5s',
            }} />
          </div>
          <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, marginTop: 5 }}>68% used this month · Resets 2026-06-01</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Ad Creation',    value: '412' },
            { label: 'ROAS Analysis',  value: '1,204' },
            { label: 'Creative Gen',   value: '88' },
            { label: 'Reports',        value: '34' },
          ].map((kv, i) => (
            <div key={i} style={{
              flex: 1, background: c.bgCard, border: `1px solid ${c.border}`,
              borderRadius: 8, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: c.sans, fontSize: 15, fontWeight: 700, color: c.textPri }}>{kv.value}</div>
              <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kv.label}</div>
            </div>
          ))}
        </div>
      </DrawerSection>

      <DrawerSection title="Plans">
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { name: 'Starter', price: '¥ 388',   ops: '2,000 ops',  members: '3 seats',  current: false },
            { name: 'Growth',  price: '¥ 1,888', ops: '10,000 ops', members: '10 seats', current: true },
            { name: 'Scale',   price: '¥ 5,888', ops: 'Unlimited',  members: 'Unlimited',current: false },
          ].map((plan) => (
            <div key={plan.name} style={{
              flex: 1, background: plan.current ? 'rgba(0,177,162,0.06)' : c.bgCard,
              border: `1px solid ${plan.current ? c.borderStrong : c.border}`,
              borderRadius: 9, padding: '14px 12px', position: 'relative',
            }}>
              {plan.current && (
                <div style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  background: c.accent, borderRadius: 3, padding: '2px 7px',
                  fontFamily: c.mono, fontSize: 8, color: '#000', letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}>Active</div>
              )}
              <div style={{ fontFamily: c.sans, fontSize: 13, fontWeight: 600, color: plan.current ? c.accent : c.textPri, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontFamily: c.sans, fontSize: 15, fontWeight: 700, color: c.textPri, marginBottom: 8 }}>{plan.price}<span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec }}>/mo</span></div>
              {[plan.ops, plan.members].map((v, i) => (
                <div key={i} style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, marginBottom: 3 }}>
                  <span style={{ color: c.accent, marginRight: 4 }}>✓</span>{v}
                </div>
              ))}
              {!plan.current && (
                <button style={{
                  marginTop: 10, width: '100%', background: 'transparent',
                  border: `1px solid ${c.border}`, borderRadius: 5,
                  padding: '5px 0', fontFamily: c.mono, fontSize: 9, color: c.textSec,
                  cursor: 'pointer', letterSpacing: '0.06em',
                }}>
                  {plan.name === 'Scale' ? 'Contact Sales' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </DrawerSection>

      <DrawerSection title="Billing History">
        {[
          { date: '2026-05-01', desc: 'Growth · May 2026',   amount: '¥ 1,888', status: 'Paid' },
          { date: '2026-04-01', desc: 'Growth · April 2026', amount: '¥ 1,888', status: 'Paid' },
          { date: '2026-03-01', desc: 'Growth · March 2026', amount: '¥ 1,888', status: 'Paid' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: `1px solid ${c.border}`,
          }}>
            <div>
              <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>{r.desc}</div>
              <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, marginTop: 3 }}>{r.date}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: c.mono, fontSize: 12, color: c.textPri }}>{r.amount}</span>
              <span style={{
                fontFamily: c.mono, fontSize: 8, background: 'rgba(0,204,119,0.1)',
                color: '#00CC77', padding: '2px 7px', borderRadius: 3, letterSpacing: '0.08em',
              }}>{r.status}</span>
              <button style={{
                background: 'transparent', border: `1px solid ${c.border}`, borderRadius: 4,
                padding: '3px 8px', fontFamily: c.mono, fontSize: 9, color: c.textSec,
                cursor: 'pointer',
              }}>Download</button>
            </div>
          </div>
        ))}
      </DrawerSection>
    </div>
  );
}

// ─── Right Context Panel ──────────────────────────────────────────────────────
const ctxItems = [
  { label: 'Working Folder',       value: 'Sandwichlab.Feishu.Cn...', icon: <ILink /> },
  { label: 'Context',              value: './Generated/Q2-Romanc...',  icon: <IFile /> },
  { label: 'User:',                value: 'Siye @ Sandwichlab.Ai',    icon: null },
  { label: 'Meta Ad Account:',     value: '8048 9042 9093 816',       icon: null },
  { label: 'Dataset:',             value: '8834 8266 7767 853',       icon: null },
  { label: 'Facebook Public Page:',value: 'LexiCollection_85',        icon: null },
  { label: 'Facebook ID:',         value: '8313 5178 0067 375',       icon: null },
  { label: 'Data Tracking:',       value: '8834 8266 7767 853',       icon: null },
  { label: 'Pixel ID:',            value: '8834 8266 7767 853',       icon: null },
];

function ContextPanel({ authorized }: { authorized: boolean }) {
  return (
    <div style={{
      width: 190, background: c.bgPanel,
      borderLeft: `1px solid ${c.border}`,
      flexShrink: 0, overflow: 'auto',
    }}>
      {/* Auth status banner */}
      <div style={{
        padding: '8px 14px',
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', gap: 6,
        background: authorized ? 'rgba(0,204,119,0.04)' : 'rgba(255,184,0,0.04)',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
          background: authorized ? '#00CC77' : '#FFB800',
          boxShadow: authorized ? '0 0 6px #00CC77' : '0 0 6px #FFB800',
        }} />
        <span style={{
          fontFamily: c.mono, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: authorized ? '#00CC77' : '#FFB800',
        }}>
          {authorized ? 'Authorized' : 'Unauthorized'}
        </span>
      </div>

      {ctxItems.map((item, i) => (
        <div key={i} style={{ padding: '10px 14px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{
            fontFamily: c.mono, fontSize: 9, color: c.textLabel,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5,
          }}>
            {item.label}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {authorized ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                  {item.icon && <span style={{ color: c.textSec, flexShrink: 0 }}>{item.icon}</span>}
                  <span style={{
                    fontFamily: c.mono, fontSize: 11, color: c.textPri,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.value}
                  </span>
                </div>
                <span style={{ color: c.textSec, flexShrink: 0, marginLeft: 4 }}><IArrow /></span>
              </>
            ) : (
              <>
                <span style={{
                  fontFamily: c.mono, fontSize: 11, color: c.textMute,
                  letterSpacing: '0.18em',
                }}>
                  — — —
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c.textMute} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 4 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}



// ─── Analysis Content (ROAS gauge page) ───────────────────────────────────────
function AnalysisContent() {
  // Gauge params
  const cx = 152, cy = 155, R = 112, rInner = 64;
  const startDeg = 225, totalDeg = 270;
  const pct = 6.5 / 20; // ~35% — matches design

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
  // Ticks point OUTWARD from arc edge
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= 80; i++) {
    const deg = startDeg + (totalDeg * i) / 80;
    const isMajor = i % 20 === 0, isMed = i % 5 === 0;
    const len = isMajor ? 13 : isMed ? 8 : 5;
    const p1 = polar(deg, R + 2 + len);
    const p2 = polar(deg, R + 2);
    const done = i / 80 <= pct;
    ticks.push(<line key={i} x1={p1.x.toFixed(1)} y1={p1.y.toFixed(1)} x2={p2.x.toFixed(1)} y2={p2.y.toFixed(1)}
      stroke={done ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.17)'}
      strokeWidth={isMajor ? 1.5 : 0.75} />);
  }
  const labels = [
    { val: '0', deg: startDeg }, { val: '5', deg: startDeg + totalDeg * 0.25 },
    { val: '10', deg: startDeg + totalDeg * 0.5 }, { val: '20', deg: startDeg + totalDeg },
  ];

  // Waveform — 7 cycles, no axis labels
  const w2 = 500, h2 = 110;
  const pts1: string[] = [], pts2: string[] = [];
  for (let i = 0; i <= 500; i++) {
    const x = (i / 500) * w2, t = (i / 500) * Math.PI * 14;
    pts1.push(`${x.toFixed(1)},${(h2/2 + Math.sin(t) * 42).toFixed(1)}`);
    pts2.push(`${x.toFixed(1)},${(h2/2 + Math.sin(t + Math.PI*0.6) * 30).toFixed(1)}`);
  }

  const AM = ({ children, size = 11, color = c.textSec, upper = false, style }: any) => (
    <span style={{ fontFamily: c.mono, fontSize: size, color, textTransform: upper ? 'uppercase' : undefined, letterSpacing: upper ? '0.08em' : '0.04em', ...style }}>{children}</span>
  );
  const ABadge = ({ text, v, dot }: any) => {
    const liveStyle = { bg: 'rgba(0,204,119,0.12)', color: '#00CC77', border: 'rgba(0,204,119,0.3)' };
    const muteStyle = { bg: 'rgba(255,255,255,0.04)', color: c.textSec, border: c.border };
    const s = v === 'live' ? liveStyle : muteStyle;
    return <span style={{ fontFamily: c.mono, fontSize: 9, padding: '3px 8px', background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />}{text}
    </span>;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '20px 24px 96px', gap: 18 }}>
      {/* Config */}
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {[{ l: 'Bid strategy', v: 'LOWEST_COST_WITHOUT_CAP' }, { l: 'Headline', v: 'short drama name (locked)' }].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', borderBottom: i === 0 ? `1px solid ${c.border}` : 'none' }}>
            <span style={{ fontFamily: c.sans, fontSize: 13, color: c.textSec, width: 145, flexShrink: 0 }}>{row.l}</span>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, flex: 1, letterSpacing: '0.04em' }}>{row.v}</span>
            <span style={{ fontFamily: c.mono, fontSize: 9, padding: '3px 8px', background: 'rgba(0,177,162,0.07)', color: c.accent, border: `1px solid rgba(0,177,162,0.2)`, borderRadius: 3, letterSpacing: '0.1em' }}>ACTIVE</span>
          </div>
        ))}
      </div>
      <button style={{ fontFamily: c.mono, fontSize: 11, padding: '10px 22px', background: c.accent, border: 'none', borderRadius: 6, color: c.bgBase, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, boxShadow: `0 0 20px ${c.accentGlow}`, alignSelf: 'flex-start' }}>
        Launch all 74 ads
      </button>
      {/* User bubble */}
      <div style={{ alignSelf: 'flex-end', maxWidth: 380 }}>
        <div style={{ background: c.bgBubble, border: `1px solid ${c.border}`, borderRadius: 8, padding: '14px 16px' }}>
          <AM size={11} color={c.textSec}>Are you still working?</AM>
        </div>
      </div>
      {/* Recap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <AM size={11} color={c.accent} upper style={{ fontWeight: 700, display: 'block' }}>ALL DONE — NOTHING ON MY SIDE. RECAP:</AM>
        {['Pulled booklist + 5 asset bundles (74 files)', 'Generated ~500-word English ad bodies per book', 'Built 5 copies and 74 creatives', 'Submitted 5 campaigns · 74 ad sets · 74 ads'].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <AM size={11} color={c.accentDim}>{i+1}.</AM>
            <AM size={11} color={c.textSec} upper>{s}</AM>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <AM size={9} color={c.textSec} upper>Status</AM>
          <ABadge text="74 Published" v="live" dot />
          <AM size={9} color={c.textSec} upper>Released as scheduled and currently in testing</AM>
        </div>
      </div>
      {/* Analytics row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        {/* ROAS gauge */}
        <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, padding: '18px 20px', flex: '0 0 420px', display: 'flex', flexDirection: 'column' }}>
          <AM upper size={10} color={c.textSec} style={{ display: 'block', marginBottom: 4 }}>Real-Time ROAS</AM>
          <svg width="100%" viewBox="0 0 304 258" style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="aGrad" x1="0%" y1="100%" x2="80%" y2="0%">
                <stop offset="0%"   stopColor="#003D38" stopOpacity={1}/>
                <stop offset="55%"  stopColor="#006E66" stopOpacity={1}/>
                <stop offset="100%" stopColor={c.accent}  stopOpacity={1}/>
              </linearGradient>
              <filter id="aGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <path d={arcPath(startDeg, totalDeg, R, rInner)} fill={c.bgBase} opacity={0.7}/>
            <path d={arcPath(startDeg, totalDeg, R, rInner)} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
            <path d={arcPath(startDeg, totalDeg * pct, R, rInner)} fill="url(#aGrad)" filter="url(#aGlow)"/>
            {ticks}
            {labels.map(({ val, deg }) => {
              const p = polar(deg, R + 26);
              return <text key={val} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fill={c.textSec} fontFamily={c.mono} fontSize={10}>{val}</text>;
            })}
            <text x={cx} y={cy + 8} textAnchor="middle" fill={c.accent} fontFamily={c.sans} fontWeight={800} fontSize={38} style={{ filter: `drop-shadow(0 0 16px ${c.accent})` }}>ROAS</text>
            <text x={cx} y={cy + 36} textAnchor="middle" fill={c.textSec} fontFamily={c.mono} fontSize={12}>Completed</text>
          </svg>
        </div>
        {/* Waveform */}
        <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 10, padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: c.sans, fontSize: 14, fontWeight: 600, color: c.textPri }}>Signal Waveform Analysis</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <ABadge text="LIVE" v="live" dot />
              <ABadge text="HARMONIC-2" v="mute" />
            </div>
          </div>
          <svg width="100%" viewBox={`0 0 ${w2} ${h2}`} style={{ display: 'block', flex: 1, minHeight: 90 }}>
            <polyline points={pts2.join(' ')} fill="none" stroke={c.accentMid} strokeWidth="1.4" strokeLinejoin="round" opacity={0.35}/>
            <polyline points={pts1.join(' ')} fill="none" stroke={c.accent} strokeWidth="2" strokeLinejoin="round" opacity={0.92} style={{ filter: `drop-shadow(0 0 4px ${c.accent})` }}/>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AM size={9} color={c.textSec} upper>Status</AM>
            <ABadge text="74 Published" v="live" dot />
            <AM size={9} color={c.textSec} upper>Released as scheduled and currently in testing</AM>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 8 }} />
      {/* Chat input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: c.bgInput, border: `1px solid ${c.borderStrong}`, borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: c.accentDim, border: `1px solid ${c.borderStrong}`, borderRadius: 6, padding: '4px 10px', flexShrink: 0 }}>
          <span style={{ color: c.accent, fontSize: 12, fontFamily: c.mono }}>@</span>
          <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>Lanbow</span>
        </div>
        <input placeholder="launch all 74 ads now" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: c.mono, fontSize: 11, color: c.textPri } as React.CSSProperties} />
        <button style={{ background: 'transparent', border: 'none', color: c.textSec, cursor: 'pointer', display: 'flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>
        <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${c.borderStrong}`, background: c.accentDim, color: c.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
        </button>
      </div>
    </div>
  );
}

// ─── Global Floating Chat Input ───────────────────────────────────────────────
interface SelMod { id: string; label: string; preview: React.ReactNode; }

function FloatingChat({
  onSend,
  selectedModule,
  onClearModule,
}: {
  onSend: (text: string) => void;
  selectedModule: SelMod | null;
  onClearModule: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    onSend(selectedModule ? `[${selectedModule.label}] ${t}` : t);
    setDraft('');
    onClearModule();
  };
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const hasMod = !!selectedModule;

  return (
    <div style={{
      position: 'absolute', bottom: 20, left: 24, right: 24, zIndex: 50,
      background: c.bgFloat,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${focused || hasMod ? c.borderStrong : c.border}`,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: focused || hasMod
        ? `0 12px 48px ${c.shadowColor}, 0 0 0 1px ${c.borderStrong}`
        : `0 8px 32px ${c.shadowColor}, 0 0 0 1px ${c.border}`,
      transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
    }}>

      {/* ── Module preview panel ── */}
      {hasMod && (
        <div style={{
          padding: '10px 14px 12px',
          borderBottom: `1px solid ${c.border}`,
          background: 'rgba(0,177,162,0.03)',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: c.accent, boxShadow: `0 0 5px ${c.accent}` }} />
              <span style={{
                fontFamily: c.mono, fontSize: 9, color: c.accent,
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>{selectedModule!.label}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClearModule(); }}
              style={{
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${c.border}`,
                borderRadius: 4, color: c.textSec, cursor: 'pointer',
                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, lineHeight: 1, padding: 0,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.target as HTMLElement).style.color = c.textPri; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.target as HTMLElement).style.color = c.textSec; }}
            >×</button>
          </div>
          {/* Mini content — fixed height, overflow hidden, never stretches */}
          <div style={{ height: 60, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            {selectedModule!.preview}
          </div>
        </div>
      )}

      {/* ── Input row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}>
        {/* @Lanbow chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          background: c.accentDim, border: `1px solid ${c.borderStrong}`,
          borderRadius: 6, padding: '4px 10px',
        }}>
          <span style={{ color: c.accent, fontSize: 12, fontFamily: c.mono }}>@</span>
          <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>Lanbow</span>
        </div>

        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={hasMod ? `Ask about ${selectedModule!.label}...` : 'Ask Lanbow anything...'}
          autoComplete="off"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: c.mono, fontSize: 11,
            color: draft ? c.textPri : c.textSec,
          } as React.CSSProperties}
        />

        {/* Mic */}
        <button style={{ background: 'transparent', border: 'none', color: c.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        {/* Send */}
        <button onClick={send} style={{
          width: 32, height: 32, borderRadius: 7, border: `1px solid ${c.borderStrong}`,
          background: draft.trim() || hasMod ? c.accentDim : 'transparent',
          color: draft.trim() || hasMod ? c.accent : c.textSec,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export function LanbowApp() {
  const [isDark, setIsDark] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [showTour,    setShowTour]    = useState(false);
  const [page, setPage] = useState<PageId>('chat');

  React.useEffect(() => { applyTheme(isDark); }, [isDark]);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [selectedModule, setSelectedModule] = useState<SelMod | null>(null);
  const [creativeUploadOpen, setCreativeUploadOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [userCenterTab, setUserCenterTab] = useState<UserTab | null>(null);

  const handleEnterApp = () => {
    setShowLanding(false);
    // Small delay so app renders before tour overlay appears
    setTimeout(() => setShowTour(true), 350);
  };

  const handleUploadAssets = () => {
    setCreativeUploadOpen(true);
    setPage('creative');
    // Reset flag after a tick so the effect fires once per click
    setTimeout(() => setCreativeUploadOpen(false), 200);
  };

  const handleSelectModule = (id: string) => {
    // Toggle off if clicking the same module
    if (selectedModule?.id === id) { setSelectedModule(null); return; }
    const mod = DASH_MODULES[id] ?? CAMPAIGN_MODULES[id];
    if (mod) setSelectedModule({ id, label: mod.label, preview: mod.preview });
  };

  const handleSend = (text: string) => {
    setPage('chat');
    setChatMsgs(prev => [...prev, { id: Date.now(), role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { id: Date.now() + 1, role: 'agent', text: getAgentResponse(text) }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: c.bgBase, color: c.textPri, overflow: 'hidden' }}>
      {/* Landing page — sits above everything until user enters */}
      {showLanding && <LandingPage onEnter={handleEnterApp} />}

      {/* Onboarding tour overlay */}
      <OnboardingTour isActive={showTour} onComplete={() => setShowTour(false)} />
      <TopBar onOpenUserCenter={setUserCenterTab} isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />
      <UserCenterDrawer
        tab={userCenterTab}
        onClose={() => setUserCenterTab(null)}
        onTabChange={setUserCenterTab}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar page={page} onNav={setPage} />
        {/* Main content area — position:relative so FloatingChat anchors to it */}
        <div style={{ flex: 1, display: 'flex', position: 'relative', minWidth: 0, overflow: 'hidden' }}>
          {page === 'chat'      && <CommChatContent msgs={chatMsgs} typing={typing} onAuthorize={() => setAuthorized(true)} />}
          {page === 'campaigns' && (
            <CampaignsContent
              onSelect={handleSelectModule}
              selectedId={selectedModule?.id ?? null}
              onUploadAssets={handleUploadAssets}
            />
          )}
          {page === 'dashboard' && (
            <DashboardContent
              onSelect={handleSelectModule}
              selectedId={selectedModule?.id ?? null}
            />
          )}
          {page === 'creative'  && <CreativeContent autoOpenUpload={creativeUploadOpen} />}
          {page === 'settings'  && <SettingsContent  />}
          {/* FloatingChat only on non-chat pages — chat page has its own input bar */}
          {page !== 'chat' && (
            <FloatingChat
              onSend={handleSend}
              selectedModule={selectedModule}
              onClearModule={() => setSelectedModule(null)}
            />
          )}
        </div>
        <ContextPanel authorized={authorized} />
      </div>
    </div>
  );
}
