import React, { useState } from 'react';
import { t } from './theme';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/NodeCard';
import { Sparkline } from '../components/ChartCard';

// ── Small shared pieces ──────────────────────────────────────────────────────
function Mono({
  children, size = 11, color = t.textSecondary, style,
}: {
  children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties;
}) {
  return (
    <span style={{ fontFamily: t.mono, fontSize: size, color, letterSpacing: '0.06em', ...style }}>
      {children}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Mono size={10} color={t.textSecondary} style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
      {children}
    </Mono>
  );
}

function StatusBadge({ text, variant = 'muted' }: { text: string; variant?: 'muted' | 'danger' | 'accent' }) {
  const colors = {
    muted: { bg: 'rgba(255,255,255,0.05)', color: t.textSecondary },
    danger: { bg: t.dangerDim, color: t.danger },
    accent: { bg: t.accentGlow, color: t.accent },
  }[variant];
  return (
    <span style={{
      fontFamily: t.mono, fontSize: 9, padding: '3px 8px',
      background: colors.bg, color: colors.color,
      borderRadius: 3, letterSpacing: '0.1em', textTransform: 'uppercase',
      border: `1px solid ${colors.color}20`,
    }}>
      {text}
    </span>
  );
}

// ── Pipeline Step ────────────────────────────────────────────────────────────
type StepStatus = 'done' | 'info' | 'paused' | 'pending';

function PipelineStep({
  label, value, status,
}: { label: string; value: string; status: StepStatus }) {
  const statusIcon =
    status === 'done'   ? '✓' :
    status === 'info'   ? 'ℹ' :
    status === 'paused' ? '⏸' : '○';
  const statusColor =
    status === 'done'   ? t.accent :
    status === 'info'   ? t.warn :
    status === 'paused' ? t.textMuted : t.textMuted;

  return (
    <div style={{
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: 6, padding: '14px 16px',
      width: 158, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Mono size={11} color={t.accent} style={{ textTransform: 'uppercase' }}>{label}</Mono>
        <span style={{ color: statusColor, fontSize: 12 }}>{statusIcon}</span>
      </div>
      <div style={{ fontFamily: t.sans, fontWeight: 700, fontSize: 18, color: t.textPrimary }}>
        {value}
      </div>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="2" viewBox="0 0 16 2">
        <line x1="0" y1="1" x2="14" y2="1" stroke={t.textMuted} strokeWidth="1" />
        <polyline points="10,0 14,1 10,2" fill="none" stroke={t.textMuted} strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Summary Row ──────────────────────────────────────────────────────────────
function SummaryCard({
  label, desc, value,
}: { label: string; desc?: string; value?: string }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '14px 18px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer',
        background: hov ? 'rgba(0,229,191,0.03)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div>
        <Label>{label}</Label>
        {desc && <div style={{ fontFamily: t.mono, fontSize: 11, color: t.textPrimary, marginTop: 4 }}>{desc}</div>}
        {value && <div style={{ fontFamily: t.sans, fontWeight: 700, fontSize: 18, color: t.textPrimary, marginTop: 2 }}>{value}</div>}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
      </svg>
    </div>
  );
}

// ── Campaign Table ────────────────────────────────────────────────────────────
const campaignRows = [
  { campaign: 'PURCHASE', status: 'ACTIVE', budget: '$2/set', targeting: '40', ads: '74', result: '1,240' },
  { campaign: 'FUTURE_SALES', status: 'PAUSED', budget: '$1.5/set', targeting: '38', ads: '60', result: '—' },
  { campaign: 'ROAD', status: 'ACTIVE', budget: '$3/set', targeting: '42', ads: '88', result: '2,010' },
];

function CampaignTable() {
  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 100px 100px 80px 60px 100px',
        padding: '8px 16px',
        borderBottom: `1px solid ${t.border}`,
      }}>
        {['CAMPAIGN', 'STATUS', 'BUDGET', 'TARGETING', 'ADS', 'RESULT'].map(h => (
          <Label key={h}>{h}</Label>
        ))}
      </div>
      {campaignRows.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 100px 80px 60px 100px',
            padding: '10px 16px',
            background: i % 2 === 0 ? t.bgRow : t.bgRowAlt,
            borderBottom: i < campaignRows.length - 1 ? `1px solid ${t.border}` : 'none',
            alignItems: 'center',
          }}
        >
          <Mono size={11} color={t.textPrimary}>{row.campaign}</Mono>
          <StatusBadge text={row.status} variant={row.status === 'ACTIVE' ? 'accent' : 'muted'} />
          <Mono size={11} color={t.textPrimary}>{row.budget}</Mono>
          <Mono size={11} color={t.textSecondary}>{row.targeting}</Mono>
          <Mono size={11} color={t.textSecondary}>{row.ads}</Mono>
          <Mono size={11} color={t.textPrimary}>{row.result}</Mono>
        </div>
      ))}
    </div>
  );
}

