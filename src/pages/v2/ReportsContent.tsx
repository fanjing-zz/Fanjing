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
  `;
  document.head.appendChild(s);
}

// ─── Shared Section Card ──────────────────────────────────────────────────────
function SectionCard({
  labelLeft,
  metaRight,
  children,
}: {
  labelLeft: string;
  metaRight?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: c.bgCard,
      border: `1px solid ${c.border}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 18px',
        borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: c.mono,
          fontSize: 10,
          color: c.textSec,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
        }}>{labelLeft}</span>
        {metaRight && (
          <span style={{
            fontFamily: c.mono,
            fontSize: 9,
            color: c.textMute,
            letterSpacing: '0.05em',
          }}>{metaRight}</span>
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Small badge pill ─────────────────────────────────────────────────────────
function Badge({
  text,
  variant = 'mute',
}: {
  text: string;
  variant?: 'mute' | 'accent' | 'green';
}) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    mute:   { bg: 'rgba(255,255,255,0.04)', color: c.textSec,  border: c.border },
    accent: { bg: c.accentDim,              color: c.accent,   border: c.borderStrong },
    green:  { bg: 'rgba(0,204,119,0.12)',   color: '#00CC77',  border: 'rgba(0,204,119,0.3)' },
  };
  const s = colors[variant];
  return (
    <span style={{
      fontFamily: c.mono,
      fontSize: 9,
      padding: '3px 8px',
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: 3,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      flexShrink: 0,
    }}>{text}</span>
  );
}

