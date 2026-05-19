import React, { useState } from 'react';
import { c } from './theme2';

// ─── Primitives ───────────────────────────────────────────────────────────────
const M = ({ children, size = 11, color = c.textSec, upper = false, style }: {
  children: React.ReactNode; size?: number; color?: string;
  upper?: boolean; style?: React.CSSProperties;
}) => (
  <span style={{
    fontFamily: c.mono, fontSize: size, color,
    textTransform: upper ? 'uppercase' : undefined,
    letterSpacing: upper ? '0.1em' : '0.05em',
    lineHeight: 1.6, ...style,
  }}>{children}</span>
);

const Badge = ({ text, variant = 'active' }: { text: string; variant?: 'active' | 'muted' | 'live' | 'warn' }) => {
  const s = {
    active: { bg: 'rgba(0,177,162,0.08)',  color: c.accent,  border: 'rgba(0,177,162,0.22)' },
    muted:  { bg: 'rgba(255,255,255,0.04)', color: c.textSec, border: c.border },
    live:   { bg: 'rgba(0,204,119,0.10)',  color: '#00CC77', border: 'rgba(0,204,119,0.28)' },
    warn:   { bg: 'rgba(255,184,0,0.10)',  color: '#FFB800', border: 'rgba(255,184,0,0.25)' },
  }[variant];
  return (
    <span style={{
      fontFamily: c.mono, fontSize: 9, padding: '3px 8px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
    }}>{text}</span>
  );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 32, height: 18, borderRadius: 9, cursor: 'pointer',
        background: value ? c.accent : c.textMute,
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s',
        boxShadow: value ? `0 0 8px rgba(0,177,162,0.4)` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, width: 12, height: 12, borderRadius: '50%',
        background: value ? c.bgBase : 'rgba(255,255,255,0.4)',
        left: value ? 17 : 3,
        transition: 'left 0.18s',
      }} />
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ padding: '8px 0 6px' }}>
        <M size={8} color={c.textLabel} upper style={{ letterSpacing: '0.14em' }}>{title}</M>
      </div>
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Row variants ─────────────────────────────────────────────────────────────
function Row({ label, desc, children, last }: {
  label: string; desc?: string; children?: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', gap: 16,
      borderBottom: last ? 'none' : `1px solid ${c.border}`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <M size={11} color={c.textPri}>{label}</M>
        {desc && <M size={9} color={c.textSec}>{desc}</M>}
      </div>
      {children && <div style={{ flexShrink: 0 }}>{children}</div>}
    </div>
  );
}

function InputRow({ label, desc, value, last }: {
  label: string; desc?: string; value: string; last?: boolean;
}) {
  const [val, setVal] = useState(value);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px', gap: 16,
      borderBottom: last ? 'none' : `1px solid ${c.border}`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }}>
        <M size={11} color={c.textPri}>{label}</M>
        {desc && <M size={9} color={c.textSec}>{desc}</M>}
      </div>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        style={{
          fontFamily: c.mono, fontSize: 10, color: c.textPri,
          background: c.bgInput, border: `1px solid ${c.borderStrong}`,
          borderRadius: 5, padding: '5px 10px', outline: 'none',
          width: 220, flexShrink: 0,
          letterSpacing: '0.04em',
        } as React.CSSProperties}
      />
    </div>
  );
}

