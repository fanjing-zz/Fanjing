import React, { ReactNode } from 'react';
import { colors, fonts, radii, spacing } from '../tokens';

export interface StatCardProps {
  icon?: ReactNode;
  iconColor?: string;
  label: string;
  value: string | number;
  trend?: number;       // e.g. 10 means +10%, -5 means -5%
  trendLabel?: string;  // e.g. "from yesterday"
  style?: React.CSSProperties;
}

export function StatCard({
  icon,
  iconColor = colors.accentPrimary,
  label,
  value,
  trend,
  trendLabel = 'from yesterday',
  style,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const trendColor = isPositive ? colors.positive : colors.negative;

  return (
    <div
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        padding: spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '160px',
        flex: '1 1 0',
        ...style,
      }}
    >
      {icon && (
        <span
          style={{
            color: iconColor,
            fontSize: '22px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </span>
      )}

      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: '28px',
          color: colors.textPrimary,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: colors.textSecondary,
        }}
      >
        {label}
      </div>

      {trend !== undefined && (
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: '11px',
            color: trendColor,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(trend)}% {trendLabel}</span>
        </div>
      )}
    </div>
  );
}
