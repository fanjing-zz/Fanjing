import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { colors, fonts, radii } from '../tokens';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '11px', letterSpacing: '0.12em' },
  md: { padding: '12px 24px', fontSize: '13px', letterSpacing: '0.1em' },
  lg: { padding: '16px 32px', fontSize: '15px', letterSpacing: '0.1em' },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: colors.accentPrimary,
    color: colors.bgBase,
    border: 'none',
    boxShadow: `0 0 24px ${colors.accentPrimaryGlow}, 0 2px 8px rgba(0,0,0,0.4)`,
  },
  outline: {
    background: 'transparent',
    color: colors.accentDanger,
    border: `1px solid ${colors.accentDanger}`,
    boxShadow: `0 0 12px ${colors.accentDangerGlow}`,
  },
  ghost: {
    background: 'transparent',
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    boxShadow: 'none',
  },
};

const variantHover: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#33FFD9',
    boxShadow: `0 0 32px ${colors.accentPrimaryGlow}, 0 4px 16px rgba(0,0,0,0.5)`,
  },
  outline: {
    background: colors.accentDangerGlow,
  },
  ghost: {
    background: colors.trackBg,
    color: colors.textPrimary,
    border: `1px solid ${colors.borderStrong}`,
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: fonts.mono,
    fontWeight: 700,
    textTransform: 'uppercase',
    borderRadius: radii.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease, opacity 0.15s ease',
    userSelect: 'none',
    width: fullWidth ? '100%' : undefined,
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(hovered && !disabled ? variantHover[variant] : {}),
    ...style,
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
    </button>
  );
}
