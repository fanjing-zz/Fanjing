import React, { useState, useRef, useCallback } from 'react';
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

const Badge = ({ text, variant = 'muted' }: {
  text: string; variant?: 'muted' | 'active' | 'live' | 'warn' | 'paused';
}) => {
  const s = {
    muted:  { bg: 'rgba(255,255,255,0.04)', color: c.textSec,  border: c.border },
    active: { bg: 'rgba(0,177,162,0.08)',   color: c.accent,   border: 'rgba(0,177,162,0.22)' },
    live:   { bg: 'rgba(0,204,119,0.10)',   color: '#00CC77',  border: 'rgba(0,204,119,0.28)' },
    warn:   { bg: 'rgba(255,184,0,0.10)',   color: '#FFB800',  border: 'rgba(255,184,0,0.25)' },
    paused: { bg: 'rgba(59,130,246,0.10)',  color: '#3B82F6',  border: 'rgba(59,130,246,0.25)' },
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

// ─── Upload types ─────────────────────────────────────────────────────────────
interface UploadItem {
  id: string;
  name: string;
  sizeStr: string;
  format: 'IMAGE' | 'VIDEO';
  progress: number;
  status: 'queued' | 'uploading' | 'processing' | 'validating' | 'done' | 'error';
  errorMsg?: string;
  bookTag: string;
}

function fmtBytes(b: number): string {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const books = [
  { title: 'Crimson Tides',      creatives: 15, words: 512, ctrForecast: 3.1, format: '1080×1080', status: 'active'  as const },
  { title: 'Silent Echoes',      creatives: 15, words: 498, ctrForecast: 2.7, format: '1080×1080', status: 'active'  as const },
  { title: 'The Last Ember',     creatives: 14, words: 521, ctrForecast: 2.4, format: '1080×1350', status: 'active'  as const },
  { title: 'Whispers at Dusk',   creatives: 15, words: 503, ctrForecast: 1.9, format: '1080×1080', status: 'warn'    as const },
  { title: 'Beyond the Horizon', creatives: 15, words: 491, ctrForecast: 2.2, format: '1080×1920', status: 'active'  as const },
];

const variants = [
  { label: 'Hook A',  preview: 'She never expected to fall for someone like him. After years of playing it safe...', ctr: 3.1, impressions: '12.4K', spend: '$14.20' },
  { label: 'Hook B',  preview: 'One night changed everything. In a city that never sleeps, their worlds collided...', ctr: 2.7, impressions: '10.8K', spend: '$12.60' },
  { label: 'Hook C',  preview: 'The last thing she wanted was to feel again. But fate had other plans when...', ctr: 2.4, impressions: '9.2K',  spend: '$11.30' },
];

const copyText = `She never expected to fall for someone like him.

After years of playing it safe, Maya Chen had built walls so high even she forgot what she was protecting. A high-powered attorney in New York's cutthroat legal world, she'd traded late nights and love stories for case files and client calls.

Then comes Kai — brooding, impossible, achingly beautiful — a marine biologist who washes up into her carefully ordered life like a wave that refuses to recede.

Their worlds shouldn't collide. They barely speak the same language. But when a shared case pulls them into the same orbit, Maya discovers that the most dangerous contracts aren't the ones you sign — they're the ones written in silence, between two people who should know better.`;

const creativeCards = [
  {
    book: 'Crimson Tides', variant: 'A', format: 'IMAGE', size: '1080×1080',
    gradient: 'radial-gradient(ellipse at 40% 35%, #1a0a2e 0%, #0d1520 60%, #060d14 100%)',
    overlay: (
      <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
        <defs>
          <linearGradient id="cg1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a0035" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#00B1A2" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        <path d="M 0 120 Q 80 60 160 100 L 160 160 L 0 160 Z" fill="url(#cg1)" opacity={0.7}/>
        <circle cx="80" cy="65" r="28" fill="none" stroke="rgba(180,100,140,0.4)" strokeWidth="0.8"/>
        <circle cx="80" cy="65" r="16" fill="rgba(180,80,120,0.2)"/>
      </svg>
    ),
    ctr: '3.1%', status: 'active' as const,
  },
  {
    book: 'Silent Echoes', variant: 'B', format: 'IMAGE', size: '1080×1080',
    gradient: 'linear-gradient(145deg, #071520 0%, #0c1e2a 50%, #040e14 100%)',
    overlay: (
      <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
        {[20, 40, 60, 80, 100].map((r, i) => (
          <circle key={r} cx="80" cy="80" r={r} fill="none" stroke={c.accent} strokeWidth="0.5" opacity={0.5 - i * 0.08}/>
        ))}
        <line x1="80" y1="10" x2="80" y2="150" stroke={c.accent} strokeWidth="0.4" opacity={0.25}/>
        <line x1="10" y1="80" x2="150" y2="80" stroke={c.accent} strokeWidth="0.4" opacity={0.25}/>
      </svg>
    ),
    ctr: '2.7%', status: 'active' as const,
  },
  {
    book: 'The Last Ember', variant: 'A', format: 'IMAGE', size: '1080×1350',
    gradient: 'linear-gradient(160deg, #1a0c05 0%, #2a1208 40%, #0d0805 100%)',
    overlay: (
      <svg viewBox="0 0 160 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }}>
        <defs>
          <radialGradient id="cg2" cx="50%" cy="75%">
            <stop offset="0%" stopColor="#FF6622" stopOpacity={0.7}/>
            <stop offset="60%" stopColor="#FF2200" stopOpacity={0.2}/>
            <stop offset="100%" stopColor="transparent" stopOpacity={0}/>
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="150" rx="60" ry="40" fill="url(#cg2)"/>
        {[0,1,2,3,4].map(i => (
          <path key={i} d={`M ${72+i*4} 110 Q ${70+i*5} 80 ${68+i*6} 60`}
            fill="none" stroke="#FF8844" strokeWidth="1" opacity={0.3 - i*0.04}/>
        ))}
      </svg>
    ),
    ctr: '2.4%', status: 'active' as const,
  },
  {
    book: 'Whispers at Dusk', variant: 'A', format: 'IMAGE', size: '1080×1080',
    gradient: 'linear-gradient(135deg, #0a0f1a 0%, #141c2a 45%, #080e18 100%)',
    overlay: (
      <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={i * 22} y1="0" x2={i * 22 + 10} y2="160"
            stroke="rgba(100,130,200,0.18)" strokeWidth="8"/>
        ))}
        <circle cx="80" cy="80" r="30" fill="none" stroke="rgba(150,170,220,0.3)" strokeWidth="0.8"/>
        <circle cx="80" cy="80" r="5" fill="rgba(150,170,220,0.6)"/>
      </svg>
    ),
    ctr: '1.9%', status: 'warn' as const,
  },
  {
    book: 'Beyond the Horizon', variant: 'B', format: 'STORY', size: '1080×1920',
    gradient: 'linear-gradient(170deg, #041520 0%, #083040 40%, #00253a 70%, #003330 100%)',
    overlay: (
      <svg viewBox="0 0 160 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }}>
        <defs>
          <linearGradient id="cg3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00B1A2" stopOpacity={0.6}/>
            <stop offset="100%" stopColor="transparent" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <path d="M 0 160 Q 40 120 80 140 Q 120 160 160 110 L 160 200 L 0 200 Z" fill="url(#cg3)"/>
        {[0,1,2].map(i => (
          <ellipse key={i} cx={30 + i * 50} cy={100 - i * 15} rx={12 - i * 2} ry={8 - i}
            fill="rgba(0,177,162,0.15)"/>
        ))}
      </svg>
    ),
    ctr: '2.2%', status: 'active' as const,
  },
  {
    book: 'Crimson Tides', variant: 'B', format: 'VIDEO', size: '1920×1080',
    gradient: 'linear-gradient(135deg, #10061a 0%, #1a0a28 50%, #0a0612 100%)',
    overlay: (
      <svg viewBox="0 0 160 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={i * 14} y={0} width={1.5} height={120}
            fill={c.accent} opacity={0.06 + (i % 3) * 0.06}/>
        ))}
        <circle cx="80" cy="60" r="20" fill="none" stroke="rgba(180,100,180,0.5)" strokeWidth="1.2"/>
        <polygon points="74,52 74,68 90,60" fill="rgba(180,100,180,0.7)"/>
      </svg>
    ),
    ctr: '3.0%', status: 'active' as const,
  },
  {
    book: 'Silent Echoes', variant: 'C', format: 'IMAGE', size: '1080×1350',
    gradient: 'radial-gradient(ellipse at 60% 40%, #0a1e2a 0%, #060f16 70%, #030810 100%)',
    overlay: (
      <svg viewBox="0 0 160 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const y = 40 + i * 28, amp = 20 - i * 2;
          const pts = Array.from({ length: 40 }, (_, j) => {
            const x = (j / 39) * 160;
            return `${x.toFixed(1)},${(y + Math.sin((j / 39) * Math.PI * 4 + i) * amp).toFixed(1)}`;
          }).join(' ');
          return <polyline key={i} points={pts} fill="none" stroke={c.accent} strokeWidth="0.6" opacity={0.12 + i * 0.06}/>;
        })}
      </svg>
    ),
    ctr: '2.5%', status: 'active' as const,
  },
  {
    book: 'The Last Ember', variant: 'C', format: 'IMAGE', size: '1080×1080',
    gradient: 'linear-gradient(150deg, #1a1005 0%, #2a1a08 40%, #0e0c05 100%)',
    overlay: (
      <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={20 + i * 26} y={60 + i * 8} width={18} height={80 - i * 10}
            fill={`rgba(255,${100 - i * 15},${30 - i * 5},${0.2 + i * 0.05})`} rx={2}/>
        ))}
      </svg>
    ),
    ctr: '2.1%', status: 'active' as const,
  },
];

