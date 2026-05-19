import React from 'react';
import { colors, fonts, radii, spacing } from '../tokens';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 176,
  height = 48,
  color = colors.accentPrimary,
  strokeWidth = 1.5,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const xStep = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * xStep;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = points.join(' ');

  // Area fill path
  const areaPath = `M${points[0]} L${polyline.split(' ').slice(1).join(' L')} L${(data.length - 1) * xStep},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ChartCardProps {
  label: string;
  value: string | number;
  unit?: string;
  data: number[];
  color?: string;
  trend?: number;
  style?: React.CSSProperties;
}

export function ChartCard({
  label,
  value,
  unit,
  data,
  color = colors.accentPrimary,
  trend,
  style,
}: ChartCardProps) {
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
        gap: '12px',
        minWidth: '185px',
        flex: '1 1 0',
        ...style,
      }}
    >
      <Sparkline data={data} color={color} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.textSecondary,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: '16px',
            color: colors.textPrimary,
          }}
        >
          {value}
          {unit && (
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: '11px',
                fontWeight: 400,
                color: colors.textSecondary,
                marginLeft: '2px',
              }}
            >
              {unit}
            </span>
          )}
        </span>
      </div>

      {trend !== undefined && (
        <div style={{ fontFamily: fonts.mono, fontSize: '10px', color: trendColor }}>
          {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
