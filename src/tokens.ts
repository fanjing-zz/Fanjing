export const colors = {
  bgBase: '#0A0A0A',
  bgCard: '#111111',
  bgCardAlt: '#0D1410',

  accentPrimary: '#00FFD1',
  accentPrimaryGlow: 'rgba(0,255,209,0.25)',
  accentDanger: '#FF2D78',
  accentDangerGlow: 'rgba(255,45,120,0.2)',

  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#444444',

  positive: '#00FF88',
  negative: '#FF2D78',

  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  trackBg: 'rgba(255,255,255,0.08)',
} as const;

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '10px',
} as const;

export const fonts = {
  mono: "'Space Mono', 'Courier New', monospace",
  sans: "'Inter', system-ui, sans-serif",
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;