// ─── Book Production Table ────────────────────────────────────────────────────
function BookTable({ activeBook, onSelect }: { activeBook: number; onSelect: (i: number) => void }) {
  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 80px 72px 90px 80px 72px',
        padding: '8px 16px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.03)',
      }}>
        {['BOOK', 'CREATIVES', 'WORDS', 'FORMAT', 'CTR FCST', 'STATUS'].map(h => (
          <M key={h} size={8} color={c.textSec} upper>{h}</M>
        ))}
      </div>
      {books.map((b, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 72px 90px 80px 72px',
            padding: '10px 16px', alignItems: 'center',
            borderBottom: i < books.length - 1 ? `1px solid ${c.border}` : 'none',
            background: activeBook === i ? 'rgba(0,177,162,0.06)' : i % 2 === 1 ? 'rgba(0,177,162,0.012)' : 'transparent',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {activeBook === i && <div style={{ width: 3, height: 3, borderRadius: '50%', background: c.accent, boxShadow: `0 0 4px ${c.accent}` }} />}
            <M size={11} color={activeBook === i ? c.textPri : c.textSec}>{b.title}</M>
          </div>
          <M size={10} color={c.textSec}>{b.creatives}</M>
          <M size={10} color={c.textSec}>{b.words}w</M>
          <M size={9} color={c.textSec}>{b.format}</M>
          <M size={10} color={b.ctrForecast >= 2.5 ? c.accent : b.ctrForecast >= 2.0 ? '#FFB800' : c.textSec}>
            {b.ctrForecast}%
          </M>
          <Badge text={b.status === 'warn' ? 'Review' : 'Ready'} variant={b.status === 'warn' ? 'warn' : 'active'} />
        </div>
      ))}
    </div>
  );
}