// ── Chat Input ───────────────────────────────────────────────────────────────
function ChatInput({ placeholder = 'Type a message...' }: { placeholder?: string }) {
  const [val, setVal] = useState('');
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'center',
      background: t.bgInput,
      border: `1px solid ${t.border}`,
      borderRadius: 8, padding: '10px 14px',
    }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: t.mono, fontSize: 11, color: t.textPrimary,
          '::placeholder': { color: t.textMuted },
        } as React.CSSProperties}
      />
      <Button variant="primary" size="sm" style={{ flexShrink: 0 }}>Submit</Button>
    </div>
  );
}

// ── Detail Table (Screen 2) ──────────────────────────────────────────────────
function DetailRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '160px 1fr',
      padding: '10px 0', borderBottom: `1px solid ${t.border}`,
      alignItems: 'center',
    }}>
      <Label>{label}</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Mono size={12} color={t.textPrimary}>{value}</Mono>
        {badge && <StatusBadge text={badge} variant="accent" />}
      </div>
    </div>
  );
}

// ── ROAS Donut ────────────────────────────────────────────────────────────────
function DonutChart({ value = 0.78, label = 'ROAS' }: { value?: number; label?: string }) {
  const r = 60, cx = 80, cy = 80;
  const circ = 2 * Math.PI * r;
  const stroke = circ * value;

  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: 24, display: 'flex',
      alignItems: 'center', gap: 24, minWidth: 280,
    }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.bgDeep} strokeWidth={14} />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={t.accent} strokeWidth={14}
          strokeDasharray={`${stroke} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 8px ${t.accent})` }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={t.textPrimary} fontFamily={t.sans} fontWeight={700} fontSize={22}>
          {Math.round(value * 100)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={t.textSecondary} fontFamily={t.mono} fontSize={10}>
          {label}
        </text>
      </svg>
      <div>
        <Label>Status</Label>
        <div style={{ fontFamily: t.sans, fontWeight: 700, fontSize: 20, color: t.accent, marginTop: 4 }}>
          Completed
        </div>
        <div style={{ marginTop: 16 }}>
          <Label>Performance</Label>
          <div style={{ fontFamily: t.mono, fontSize: 12, color: t.textPrimary, marginTop: 4 }}>
            5 books · 74 ads
          </div>
          <div style={{ fontFamily: t.mono, fontSize: 11, color: t.textSecondary }}>
            All campaigns delivered
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Waveform Chart ────────────────────────────────────────────────────────────
function WaveformChart() {
  const w = 560, h = 120;
  // Generate a multi-wave signal
  const points = Array.from({ length: 200 }, (_, i) => {
    const x = (i / 199) * w;
    const y = h / 2
      + Math.sin(i * 0.12) * 28
      + Math.sin(i * 0.05) * 18
      + Math.cos(i * 0.2) * 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: 20, flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Label>Signal Waveform Analysis</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['SIGNAL TYPE', 'CHANNEL', 'INFERENCE MODE'].map(btn => (
            <button key={btn} style={{
              fontFamily: t.mono, fontSize: 9, padding: '3px 8px',
              background: 'transparent', border: `1px solid ${t.border}`,
              color: t.textSecondary, borderRadius: 3, cursor: 'pointer',
              letterSpacing: '0.08em',
            }}>
              {btn}
            </button>
          ))}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={t.accent} stopOpacity={0.3} />
            <stop offset="50%" stopColor={t.accent} stopOpacity={1} />
            <stop offset="100%" stopColor={t.accent} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <polyline points={points} fill="none" stroke="url(#waveGrad)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Progress Log ─────────────────────────────────────────────────────────────
const logItems = [
  { done: true,  text: 'PULLED BOOKLIST — 5 ASSET BUNDLES (74 FILES)' },
  { done: true,  text: 'GENERATED 500-WORD ENGLISH AD BODIES FOR 5 BOOKS' },
  { done: true,  text: 'BUILT 1080×1080 CREATIVES (74 ADS) FOR 5 BOOKS' },
];

function ProgressLog() {
  return (
    <div style={{
      background: t.bgInput, border: `1px solid ${t.border}`,
      borderRadius: 8, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {logItems.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ color: item.done ? t.accent : t.textMuted, fontSize: 12, flexShrink: 0, marginTop: 1 }}>
            {item.done ? '✓' : '○'}
          </span>
          <Mono size={10} color={item.done ? t.textSecondary : t.textMuted}>
            {i + 1}. {item.text}
          </Mono>
        </div>
      ))}
    </div>
  );
}

// ── Screen 1: Initial chat + pipeline ────────────────────────────────────────
function Screen1() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* User bubble */}
      <div style={{
        alignSelf: 'flex-end', maxWidth: 400,
        background: t.bgBubble, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: '16px',
      }}>
        <Mono size={11} color={t.textSecondary} style={{ lineHeight: 1.7, display: 'block' }}>
          I want to run ads. Tenant lsn test, ad account 1323740839497080.<br />
          Plan is here: sandwichlab.feishu.cn/wiki/MDJxw…<br />
          Pull the materials, generate copy + creatives, submit to Meta.<br />
          Keep everything paused so I can review.
        </Mono>
      </div>

      {/* Agent response */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500 }}>
        <Mono size={12} color={t.textPrimary} style={{ lineHeight: 1.8, display: 'block' }}>
          Got it. Here is the execution plan I'll run before anything goes live:
        </Mono>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 8 }}>
          {[
            'Verify auth on siye2 / dev for ad account 1323…7080',
            'Read the ad plan from Feishu and resolve the booklist + assets',
            'Download booklist CSV + per-book asset bundles',
            'Generate ~500-word English ad bodies per book',
            'Build 1080×1080 creatives, assemble copies',
            'Submit campaigns / ad sets / ads to Meta — Cross-check every config',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Mono size={11} color={t.accent} style={{ flexShrink: 0 }}>—</Mono>
              <Mono size={11} color={t.textSecondary} style={{ lineHeight: 1.6 }}>{step}</Mono>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 4 }}>
          <StatusBadge text="ALL paused" variant="danger" />
        </div>
      </div>

      {/* Pipeline */}
      <div>
        <Label>Execution Pipeline:</Label>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 0 }}>
          <PipelineStep label="01_Feishu"   value="74 files"    status="done" />
          <PipelineArrow />
          <PipelineStep label="02_ETL"      value="validated"   status="done" />
          <PipelineArrow />
          <PipelineStep label="03_Generate" value="5 + 74"      status="done" />
          <PipelineArrow />
          <PipelineStep label="04_Submit"   value="5/5/74/74"   status="done" />
          <PipelineArrow />
          <PipelineStep label="05_Publish"  value="paused"      status="paused" />
        </div>
      </div>

      {/* Summary cards */}
      <div style={{
        display: 'flex', background: t.bgCard,
        border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden',
      }}>
        <SummaryCard
          label="Creative & Copy"
          desc="5 books · 74 creatives · 505 words avg"
        />
        <div style={{ width: 1, background: t.border }} />
        <SummaryCard
          label="Campaigns Submitted"
          desc="3 campaigns · 5 ad sets · 74 ads"
        />
        <div style={{ width: 1, background: t.border }} />
        <SummaryCard
          label="Targeting"
          desc="Thunts 03-83 / 40 / 39 / 40"
        />
      </div>

      {/* Campaign table */}
      <CampaignTable />

      {/* Chat input */}
      <ChatInput placeholder="Enter your Facebook, Instagram, Shopify, or website link…" />
    </div>
  );
}

