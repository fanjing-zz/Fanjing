// ── Shared project & social account data ─────────────────────────────────────
// Imported by both CommChatContent and SettingsContent so they stay in sync.

// ── Project types ─────────────────────────────────────────────────────────────
export type ProjectStatus = 'active' | 'paused' | 'draft' | 'completed';

export interface Project {
  id: string; name: string; status: ProjectStatus;
  budget: string; roas: number; spend: string;
  adSets: number; campaigns: number; geo: string;
  updated: string; platform: string[];
  insights: string;
  socialAccountIds: string[];
}

export const PROJECTS: Project[] = [
  { id: 'PRJ-001', name: 'Q2 Romance Series', status: 'active',
    budget: '$74/day', roas: 4.8, spend: '$2,180', adSets: 74, campaigns: 5,
    geo: 'US · CA · GB · AU', updated: '2h ago', platform: ['Meta'],
    insights: 'ROAS above target. "Beyond the Horizon" underperforming at 3.2× — recommend bid review.',
    socialAccountIds: ['SA-001'] },
  { id: 'PRJ-002', name: 'Beyond the Horizon', status: 'paused',
    budget: '$28/day', roas: 3.2, spend: '$640', adSets: 18, campaigns: 2,
    geo: 'US', updated: '1d ago', platform: ['Meta'],
    insights: 'Below 4.0× ROAS floor. Paused pending creative refresh and audience expansion.',
    socialAccountIds: ['SA-002'] },
  { id: 'PRJ-003', name: 'Summer Launch 2025', status: 'draft',
    budget: '$120/day', roas: 0, spend: '—', adSets: 0, campaigns: 3,
    geo: 'US · CA', updated: '3d ago', platform: ['Meta', 'TikTok'],
    insights: 'Campaign structure complete. Awaiting creative assets and final budget approval.',
    socialAccountIds: ['SA-001', 'SA-003'] },
  { id: 'PRJ-004', name: 'LexiCollection Spring', status: 'completed',
    budget: '$55/day', roas: 6.1, spend: '$8,430', adSets: 42, campaigns: 4,
    geo: 'US · GB · AU', updated: '1w ago', platform: ['Meta'],
    insights: 'Campaign ended. Final ROAS 6.1× — strongest performer this quarter.',
    socialAccountIds: ['SA-001'] },
  { id: 'PRJ-005', name: 'Evergreen Core', status: 'active',
    budget: '$90/day', roas: 5.3, spend: '$3,760', adSets: 31, campaigns: 3,
    geo: 'US · CA', updated: '4h ago', platform: ['Meta'],
    insights: 'Stable retargeting loop. Frequency rising — consider audience refresh in 5–7 days.',
    socialAccountIds: ['SA-001'] },
];

// ── Social account types ──────────────────────────────────────────────────────
export type SocialPlatform = 'meta' | 'tiktok' | 'google';
export type SocialAuthStatus = 'authorized' | 'expired' | 'pending' | 'revoked';

export interface SocialAccount {
  id: string; platform: SocialPlatform; displayName: string;
  accountId: string; pageId?: string; pixelId?: string;
  status: SocialAuthStatus; lastSync: string; linkedProjectIds: string[];
}

export const SOCIAL_ACCOUNTS: SocialAccount[] = [
  { id: 'SA-001', platform: 'meta', displayName: 'Sandwichlab Main',
    accountId: '8048·9042·9093·816', pageId: 'LexiCollection_85', pixelId: '8834·8266·7767·853',
    status: 'authorized', lastSync: '10m ago', linkedProjectIds: ['PRJ-001', 'PRJ-003', 'PRJ-004', 'PRJ-005'] },
  { id: 'SA-002', platform: 'meta', displayName: 'Sandwichlab Dev',
    accountId: '1323·7408·3949·7080', pageId: 'LexiCollection_Dev', pixelId: '8834·8266·7767·854',
    status: 'expired', lastSync: '3d ago', linkedProjectIds: ['PRJ-002'] },
  { id: 'SA-003', platform: 'tiktok', displayName: 'Sandwichlab TK',
    accountId: 'TK-7291·038',
    status: 'pending', lastSync: '—', linkedProjectIds: ['PRJ-003'] },
  { id: 'SA-004', platform: 'google', displayName: 'Sandwichlab GAds',
    accountId: 'GA-482·019·337',
    status: 'authorized', lastSync: '1h ago', linkedProjectIds: [] },
];

export const PLATFORM_STYLE: Record<SocialPlatform, { label: string; color: string; bg: string }> = {
  meta:   { label: 'META',   color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  tiktok: { label: 'TIKTOK', color: '#E2E2E2', bg: 'rgba(200,200,200,0.10)' },
  google: { label: 'GOOGLE', color: '#EA4335', bg: 'rgba(234,67,53,0.10)' },
};

export const AUTH_STATUS_STYLE: Record<SocialAuthStatus, { label: string; color: string; dot: string }> = {
  authorized: { label: 'Active',   color: '#00CC77', dot: '●' },
  expired:    { label: 'Expired',  color: '#FFB800', dot: '⚠' },
  pending:    { label: 'Pending',  color: '#8AACBC', dot: '○' },
  revoked:    { label: 'Revoked',  color: '#FF4466', dot: '✕' },
};