// ─── Copy Quality Panel ───────────────────────────────────────────────────────
function CopyQualityPanel({ book }: { book: typeof books[0] }) {
  const metrics = [
    { label: 'Word count',   value: `${book.words}w`,       ok: book.words >= 450 },
    { label: 'Lang',         value: 'EN',                    ok: true },
    { label: 'CTR forecast', value: `${book.ctrForecast}%`, ok: book.ctrForecast >= 2.0 },
    { label: 'Tone',         value: 'Romantic',              ok: true },
    { label: 'CTA present',  value: 'Yes',                   ok: true },
    { label: 'Compliance',   value: 'Passed',                ok: true },
  ];
  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <M size={8} color={c.textSec} upper style={{ display: 'block' }}>Copy QA — {book.title}</M>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <M size={9} color={c.textSec}>{m.label}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <M size={9} color={m.ok ? c.textPri : '#FFB800'}>{m.value}</M>
              <span style={{ fontSize: 9, color: m.ok ? '#00CC77' : '#FFB800' }}>{m.ok ? '✓' : '⚠'}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: c.border }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <M size={8} color={c.textSec} upper>Overall</M>
        <Badge text={book.status === 'warn' ? 'Needs review' : 'Approved'} variant={book.status === 'warn' ? 'warn' : 'live'} />
      </div>
    </div>
  );
}

