// ── Per-theme raw values ──────────────────────────────────────────────────────
const darkVars = {
  bgBase:      '#071015',
  bgPanel:     '#0B1720',
  bgCard:      '#0E1D28',
  bgInput:     '#091318',
  bgBubble:    '#101C26',
  bgElevated:  '#0d1e2a',
  accent:      '#00B1A2',
  accentMid:   '#008E82',
  accentDim:   'rgba(0,177,162,0.12)',
  accentGlow:  'rgba(0,177,162,0.30)',
  green:       '#00CC77',
  greenDim:    'rgba(0,204,119,0.15)',
  blue:        '#3B82F6',
  textPri:     '#BDD8E8',
  textSec:     '#3D6575',
  textMute:    '#1E3545',
  textLabel:   '#245060',
  border:      'rgba(0,177,162,0.08)',
  borderStrong:'rgba(0,177,162,0.18)',
  overlayBg:   'rgba(4,10,14,0.55)',
  bgFloat:     'rgba(7,16,21,0.96)',
  shadowColor: 'rgba(0,0,0,0.60)',
};

const lightVars = {
  bgBase:      '#EFF4F7',
  bgPanel:     '#FFFFFF',
  bgCard:      '#F8FAFB',
  bgInput:     '#EEF3F7',
  bgBubble:    '#F3F7FA',
  bgElevated:  '#FFFFFF',
  accent:      '#00897B',
  accentMid:   '#00695C',
  accentDim:   'rgba(0,137,123,0.08)',
  accentGlow:  'rgba(0,137,123,0.18)',
  green:       '#059669',
  greenDim:    'rgba(5,150,105,0.10)',
  blue:        '#2563EB',
  textPri:     '#1C2E38',
  textSec:     '#4A7080',
  textMute:    '#8AACBC',
  textLabel:   '#5A8090',
  border:      'rgba(0,137,123,0.10)',
  borderStrong:'rgba(0,137,123,0.22)',
  overlayBg:   'rgba(15,30,40,0.28)',
  bgFloat:     'rgba(248,252,255,0.98)',
  shadowColor: 'rgba(0,0,0,0.04)',
};

type Vars = typeof darkVars;

const CSS_VARS: Record<keyof Vars, string> = {
  bgBase:      '--c-bg-base',
  bgPanel:     '--c-bg-panel',
  bgCard:      '--c-bg-card',
  bgInput:     '--c-bg-input',
  bgBubble:    '--c-bg-bubble',
  bgElevated:  '--c-bg-elevated',
  accent:      '--c-accent',
  accentMid:   '--c-accent-mid',
  accentDim:   '--c-accent-dim',
  accentGlow:  '--c-accent-glow',
  green:       '--c-green',
  greenDim:    '--c-green-dim',
  blue:        '--c-blue',
  textPri:     '--c-text-pri',
  textSec:     '--c-text-sec',
  textMute:    '--c-text-mute',
  textLabel:   '--c-text-label',
  border:      '--c-border',
  borderStrong:'--c-border-strong',
  overlayBg:   '--c-overlay-bg',
  bgFloat:     '--c-bg-float',
  shadowColor: '--c-shadow-color',
};

export function applyTheme(isDark: boolean): void {
  const vals: Vars = isDark ? darkVars : lightVars;
  const root = document.documentElement;
  (Object.keys(CSS_VARS) as Array<keyof Vars>).forEach(k => {
    root.style.setProperty(CSS_VARS[k], vals[k]);
  });
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// Apply dark theme immediately so components have values on first paint
applyTheme(true);

// c: CSS variable references — works in any inline style prop
export const c = {
  bgBase:      'var(--c-bg-base)',
  bgPanel:     'var(--c-bg-panel)',
  bgCard:      'var(--c-bg-card)',
  bgInput:     'var(--c-bg-input)',
  bgBubble:    'var(--c-bg-bubble)',
  bgElevated:  'var(--c-bg-elevated)',
  accent:      'var(--c-accent)',
  accentMid:   'var(--c-accent-mid)',
  accentDim:   'var(--c-accent-dim)',
  accentGlow:  'var(--c-accent-glow)',
  green:       'var(--c-green)',
  greenDim:    'var(--c-green-dim)',
  blue:        'var(--c-blue)',
  textPri:     'var(--c-text-pri)',
  textSec:     'var(--c-text-sec)',
  textMute:    'var(--c-text-mute)',
  textLabel:   'var(--c-text-label)',
  border:      'var(--c-border)',
  borderStrong:'var(--c-border-strong)',
  overlayBg:   'var(--c-overlay-bg)',
  bgFloat:     'var(--c-bg-float)',
  shadowColor: 'var(--c-shadow-color)',
  mono: "'Liberation Mono','Space Mono','Courier New',monospace",
  sans: "'Inter',system-ui,sans-serif",
};
