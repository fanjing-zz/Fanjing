import React from 'react';
import { Button } from './components/Button';
import { StatCard } from './components/StatCard';
import { NodeCard, ProgressBar } from './components/NodeCard';
import { ChartCard } from './components/ChartCard';
import { colors, fonts } from './tokens';

const sparkData1 = [20, 28, 24, 35, 30, 42, 38, 50, 45, 58, 52, 60];
const sparkData2 = [60, 55, 58, 50, 42, 48, 40, 35, 38, 30, 25, 20];
const sparkData3 = [10, 15, 12, 20, 18, 25, 22, 30, 28, 35, 40, 38];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: colors.accentPrimary,
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// Simple SVG icons to avoid external dependencies
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconSettings = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export function Demo() {
  return (
    <div
      style={{
        background: colors.bgBase,
        minHeight: '100vh',
        padding: '48px',
        fontFamily: fonts.sans,
        color: colors.textPrimary,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <h1
            style={{
              fontFamily: fonts.mono,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: colors.accentPrimary,
              margin: '0 0 8px',
            }}
          >
            Sandwichlab
          </h1>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              margin: '0 0 8px',
              color: colors.textPrimary,
            }}
          >
            UI Component Library
          </h2>
          <p
            style={{
              fontFamily: fonts.mono,
              fontSize: '12px',
              color: colors.textSecondary,
              margin: 0,
            }}
          >
            React + TypeScript · Zero dependencies
          </p>
        </div>

        {/* Buttons */}
        <Section title="Button">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Button variant="primary" size="lg" icon={<IconUpload />}>
              Upload Assets
            </Button>
            <Button variant="primary" size="md">
              New Project
            </Button>
            <Button variant="primary" size="sm">
              Submit
            </Button>
            <Button variant="outline" size="md">
              Re-Route Traffic
            </Button>
            <Button variant="ghost" size="md" icon={<IconArrowRight />} iconPosition="right">
              View All
            </Button>
            <Button variant="primary" size="md" disabled>
              Disabled
            </Button>
            <Button variant="primary" size="md" fullWidth>
              Full Width Button
            </Button>
          </div>
        </Section>

        {/* Stat Cards */}
        <Section title="Stat Card">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <StatCard
              icon="💰"
              iconColor="#FF9500"
              label="Total Sales"
              value="$5k"
              trend={10}
            />
            <StatCard
              icon="⚡"
              iconColor="#FFD60A"
              label="Total Order"
              value="500"
              trend={8}
            />
            <StatCard
              icon="🛍"
              iconColor={colors.accentPrimary}
              label="Product Sold"
              value="9"
              trend={2}
            />
            <StatCard
              icon="👤"
              iconColor="#5E9EFF"
              label="New Customer"
              value="12"
              trend={3}
            />
            <StatCard
              icon="📉"
              iconColor={colors.accentDanger}
              label="Churn Rate"
              value="1.4%"
              trend={-5}
            />
          </div>
        </Section>

        {/* Node Cards */}
        <Section title="Node Card">
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <NodeCard
              nodeId="NODE_ALPHA_01"
              metricLabel="CPU Utilization"
              metricValue="42.8%"
              progress={42.8}
              status="online"
              actionIcon={<IconSettings />}
            />
            <NodeCard
              nodeId="NODE_BRAVO_02"
              metricLabel="Memory Overhead"
              metricValue="18.2GB"
              progress={72}
              status="warning"
              actionIcon={<IconSettings />}
            />
            <NodeCard
              nodeId="NODE_DELTA_03"
              metricLabel="Network I/O"
              metricValue="3.7TB"
              progress={91}
              progressColor={colors.accentDanger}
              status="offline"
              actionIcon={<IconSettings />}
            />
            <NodeCard
              nodeId="NODE_ECHO_04"
              metricLabel="Disk Usage"
              metricValue="512GB"
              progress={55}
              status="idle"
              actionIcon={<IconSettings />}
            />
          </div>
        </Section>

        {/* Progress Bar standalone */}
        <Section title="Progress Bar">
          <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ProgressBar value={42} color={colors.accentPrimary} />
            <ProgressBar value={72} color="#FFB800" />
            <ProgressBar value={91} color={colors.accentDanger} />
            <ProgressBar value={30} color="#5E9EFF" height={10} />
          </div>
        </Section>

        {/* Chart Cards */}
        <Section title="Chart Card">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <ChartCard
              label="Contractions"
              value="8"
              unit="/h"
              data={sparkData1}
              color={colors.accentPrimary}
              trend={12}
            />
            <ChartCard
              label="Ad Spend"
              value="$2.4k"
              data={sparkData2}
              color={colors.accentDanger}
              trend={-8}
            />
            <ChartCard
              label="Conversions"
              value="347"
              data={sparkData3}
              color="#5E9EFF"
              trend={5}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}