// ─── Ad Copy Preview ──────────────────────────────────────────────────────────
function CopyPreview({ bookIdx }: { bookIdx: number }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const book = books[bookIdx];
  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${c.border}`, background: 'rgba(0,177,162,0.025)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <M size={9} color={c.accent} upper>Ad Copy</M>
          <span style={{ color: c.textMute, fontSize: 9 }}>·</span>
          <M size={9} color={c.textSec}>{book.title}</M>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {variants.map((v, i) => (
            <button key={i} onClick={() => setVariantIdx(i)} style={{
              fontFamily: c.mono, fontSize: 8, padding: '3px 9px',
              border: `1px solid ${variantIdx === i ? c.borderStrong : c.border}`,
              borderRadius: 3, cursor: 'pointer',
              background: variantIdx === i ? c.accentDim : 'transparent',
              color: variantIdx === i ? c.accent : c.textSec,
              textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'all 0.15s',
            }}>{v.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '14px 18px', borderRight: `1px solid ${c.border}` }}>
          <M size={9} color={c.textSec} style={{ display: 'block', marginBottom: 6 }}>{variants[variantIdx].preview}</M>
          <div style={{ height: 60, overflowY: 'hidden', position: 'relative' }}>
            <M size={9} color={c.textMute} style={{ lineHeight: 1.8, display: 'block' }}>{copyText.slice(100, 400)}</M>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, background: `linear-gradient(transparent, ${c.bgCard})` }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <M size={8} color={c.textSec} upper>~{book.words} words</M>
            <span style={{ color: c.textMute, fontSize: 9 }}>·</span>
            <M size={8} color={c.textSec} upper>English</M>
            <span style={{ color: c.textMute, fontSize: 9 }}>·</span>
            <M size={8} color={c.textSec} upper>female 25–60</M>
          </div>
        </div>
        <div style={{ width: 160, flexShrink: 0, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'CTR Forecast', value: `${variants[variantIdx].ctr}%`, color: c.accent },
            { label: 'Impressions',  value: variants[variantIdx].impressions, color: c.textPri },
            { label: 'Est. Spend',   value: variants[variantIdx].spend, color: c.textPri },
          ].map(m => (
            <div key={m.label}>
              <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 3 }}>{m.label}</M>
              <M size={12} color={m.color}>{m.value}</M>
            </div>
          ))}
          <div style={{ height: 1, background: c.border }} />
          <div>
            <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 4 }}>Targeting</M>
            <M size={8} color={c.textSec} style={{ lineHeight: 1.7 }}>female · 25–60<br />US / CA / GB / AU</M>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Creative Card ────────────────────────────────────────────────────────────
function CreativeCard({ card, isNew }: { card: typeof creativeCards[0]; isNew?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 8, overflow: 'hidden',
        border: `1px solid ${hov ? c.borderStrong : isNew ? 'rgba(0,177,162,0.4)' : c.border}`,
        background: c.bgCard, cursor: 'pointer',
        transition: 'border-color 0.18s, transform 0.18s, box-shadow 0.18s',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: isNew
          ? `0 0 16px rgba(0,177,162,0.15)`
          : hov ? '0 6px 24px rgba(0,0,0,0.45)' : 'none',
        animation: isNew ? 'creativeCardIn 0.4s ease' : 'none',
      }}
    >
      <div style={{ height: 130, position: 'relative', overflow: 'hidden', background: card.gradient }}>
        {card.overlay}
        {isNew && (
          <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3 }}>
            <span style={{ fontFamily: c.mono, fontSize: 7, padding: '2px 6px', background: 'rgba(0,177,162,0.85)', color: '#fff', borderRadius: 3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>NEW</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <span style={{ fontFamily: c.mono, fontSize: 8, padding: '2px 6px', background: 'rgba(0,0,0,0.55)', color: c.accent, border: `1px solid rgba(0,177,162,0.3)`, borderRadius: 3, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{card.format}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 2 }}>
          <M size={8} color={c.textSec} style={{ background: 'rgba(0,0,0,0.55)', padding: '2px 6px', borderRadius: 3 }}>{card.size}</M>
        </div>
      </div>
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <M size={10} color={c.textPri} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: 6 }}>{card.book}</M>
          <Badge text={`v${card.variant}`} variant="muted" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <M size={8} color={c.textSec} upper>CTR</M>
            <M size={10} color={parseFloat(card.ctr) >= 2.5 ? c.accent : parseFloat(card.ctr) >= 2.0 ? '#FFB800' : c.textSec}>{card.ctr}</M>
          </div>
          <Badge text={card.status === 'warn' ? 'Review' : 'Paused'} variant={card.status === 'warn' ? 'warn' : 'paused'} />
        </div>
      </div>
    </div>
  );
}

// ─── Upload Drop Zone ─────────────────────────────────────────────────────────
function UploadZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [hov, setHov] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (files.length) onFiles(files);
  };

  const active = isDragOver;

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px dashed ${active ? c.accent : hov ? c.borderStrong : c.border}`,
        borderRadius: 8, padding: '30px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        background: active ? 'rgba(0,177,162,0.05)' : hov ? 'rgba(0,177,162,0.02)' : 'transparent',
        cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: active ? `inset 0 0 0 1px rgba(0,177,162,0.25), 0 0 28px rgba(0,177,162,0.06)` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Shimmer on drag */}
      {active && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(0,177,162,0.06), transparent)', animation: 'uploadScanAnim 1.2s linear infinite', pointerEvents: 'none' }} />
      )}

      <input ref={inputRef} type="file" multiple accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.length) { onFiles(Array.from(e.target.files)); e.target.value = ''; } }}
      />

      {/* Upload icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: active ? 'rgba(0,177,162,0.15)' : c.accentDim,
        border: `1px solid ${active ? c.borderStrong : c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        transform: active ? 'scale(1.08)' : 'scale(1)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={active ? c.accent : c.textSec} strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 16 12 12 8 16"/>
          <line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center' }}>
        <M size={11} color={active ? c.accent : c.textPri} style={{ display: 'block', marginBottom: 5 }}>
          {active ? 'Release to add to queue' : 'Drag & drop creative assets here'}
        </M>
        <M size={8} color={c.textSec} upper>or click to browse files from your computer</M>
      </div>

      {/* Format chips */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
        {['JPG', 'PNG', 'MP4', 'MOV', 'GIF'].map(fmt => (
          <span key={fmt} style={{
            fontFamily: c.mono, fontSize: 8, padding: '2px 7px',
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.border}`,
            borderRadius: 3, color: c.textMute, letterSpacing: '0.08em',
          }}>{fmt}</span>
        ))}
        <span style={{ color: c.textMute, fontSize: 9 }}>·</span>
        <M size={8} color={c.textMute}>Max 50 MB per file</M>
      </div>
    </div>
  );
}

// ─── Upload Queue ─────────────────────────────────────────────────────────────
function UploadQueue({ items, onClear }: { items: UploadItem[]; onClear: () => void }) {
  const doneCount = items.filter(i => i.status === 'done').length;
  const errorCount = items.filter(i => i.status === 'error').length;
  const activeCount = items.filter(i => i.status === 'uploading' || i.status === 'processing' || i.status === 'validating').length;
  const allFinished = items.every(i => i.status === 'done' || i.status === 'error');

  return (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
      {/* Queue header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,177,162,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <M size={9} color={c.textPri} upper>Upload Queue</M>
          <M size={8} color={c.textSec}>{items.length} file{items.length !== 1 ? 's' : ''}</M>
          {activeCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, boxShadow: `0 0 5px ${c.accent}`, animation: 'uploadPulse 1.2s ease-in-out infinite' }} />
              <M size={8} color={c.accent} upper>Uploading</M>
            </div>
          )}
          {allFinished && items.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#00CC77', fontSize: 10 }}>✓</span>
              <M size={8} color="#00CC77" upper>{doneCount} added</M>
              {errorCount > 0 && <M size={8} color="#FF4466" upper>· {errorCount} failed</M>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Progress summary */}
          {!allFinished && (
            <M size={8} color={c.textSec}>{doneCount}/{items.length} done</M>
          )}
          {allFinished && (
            <button onClick={onClear} style={{
              fontFamily: c.mono, fontSize: 8, padding: '3px 10px',
              background: 'transparent', border: `1px solid ${c.border}`,
              borderRadius: 3, color: c.textSec, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>Clear all</button>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '32px 1fr 72px 80px 90px',
        padding: '6px 14px', borderBottom: `1px solid ${c.border}`,
        background: 'rgba(0,0,0,0.08)',
        columnGap: 10,
      }}>
        {['', 'FILENAME', 'FORMAT', 'SIZE', 'STATUS'].map((h, i) => (
          <M key={i} size={8} color={c.textSec} upper>{h}</M>
        ))}
      </div>

      {/* Items */}
      {items.map((item, idx) => {
        const isUploading   = item.status === 'uploading';
        const isProcessing  = item.status === 'processing';
        const isValidating  = item.status === 'validating';
        const isDone        = item.status === 'done';
        const isError       = item.status === 'error';
        const isActive      = isUploading || isProcessing || isValidating;

        const statusColor = isDone ? '#00CC77' : isError ? '#FF4466' : isActive ? c.accent : c.textMute;
        const statusText  = isDone ? 'Done'
          : isError       ? (item.errorMsg ?? 'Error')
          : isProcessing  ? 'Processing…'
          : isValidating  ? 'Validating…'
          : isUploading   ? `${item.progress.toFixed(0)}%`
          : 'Queued';

        return (
          <div key={item.id}>
            <div style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 72px 80px 90px',
              padding: '10px 14px', alignItems: 'center',
              columnGap: 10,
              borderBottom: `1px solid ${c.border}`,
              background: isDone ? 'rgba(0,204,119,0.02)' : isError ? 'rgba(255,68,102,0.025)' : 'transparent',
              transition: 'background 0.3s',
            }}>
              {/* File type icon */}
              <div style={{ width: 28, height: 28, borderRadius: 5, background: 'rgba(0,177,162,0.06)', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.format === 'VIDEO' ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.textSec} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
              </div>

              {/* Filename + progress bar */}
              <div style={{ minWidth: 0 }}>
                <M size={10} color={c.textPri} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                  {item.name}
                </M>
                {/* Progress bar */}
                <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  {(isUploading || isProcessing || isValidating) && (
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: isProcessing || isValidating ? '100%' : `${item.progress}%`,
                      background: isProcessing || isValidating
                        ? `linear-gradient(90deg, rgba(0,177,162,0.3) 0%, ${c.accent} 50%, rgba(0,177,162,0.3) 100%)`
                        : c.accent,
                      backgroundSize: '200% 100%',
                      animation: isProcessing || isValidating ? 'uploadScanAnim 1.2s ease-in-out infinite' : 'none',
                      transition: isUploading ? 'width 0.08s linear' : 'none',
                    }} />
                  )}
                  {isDone && <div style={{ height: '100%', width: '100%', background: 'rgba(0,204,119,0.5)', borderRadius: 2 }} />}
                  {item.status === 'queued' && <div style={{ height: '100%', width: '0%' }} />}
                </div>
              </div>

              {/* Format */}
              <span style={{ fontFamily: c.mono, fontSize: 8, padding: '2px 6px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.border}`, borderRadius: 3, color: c.textSec, textTransform: 'uppercase', letterSpacing: '0.08em', justifySelf: 'start' }}>
                {item.format}
              </span>

              {/* Size */}
              <M size={9} color={c.textSec}>{item.sizeStr}</M>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {isDone && <span style={{ color: '#00CC77', fontSize: 11, lineHeight: 1 }}>✓</span>}
                {isError && <span style={{ color: '#FF4466', fontSize: 11, lineHeight: 1 }}>✕</span>}
                {isProcessing && <span style={{ color: c.accent, fontSize: 11, display: 'inline-block', animation: 'uploadSpin 0.8s linear infinite' }}>◌</span>}
                {isValidating && <span style={{ color: '#FFB800', fontSize: 11, display: 'inline-block', animation: 'uploadSpin 0.6s linear infinite' }}>◌</span>}
                {isUploading && <span style={{ color: c.accent, fontSize: 9 }}>▲</span>}
                {item.status === 'queued' && <span style={{ color: c.textMute, fontSize: 9 }}>○</span>}
                <M size={8} color={statusColor} upper>{statusText}</M>
              </div>
            </div>

            {/* Done row: assignment info */}
            {isDone && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px 8px 56px',
                borderBottom: idx < items.length - 1 ? `1px solid ${c.border}` : 'none',
                background: 'rgba(0,204,119,0.015)',
                animation: 'uploadFadeIn 0.3s ease',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00CC77" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <M size={8} color={c.textSec}>Assigned to</M>
                <span style={{ fontFamily: c.mono, fontSize: 8, padding: '2px 7px', background: 'rgba(0,177,162,0.07)', border: `1px solid rgba(0,177,162,0.2)`, borderRadius: 3, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.bookTag}
                </span>
                <M size={8} color={c.textSec}>· Added to creative grid</M>
                <span style={{ color: '#00CC77', fontSize: 8 }}>↗</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CSS keyframes ────────────────────────────────────────────────────────────
const UPLOAD_KF = `
  @keyframes uploadScanAnim { from{background-position:-200% center} to{background-position:200% center} }
  @keyframes uploadSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes uploadPulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  @keyframes uploadFadeIn   { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes creativeCardIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
`;

// ─── Upload engine hook ───────────────────────────────────────────────────────
function useUploadEngine() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const activeRef = useRef(new Set<string>());

  const runUpload = useCallback((id: string) => {
    if (activeRef.current.has(id)) return;
    activeRef.current.add(id);

    // 1. Validate phase (~400ms)
    setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'validating' } : u));
    setTimeout(() => {
      // 2. Upload phase
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'uploading', progress: 0 } : u));
      const duration = 1600 + Math.random() * 2400;
      const t0 = Date.now();
      const tick = () => {
        const progress = Math.min(100, ((Date.now() - t0) / duration) * 100);
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress } : u));
        if (progress < 100) {
          requestAnimationFrame(tick);
        } else {
          // 3. Processing phase
          setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'processing', progress: 100 } : u));
          setTimeout(() => {
            setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'done' } : u));
            activeRef.current.delete(id);
          }, 500 + Math.random() * 500);
        }
      };
      requestAnimationFrame(tick);
    }, 350 + Math.random() * 150);
  }, []);

  const addFiles = useCallback((files: File[]) => {
    const MAX = 50 * 1024 * 1024;
    const bookNames = books.map(b => b.title);
    let bookIdx = Math.floor(Math.random() * bookNames.length);

    const newItems: UploadItem[] = files.map((f, i) => {
      const tooLarge = f.size > MAX;
      const fmt = f.type.startsWith('video') ? 'VIDEO' : 'IMAGE';
      // Round-robin book assignment
      const assignedBook = bookNames[(bookIdx + i) % bookNames.length];
      return {
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        sizeStr: fmtBytes(Math.max(f.size, 120_000)), // min 120KB for demo clarity
        format: fmt,
        progress: 0,
        status: tooLarge ? 'error' : 'queued',
        errorMsg: tooLarge ? 'File exceeds 50 MB limit' : undefined,
        bookTag: assignedBook,
      };
    });

    setUploads(prev => [...prev, ...newItems]);

    // Stagger start — max 2 concurrent
    const valid = newItems.filter(u => u.status !== 'error');
    valid.forEach((u, i) => {
      setTimeout(() => runUpload(u.id), i * 280);
    });
  }, [runUpload]);

  const clearDone = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'done' && u.status !== 'error'));
  }, []);

  return { uploads, addFiles, clearDone };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function CreativeContent({ autoOpenUpload }: { autoOpenUpload?: boolean }) {
  const [activeBook, setActiveBook] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const { uploads, addFiles, clearDone } = useUploadEngine();

  // Auto-open upload panel when navigated from another page
  React.useEffect(() => {
    if (autoOpenUpload) setShowUpload(true);
  }, [autoOpenUpload]);

  const totalCreatives = books.reduce((s, b) => s + b.creatives, 0);
  const avgCtr = (books.reduce((s, b) => s + b.ctrForecast, 0) / books.length).toFixed(1);

  // Cards that were successfully uploaded
  const uploadedCards = uploads
    .filter(u => u.status === 'done')
    .map(u => ({
      book: u.bookTag,
      variant: 'U',
      format: u.format,
      size: '1080×1080',
      gradient: 'linear-gradient(135deg, #0a1520 0%, #0d1e2a 50%, #060f18 100%)',
      overlay: (
        <svg viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
          <circle cx="80" cy="80" r="40" fill="none" stroke={c.accent} strokeWidth="0.6" strokeDasharray="4 3"/>
          <circle cx="80" cy="80" r="8" fill={c.accent} opacity={0.6}/>
        </svg>
      ),
      ctr: `${(1.8 + Math.random() * 1.8).toFixed(1)}%`,
      status: 'active' as const,
      isNew: true,
    }));

  const hasActiveUploads = uploads.some(u => u.status === 'uploading' || u.status === 'processing' || u.status === 'validating');
  const uploadDoneCount  = uploads.filter(u => u.status === 'done').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', background: c.bgBase }}>
      <style>{UPLOAD_KF}</style>

      {/* ── Status Bar ── */}
      <div style={{
        height: 44, flexShrink: 0, background: c.bgPanel,
        borderBottom: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10,
      }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: c.accentDim, border: `1px solid ${c.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <M size={9} color={c.accent} upper>Creative Production Pipeline</M>
          <M size={8} color={c.textSec} upper>Tenant: LSN Test · Account: 1323740839497080</M>
        </div>
        <div style={{ flex: 1 }} />
        {hasActiveUploads && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, boxShadow: `0 0 6px ${c.accent}`, animation: 'uploadPulse 1.2s ease-in-out infinite' }} />
            <M size={8} color={c.accent} upper>Uploading {uploads.filter(u => u.status === 'uploading').length} file{uploads.filter(u=>u.status==='uploading').length!==1?'s':''}</M>
          </div>
        )}
        {uploadDoneCount > 0 && !hasActiveUploads && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#00CC77', fontSize: 10 }}>✓</span>
            <M size={8} color="#00CC77" upper>{uploadDoneCount} uploaded</M>
          </div>
        )}
        <Badge text={`${totalCreatives + uploadDoneCount} Creatives`} variant="active" />
        <Badge text="All Paused" variant="paused" />

        {/* Upload toggle button — prominent solid style */}
        <button
          onClick={() => setShowUpload(p => !p)}
          style={{
            fontFamily: c.mono, fontSize: 10, padding: '7px 16px',
            background: showUpload ? 'rgba(0,177,162,0.18)' : c.accent,
            border: `1px solid ${showUpload ? c.borderStrong : 'transparent'}`,
            borderRadius: 6, color: showUpload ? c.accent : c.bgBase,
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', gap: 7,
            transition: 'all 0.16s',
            boxShadow: showUpload ? 'none' : `0 0 16px ${c.accentGlow}`,
            fontWeight: 400,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          {showUpload ? 'Hide Upload' : 'Upload Assets'}
        </button>
      </div>

      <div style={{ padding: '20px 22px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: 8, overflow: 'hidden' }}>
          {[
            { label: 'Total Creatives',  value: String(totalCreatives + uploadDoneCount) },
            { label: 'Books Covered',    value: String(books.length) },
            { label: 'Avg Copy Length',  value: '505', sub: 'w' },
            { label: 'Avg CTR Forecast', value: avgCtr, sub: '%', accent: true },
            { label: 'Ad Status',        value: 'PAUSED', muted: true },
          ].map((s, i) => (
            <div key={i} style={{ padding: '14px 18px', borderRight: i < 4 ? `1px solid ${c.border}` : 'none' }}>
              <M size={8} color={c.textSec} upper style={{ display: 'block', marginBottom: 6 }}>{s.label}</M>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <M size={18} color={(s as any).accent ? c.accent : (s as any).muted ? '#3B82F6' : c.textPri}
                  style={{ textShadow: (s as any).accent ? `0 0 10px rgba(0,177,162,0.35)` : undefined }}>
                  {s.value}
                </M>
                {(s as any).sub && <M size={10} color={c.textSec}>{(s as any).sub}</M>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Upload Panel (collapsible) ── */}
        {showUpload && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'uploadFadeIn 0.25s ease' }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <M size={9} color={c.textSec} upper>Asset Upload</M>
              <div style={{ flex: 1, height: 1, background: c.border }} />
              <M size={8} color={c.textMute}>Validate → Upload → Process → Assign</M>
            </div>

            <UploadZone onFiles={addFiles} />

            {uploads.length > 0 && (
              <UploadQueue items={uploads} onClear={clearDone} />
            )}
          </div>
        )}

        {/* ── Book Table + QA Panel ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14 }}>
          <BookTable activeBook={activeBook} onSelect={setActiveBook} />
          <CopyQualityPanel book={books[activeBook]} />
        </div>

        {/* ── Ad Copy Preview ── */}
        <CopyPreview bookIdx={activeBook} />

        {/* ── Creative Grid ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <M size={9} color={c.textSec} upper>Creative Variants</M>
            <M size={9} color={c.textSec}>{creativeCards.length + uploadedCards.length} of {totalCreatives + uploadDoneCount} shown</M>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {/* Uploaded cards appear first with NEW badge */}
            {uploadedCards.map((card, i) => (
              <CreativeCard key={`u-${i}`} card={card} isNew />
            ))}
            {creativeCards.map((card, i) => (
              <CreativeCard key={i} card={card} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