// ── Screen 2: Campaign detail ─────────────────────────────────────────────────
function Screen2() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Detail config */}
      <div style={{
        background: t.bgCard, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: '20px 24px',
      }}>
        <DetailRow label="Pivot"         value="sandwichtest / PURCHASE" />
        <DetailRow label="Daily Budget"  value="$2 / set = $10" />
        <DetailRow label="Targeting"     value="Thunts: 03-83 / 40 / 39 / 40" />
        <DetailRow label="Billing"       value="IMPRESSIONS" badge="ACTIVE" />
        <DetailRow label="Ad Creative"   value="DEVICE_FINGERPRINT" />
        <DetailRow label="Bid Strategy"  value="LOWEST_COST_WITHOUT_CAP" />
        <DetailRow label="Headline"      value="first three name [second]" />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="primary" size="md">Launch Ad Task</Button>
        <Button variant="ghost" size="md">Edit</Button>
      </div>

      {/* User follow-up */}
      <div style={{
        alignSelf: 'flex-end', maxWidth: 360,
        background: t.bgBubble, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: 14,
      }}>
        <Mono size={11} color={t.textSecondary}>Are you still working?</Mono>
      </div>

      {/* Progress log */}
      <ProgressLog />

      {/* Chat input */}
      <ChatInput placeholder="Submit" />
    </div>
  );
}