// ─── Funnel bar row ───────────────────────────────────────────────────────────
function FunnelRow({
  step,
  label,
  pct,
  count,
  drop,
  critical = false,
  proxy = false,
}: {
  step: string;
  label: string;
  pct: number;
  count: string;
  drop: string;
  critical?: boolean;
  proxy?: boolean;
}) {
  const barColor = critical ? '#FF4466' : c.accent;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr 90px 80px',
      alignItems: 'center',
      gap: 12,
      padding: '3px 0',
    }}>
      <span style={{
        fontFamily: c.mono,
        fontSize: 10,
        color: proxy ? c.textSec : c.textPri,
        fontStyle: proxy ? 'italic' : undefined,
        letterSpacing: '0.02em',
      }}>{step} {label}</span>
      <div style={{ height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.max(pct, 0.5)}%`,
          background: critical
            ? `linear-gradient(90deg, rgba(255,68,102,0.6), rgba(255,68,102,0.9))`
            : `linear-gradient(90deg, rgba(0,177,162,0.5), rgba(0,177,162,0.85))`,
          borderRadius: 3,
          boxShadow: critical ? `0 0 6px rgba(255,68,102,0.4)` : `0 0 6px rgba(0,177,162,0.25)`,
        }} />
      </div>
      <span style={{
        fontFamily: c.mono,
        fontSize: 11,
        color: critical ? '#FF4466' : c.textPri,
        fontWeight: 700,
        textAlign: 'right' as const,
      }}>{count}</span>
      <span style={{
        fontFamily: c.mono,
        fontSize: 10,
        color: critical ? '#FF4466' : drop === '—' ? c.textMute : c.textSec,
        textAlign: 'right' as const,
      }}>{drop}</span>
    </div>
  );
}

// ─── MOD-02 Full Funnel ───────────────────────────────────────────────────────
function Mod02Funnel() {
  const rows = [
    { step: '①', label: 'PageView',          pct: 100,  count: '1,516', drop: '—',      critical: false, proxy: true  },
    { step: '②', label: 'ViewContent',       pct: 100,  count: '1,516', drop: '0.0%',   critical: false, proxy: true  },
    { step: '③', label: 'PlayStart',         pct: 61.3, count: '930',   drop: '−38.7%', critical: false, proxy: false },
    { step: '④', label: 'WatchProgress',     pct: 20.9, count: '317',   drop: '−65.9%', critical: false, proxy: false },
    { step: '⑤', label: 'PaywallView',       pct: 19.5, count: '296',   drop: '−6.6%',  critical: false, proxy: true  },
    { step: '⑥', label: 'InitiateCheckout',  pct: 0.4,  count: '6',     drop: '−98.0%', critical: true,  proxy: false },
    { step: '⑦', label: 'Purchase',          pct: 0.13, count: '2',     drop: '−66.7%', critical: false, proxy: false },
  ];
  return (
    <SectionCard
      labelLeft="MOD-02 · Full funnel · 7 nodes"
      metaRight="2026-05-13 → 2026-05-19"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Column header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 90px 80px',
          gap: 12,
          marginBottom: 4,
        }}>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Stage</span>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Volume</span>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em', textAlign: 'right' as const }}>Count</span>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em', textAlign: 'right' as const }}>Drop</span>
        </div>
        {rows.map(r => (
          <FunnelRow key={r.step} {...r} />
        ))}
      </div>

      {/* Danger callout */}
      <div style={{
        marginTop: 16,
        borderLeft: `3px solid #FF4466`,
        padding: '10px 14px',
        background: 'rgba(255,68,102,0.04)',
        borderRadius: '0 4px 4px 0',
      }}>
        <span style={{
          fontFamily: c.mono,
          fontSize: 10,
          color: '#FF4466',
          lineHeight: 1.6,
        }}>
          主要漏洞：⑤→⑥ 流失 98%。296 人看到付费墙，只有 6 人点击 Stripe。
        </span>
      </div>

      {/* Bottom summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${c.border}`,
      }}>
        <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec }}>整体转化率（Click → Purchase）</span>
        <span style={{ fontFamily: c.mono, fontSize: 16, fontWeight: 700, color: c.accent }}>0.13%</span>
      </div>
    </SectionCard>
  );
}

// ─── MOD-03 Meta Ad Data ──────────────────────────────────────────────────────
function Mod03Meta() {
  const leftRows = [
    { label: 'Spend',       value: '$274.21', highlight: true,  color: c.accent, warn: false },
    { label: '外部收入',    value: '$13.99',  highlight: false, color: c.textPri, warn: false },
    { label: 'Impressions', value: '50,079',  highlight: false, color: c.textPri, warn: false },
    { label: '外部付费',    value: '2 笔',    highlight: false, color: c.textPri, warn: false },
    { label: 'Clicks',      value: '8,245',   highlight: true,  color: c.accent, warn: false },
  ];
  const rightRows = [
    { label: 'CTR',          value: '16.46%', highlight: false, color: '#FFB800', warn: true  },
    { label: 'Reach',        value: '42,741', highlight: false, color: c.textPri, warn: false },
    { label: 'Frequency',    value: '1.17',   highlight: false, color: c.textPri, warn: false },
    { label: 'CPC',          value: '$0.033', highlight: false, color: '#FFB800', warn: true  },
    { label: 'ACTIVE 校园',  value: '0（已暂停）', highlight: false, color: c.textMute, warn: false },
  ];

  const MetaRow = ({ label, value, color, warn }: { label: string; value: string; color: string; warn: boolean }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '7px 0',
      borderBottom: `1px dotted ${c.border}`,
    }}>
      <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec }}>{label}</span>
      <span style={{
        fontFamily: c.mono,
        fontSize: 12,
        fontWeight: 700,
        color,
      }}>
        {value}{warn && <span style={{ marginLeft: 4, fontSize: 10 }}>⚠</span>}
      </span>
    </div>
  );

  return (
    <SectionCard
      labelLeft="MOD-03 · Meta ad data · W20"
      metaRight="act_800509389474426"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
        <div>{leftRows.map(r => <MetaRow key={r.label} {...r} />)}</div>
        <div>{rightRows.map(r => <MetaRow key={r.label} {...r} />)}</div>
      </div>

      {/* Amber alert */}
      <div style={{
        marginTop: 16,
        borderLeft: `3px solid #FFB800`,
        padding: '10px 14px',
        background: 'rgba(255,184,0,0.04)',
        borderRadius: '0 4px 4px 0',
      }}>
        <span style={{ fontFamily: c.mono, fontSize: 10, color: '#FFB800', lineHeight: 1.6 }}>
          流量质量警示 — CTR 16% + CPC $0.033 = 点击农场签名。drama runbook §6: 低于 $0.01 + 4K+ 点击几乎必假
        </span>
      </div>
    </SectionCard>
  );
}