// ─── Connection card ──────────────────────────────────────────────────────────
function ConnCard({ icon, name, sub, status, id }: {
  icon: React.ReactNode; name: string; sub: string;
  status: 'connected' | 'pending' | 'error'; id?: string;
}) {
  const cfg = {
    connected: { color: '#00CC77', label: 'Connected', variant: 'live'  as const },
    pending:   { color: '#FFB800', label: 'Pending',   variant: 'warn'  as const },
    error:     { color: '#FF4466', label: 'Error',     variant: 'warn'  as const },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderBottom: `1px solid ${c.border}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 7, flexShrink: 0,
        background: c.bgInput, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: c.textSec,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <M size={11} color={c.textPri} style={{ display: 'block' }}>{name}</M>
        <M size={9} color={c.textSec}>{sub}{id && <> · <span style={{ color: c.accent }}>{id}</span></>}</M>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Badge text={cfg.label} variant={cfg.variant} />
        <button style={{
          fontFamily: c.mono, fontSize: 8, padding: '3px 9px',
          background: 'transparent', border: `1px solid ${c.border}`,
          borderRadius: 3, color: c.textSec, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {status === 'connected' ? 'Manage' : 'Connect'}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function SettingsContent() {
  const [notifSystem,  setNotifSystem]  = useState(true);
  const [notifCampaign,setNotifCampaign]= useState(true);
  const [notifRoas,    setNotifRoas]    = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [autoPause,    setAutoPause]    = useState(true);
  const [darkMode,     setDarkMode]     = useState(true);
  const [compactMode,  setCompactMode]  = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: c.bgBase }}>

      {/* ── Status Bar ── */}
      <div style={{
        height: 44, flexShrink: 0, background: c.bgPanel,
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: c.accentDim, border: `1px solid ${c.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <M size={9} color={c.accent} upper>System Settings</M>
          <M size={8} color={c.textLabel} upper>Lanbow Enterprise · V1</M>
        </div>
        <div style={{ flex: 1 }} />
        <button style={{
          fontFamily: c.mono, fontSize: 9, padding: '5px 14px',
          background: c.accent, border: 'none', borderRadius: 4,
          color: c.bgBase, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          boxShadow: `0 0 14px ${c.accentGlow}`,
        }}>Save Changes</button>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ padding: '20px 22px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Account */}
          <Section title="Account">
            <InputRow label="Display Name"  value="Siye @ Sandwichlab.Ai" />
            <InputRow label="Organisation"  value="Sandwichlab" />
            <InputRow label="Email"         value="siye@sandwichlab.ai" last />
          </Section>

          {/* Integrations */}
          <Section title="Integrations">
            <ConnCard
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
              name="Meta Ads"
              sub="Ad Account"
              id="8048 9042 9093 816"
              status="connected"
            />
            <ConnCard
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
              name="Meta Pixel"
              sub="Dataset"
              id="8834 8266 7767 853"
              status="connected"
            />
            <ConnCard
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
              name="Feishu / Lark"
              sub="Working Folder"
              id="Sandwichlab.Feishu.Cn"
              status="connected"
            />
            <ConnCard
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
              name="Analytics API"
              sub="Real-time data feed"
              status="pending"
            />
            <ConnCard
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
              name="Facebook Public Page"
              sub="LexiCollection_85"
              id="8313 5178 0067 375"
              status="connected"
            />
          </Section>

          {/* Ad Defaults */}
          <Section title="Ad Defaults">
            <InputRow label="Default Targeting"    value="female · 25–60 · US / CA / GB / AU" />
            <InputRow label="Default Daily Budget"  value="$1 / ad set" />
            <InputRow label="Default Bid Strategy"  value="LOWEST_COST_WITHOUT_CAP" />
            <InputRow label="Default Objective"     value="OUTCOME_SALES" last />
          </Section>

        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Notifications */}
          <Section title="Notifications">
            <Row label="System alerts" desc="Infrastructure and pipeline status changes">
              <Toggle value={notifSystem} onChange={setNotifSystem} />
            </Row>
            <Row label="Campaign updates" desc="Ad submission, approval, and status changes">
              <Toggle value={notifCampaign} onChange={setNotifCampaign} />
            </Row>
            <Row label="ROAS threshold alerts" desc="Notify when ROAS drops below 4.0×" last>
              <Toggle value={notifRoas} onChange={setNotifRoas} />
            </Row>
          </Section>

          {/* Automation */}
          <Section title="Automation">
            <Row label="Auto-optimization" desc="Allow Lanbow to adjust bids within configured limits">
              <Toggle value={autoOptimize} onChange={setAutoOptimize} />
            </Row>
            <Row label="Auto-pause on ROAS drop" desc="Pause all ads if ROAS falls below 3.0× for 2h" last>
              <Toggle value={autoPause} onChange={setAutoPause} />
            </Row>
          </Section>

          {/* Display */}
          <Section title="Display">
            <Row label="Dark mode" desc="Dark background with teal accent theme">
              <Toggle value={darkMode} onChange={setDarkMode} />
            </Row>
            <Row label="Compact layout" desc="Reduce padding density in data tables" last>
              <Toggle value={compactMode} onChange={setCompactMode} />
            </Row>
          </Section>

          {/* System info */}
          <Section title="System">
            {[
              { label: 'Version',          value: 'V1.0.0-beta' },
              { label: 'Engine',           value: 'Lanbow AI Command v4.2.1' },
              { label: 'Data Tracking ID', value: '8834 8266 7767 853' },
              { label: 'Facebook ID',      value: '8313 5178 0067 375' },
              { label: 'Last Sync',        value: '2 min ago',  accent: true },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${c.border}` : 'none',
              }}>
                <M size={9} color={c.textSec}>{row.label}</M>
                <M size={9} color={(row as any).accent ? c.accent : c.textSec}>{row.value}</M>
              </div>
            ))}
          </Section>

          {/* Danger zone */}
          <Section title="Danger Zone">
            <Row label="Reset all campaign configs" desc="Removes all submitted ad data. Cannot be undone.">
              <button style={{
                fontFamily: c.mono, fontSize: 9, padding: '4px 12px',
                background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.3)',
                borderRadius: 4, color: '#FF4466', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Reset</button>
            </Row>
            <Row label="Revoke all integrations" desc="Disconnect all connected accounts." last>
              <button style={{
                fontFamily: c.mono, fontSize: 9, padding: '4px 12px',
                background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.3)',
                borderRadius: 4, color: '#FF4466', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Revoke</button>
            </Row>
          </Section>

        </div>
      </div>
    </div>
  );
}
