import React, { ReactNode } from 'react';
import { colors, fonts, radii, spacing } from '../tokens';

export type NodeStatus = 'online' | 'warning' | 'offline' | 'idle';

const statusColor: Record<NodeStatus, string> = {
  online: colors.accentPrimary,
  warning: '#FFB800',
  offline: colors.accentDanger,
  idle: colors.textMuted,
};

export interface NodeCardProps {
  nodeId: string;
  metricLabel: string;
  metricValue: string | number;
  progress?: number;       // 0–100
  progressColor?: string;
  status?: NodeStatus;
  actionIcon?: ReactNode;
  style?: React.CSSProperties;
}

export function NodeCard({
  nodeId,
  metricLabel,
  metricValue,
  progress,
  progressColor = colors.accentPrimary,
  status = 'online',
  actionIcon,
  style,
}: NodeCardProps) {
  return (
    <div
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        padding: spacing.lg,
        width: '226px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...style,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: statusColor[status],
          }}
        >
          {nodeId}
        </span>
        {actionIcon ? (
          <span style={{ color: colors.textMuted, fontSize: '14px', cursor: 'pointer' }}>
            {actionIcon}
          </span>
        ) : (
          <StatusDot status={status} />
        )}
      </div>

      {/* Metric */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: colors.textSecondary,
          }}
        >
          {metricLabel}
        </span>
        <span
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: '26px',
            color: colors.textPrimary,
            lineHeight: 1.1,
          }}
        >
          {metricValue}
        </span>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <ProgressBar value={progress} color={progressColor} />
      )}
    </div>
  );
}

function StatusDot({ status }: { status: NodeStatus }) {
  const color = statusColor[status];
  return (
    <span
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        boxShadow: status === 'online' ? `0 0 6px ${color}` : 'none',
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  );
}

export interface ProgressBarProps {
  value: number;     // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function ProgressBar({
  value,
  color = colors.accentPrimary,
  trackColor = colors.trackBg,
  height = 6,
  borderRadius = '3px',
  style,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        background: trackColor,
        borderRadius,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: color,
          borderRadius,
          transition: 'width 0.4s ease',
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );
}