// ── Screen 3: ROAS analysis ───────────────────────────────────────────────────
function Screen3() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Config summary (same as screen 2 but condensed) */}
      <div style={{
        background: t.bgCard, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: '14px 24px',
        display: 'flex', gap: 40, flexWrap: 'wrap',
      }}>
        <div>
          <Label>Bid Strategy</Label>
          <Mono size={11} color={t.textPrimary} style={{ display: 'block', marginTop: 4 }}>
            LOWEST_COST_WITHOUT_CAP
          </Mono>
        </div>
        <div>
          <Label>Headline</Label>
          <Mono size={11} color={t.textPrimary} style={{ display: 'block', marginTop: 4 }}>
            first three name [second]
          </Mono>
        </div>
        <Button variant="outline" size="sm" style={{ alignSelf: 'center' }}>Re-Route Traffic</Button>
      </div>

      {/* User follow-up */}
      <div style={{
        alignSelf: 'flex-end', maxWidth: 280,
        background: t.bgBubble, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: 14,
      }}>
        <Mono size={11} color={t.textSecondary}>Are you still working?</Mono>
      </div>

      {/* Progress log */}
      <ProgressLog />

      {/* Analytics row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <DonutChart value={0.78} label="ROAS" />
        <WaveformChart />
      </div>

      {/* Chat input */}
      <ChatInput placeholder="Submit" />
    </div>
  );
}

// ── CommPage with tab navigation ──────────────────────────────────────────────
export function CommPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const tabs: { id: 1 | 2 | 3; label: string }[] = [
    { id: 1, label: 'Planning' },
    { id: 2, label: 'Execution' },
    { id: 3, label: 'Analysis' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: `1px solid ${t.border}`,
        padding: '0 24px', background: t.bgPanel,
        flexShrink: 0,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStep(tab.id)}
            style={{
              fontFamily: t.mono, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '12px 20px',
              border: 'none', borderBottom: step === tab.id ? `2px solid ${t.accent}` : '2px solid transparent',
              background: 'transparent',
              color: step === tab.id ? t.accent : t.textSecondary,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {step === 1 && <Screen1 />}
        {step === 2 && <Screen2 />}
        {step === 3 && <Screen3 />}
      </div>
    </div>
  );
}