// ─── MOD-04 Country Distribution ─────────────────────────────────────────────
function Mod04Country() {
  const countries = [
    { flag: '🇵🇭', code: 'PH', pct: 100, mins: '785 min', share: '11.5%' },
    { flag: '🇳🇬', code: 'NG', pct: 89,  mins: '700 min', share: '10.2%' },
    { flag: '🇺🇸', code: 'US', pct: 55,  mins: '429 min', share: '6.3%'  },
    { flag: '🇨🇩', code: 'CD', pct: 53,  mins: '419 min', share: '6.1%'  },
    { flag: '🇮🇩', code: 'ID', pct: 50,  mins: '390 min', share: '5.7%'  },
  ];

  return (
    <SectionCard
      labelLeft="MOD-04 · Country distribution · CF Stream"
      metaRight="Top 5 by watch time"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
        {/* Left: country bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {countries.map(ct => (
            <div key={ct.code} style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 70px 60px',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>
                {ct.flag} {ct.code}
              </span>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${ct.pct}%`,
                  background: `linear-gradient(90deg, rgba(0,177,162,0.4), rgba(0,177,162,0.8))`,
                  borderRadius: 3,
                }} />
              </div>
              <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textSec, textAlign: 'right' as const }}>{ct.mins}</span>
              <span style={{ fontFamily: c.mono, fontSize: 10, fontWeight: 700, color: c.accent, textAlign: 'right' as const }}>{ct.share}</span>
            </div>
          ))}
        </div>

        {/* Right: comparison box */}
        <div style={{
          border: `1px dashed ${c.borderStrong}`,
          borderRadius: 6,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div>
            <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textLabel, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>DB Top 5</span>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, marginTop: 4 }}>SG · US · GB · ZA · FR</div>
          </div>
          <div>
            <span style={{ fontFamily: c.mono, fontSize: 9, color: c.textLabel, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>CF Top 5</span>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, marginTop: 4 }}>PH · NG · US · CD · ID</div>
          </div>
          <div style={{
            borderLeft: `3px solid #FFB800`,
            padding: '8px 10px',
            background: 'rgba(255,184,0,0.04)',
            borderRadius: '0 4px 4px 0',
          }}>
            <span style={{ fontFamily: c.mono, fontSize: 9, color: '#FFB800', lineHeight: 1.6 }}>
              两边完全不重合 — 按 DB geo 做投放优化建立在错样本
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── MOD-05 Known Data Gaps ───────────────────────────────────────────────────
function Mod05DataGaps() {
  const gaps = [
    {
      num: '#1',
      variant: 'crit',
      title: 'Beacon coverage gap ~60%',
      body: 'CF Stream 6,847 min vs DB 2,682 min。Next.js hydration 慢，player mount 晚，beacon miss rate 极高。',
      span: false,
    },
    {
      num: '#2',
      variant: 'crit',
      title: 'DB geo ≠ CF Stream geo',
      body: '新兴市场弱网失败用户不可见。DB 只记录成功流的会话，CF 记录所有尝试。',
      span: false,
    },
    {
      num: '#3',
      variant: 'warn',
      title: 'Stripe 内部测试单占 31%',
      body: 'filter @sandwichlab.ai + test_% 后真实付费仅 2 笔。需要在 Stripe 层过滤内部账号。',
      span: false,
    },
    {
      num: '#4',
      variant: 'warn',
      title: 'Stripe customer_details 全空',
      body: '用户根本没到填卡页。PaywallView → InitiateCheckout 流失 98% 意味着跳转链路断裂。',
      span: false,
    },
    {
      num: '#5',
      variant: 'info',
      title: 'Subscribe→Purchase 命名漂移',
      body: 'Stripe event subscribe 与 Meta Purchase 事件未对齐，导致 ROAS 分母错误。需要统一事件命名规范。',
      span: true,
    },
  ];

  const borderColors: Record<string, string> = {
    crit: '#FF4466',
    warn: '#FFB800',
    info: '#3B82F6',
  };

  return (
    <SectionCard
      labelLeft="MOD-05 · Known data gaps · W20"
      metaRight="5 open items"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {gaps.map(g => (
          <div
            key={g.num}
            style={{
              background: 'rgba(0,0,0,0.18)',
              border: `1px solid ${c.border}`,
              borderLeft: `3px solid ${borderColors[g.variant]}`,
              borderRadius: 6,
              padding: '12px 14px',
              gridColumn: g.span ? '1 / -1' : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontFamily: c.mono,
                fontSize: 8,
                color: borderColors[g.variant],
                background: `${borderColors[g.variant]}18`,
                border: `1px solid ${borderColors[g.variant]}50`,
                borderRadius: 3,
                padding: '2px 6px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
              }}>{g.variant}</span>
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

// ─── MOD-06 Next Week Actions ─────────────────────────────────────────────────
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
    MED:  { background: 'rgba(255,184,0,0.12)',   color: '#FFB800', border: '1px solid rgba(255,184,0,0.4)' },
    LOW:  { background: 'rgba(59,130,246,0.12)',  color: '#3B82F6', border: '1px solid rgba(59,130,246,0.4)' },
  };

  return (
    <SectionCard
      labelLeft="MOD-06 · Next week actions · W21"
      metaRight="6 items"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actions.map((a, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '70px 100px 1fr',
            gap: 12,
            padding: '11px 14px',
            background: 'rgba(0,0,0,0.18)',
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            alignItems: 'center',
          }}>
            <span style={{
              fontFamily: c.mono,
              fontSize: 9,
              padding: '3px 8px',
              borderRadius: 3,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              textAlign: 'center' as const,
              ...severityStyles[a.severity],
            }}>{a.severity}</span>
            <span style={{
              fontFamily: c.mono,
              fontSize: 10,
              color: c.textSec,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.border}`,
              borderRadius: 3,
              padding: '2px 8px',
              textAlign: 'center' as const,
            }}>{a.owner}</span>
            <span style={{
              fontFamily: c.mono,
              fontSize: 11,
              color: c.textPri,
              lineHeight: 1.5,
            }}>{a.task}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── MOD-07 Sources Footer ────────────────────────────────────────────────────
function Mod07Sources() {
  const sources = [
    'Supabase PG (26 表)',
    'Stripe REST',
    'Cloudflare Stream',
    'Cloudflare Firewall',
    'Meta Marketing API ×2',
    'GitHub local clone',
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(0,177,162,0.02)',
      border: `1px solid ${c.border}`,
      borderRadius: 8,
      padding: '14px 18px',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginRight: 4 }}>Sources</span>
        {sources.map(src => (
          <span key={src} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: c.mono,
            fontSize: 9,
            color: c.textSec,
            background: 'rgba(0,0,0,0.18)',
            border: `1px solid ${c.border}`,
            borderRadius: 4,
            padding: '3px 8px',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00CC77', flexShrink: 0, boxShadow: '0 0 4px #00CC77' }} />
            {src}
          </span>
        ))}
      </div>
      <span style={{
        fontFamily: c.mono,
        fontSize: 9,
        color: c.textMute,
        flexShrink: 0,
        marginLeft: 16,
      }}>drama-pipeline-mcp v1.1</span>
    </div>
  );
}

// ─── Hero KPI Cards ───────────────────────────────────────────────────────────
function HeroKPIRow() {
  const cards = [
    {
      label: 'ROAS',
      value: '0.051×',
      valueColor: '#FF4466',
      border: 'rgba(255,68,102,0.35)',
      shadow: '0 0 32px rgba(255,68,102,0.06) inset',
      note: '投 $1 收 $0.05 · 目标 ROAS = 0.5，差 10×',
    },
    {
      label: 'Beacon Coverage Gap',
      value: '60.8%',
      valueColor: '#FFB800',
      border: 'rgba(255,184,0,0.35)',
      shadow: '0 0 32px rgba(255,184,0,0.06) inset',
      note: 'CF Stream 6,847 min vs DB 2,682 min · ≈ 4,165 min 未被记录',
    },
    {
      label: 'Paywall → Checkout 流失',
      value: '98%',
      valueColor: '#FF4466',
      border: 'rgba(255,68,102,0.35)',
      shadow: '0 0 32px rgba(255,68,102,0.06) inset',
      note: '296 PaywallView → 6 InitiateCheckout · 几乎没进 Stripe',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 14,
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: c.bgCard,
          border: `1px solid ${card.border}`,
          borderRadius: 8,
          padding: '18px 20px',
          boxShadow: card.shadow,
        }}>
          <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginBottom: 10 }}>
            {card.label}
          </div>
          <div style={{
            fontFamily: c.mono,
            fontSize: 48,
            fontWeight: 700,
            color: card.valueColor,
            lineHeight: 1,
            marginBottom: 12,
            textShadow: `0 0 24px ${card.valueColor}60`,
          }}>
            {card.value}
          </div>
          <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, lineHeight: 1.6 }}>
            {card.note}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Report Selector Tabs ─────────────────────────────────────────────────────
const TABS = [
  { id: 'w20', label: 'W20', range: 'May 13–19' },
  { id: 'w19', label: 'W19', range: 'May 6–12' },
  { id: 'w18', label: 'W18', range: 'Apr 29–May 5' },
];

// ─── Main Export ──────────────────────────────────────────────────────────────
export function ReportsContent() {
  const [selectedTab, setSelectedTab] = useState('w20');

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      background: c.bgBase,
    }}>
      {/* ── Status Bar ── */}
      <div style={{
        height: 44,
        flexShrink: 0,
        background: c.bgPanel,
        borderBottom: `1px solid ${c.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 10,
      }}>
        <div style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          background: c.accentDim,
          border: `1px solid ${c.borderStrong}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {/* chart-bar icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontFamily: c.mono, fontSize: 9, color: c.accent, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
            Lanbow Reporting Engine
          </span>
          <span style={{ fontFamily: c.mono, fontSize: 8, color: c.textLabel, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            Weekly Ops Review
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0,204,119,0.06)',
          border: '1px solid rgba(0,204,119,0.2)',
          borderRadius: 5,
          padding: '4px 10px',
        }}>
          <div style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#00CC77',
            animation: 'rpt-live-pulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: c.mono, fontSize: 9, color: '#00CC77', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            Report Ready
          </span>
        </div>
      </div>

      {/* ── Report Selector Tabs ── */}
      <div style={{
        padding: '0 24px',
        background: c.bgPanel,
        borderBottom: `1px solid ${c.border}`,
        display: 'flex',
        gap: 0,
        overflowX: 'auto' as const,
        flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const active = tab.id === selectedTab;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${c.accent}` : '2px solid transparent',
                padding: '10px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: -1,
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {active && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent, boxShadow: `0 0 5px ${c.accent}`, flexShrink: 0 }} />
              )}
              <span style={{ fontFamily: c.mono, fontSize: 11, fontWeight: active ? 700 : 400, color: active ? c.accent : c.textMute, letterSpacing: '0.06em' }}>
                {tab.label}
              </span>
              <span style={{ fontFamily: c.mono, fontSize: 9, color: active ? c.textSec : c.textMute }}>
                · {tab.range}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Report Header ── */}
        <div style={{ padding: '20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <div style={{ fontFamily: c.sans, fontSize: 24, fontWeight: 800, color: c.textPri, marginBottom: 6 }}>
              drama 投放复盘
            </div>
            <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textSec, marginBottom: 4 }}>
              2026-05-13 → 2026-05-19 · PopularReels &amp; Bestshort (act_800509389474426)
            </div>
            <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute }}>
              数据导向的 7 天产品 + 投放诊断：核心异常 / 漏斗瓶颈 / 流量真相 / 缺口 / 行动
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
            <Badge text="W20" variant="mute" />
            <Badge text="7 day window" variant="mute" />
            <Badge text="USD" variant="mute" />
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: c.mono,
              fontSize: 9,
              padding: '3px 9px',
              background: 'rgba(0,204,119,0.12)',
              color: '#00CC77',
              border: '1px solid rgba(0,204,119,0.3)',
              borderRadius: 3,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00CC77' }} />
              data live
            </div>
          </div>
        </div>

        {/* ── Hero KPI Row ── */}
        <HeroKPIRow />

        {/* ── Section Cards ── */}
        <Mod02Funnel />
        <Mod03Meta />
        <Mod04Country />
        <Mod05DataGaps />
        <Mod06Actions />

        {/* ── Sources Footer ── */}
        <Mod07Sources />

        {/* ── Generation Footer ── */}
        <div style={{
          textAlign: 'center' as const,
          marginTop: 20,
          fontFamily: c.mono,
          fontSize: 9,
          color: c.textMute,
          paddingBottom: 8,
        }}>
          生成时间 2026-05-20 · 数据 100% 实测拉取 · 无人工填充 · 周期 2026-05-13 → 2026-05-19 (W20)
        </div>

      </div>
    </div>
  );
}
