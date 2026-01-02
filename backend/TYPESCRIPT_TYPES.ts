/**
 * TypeScript Types for Social Media Analytics API
 * Use these in your frontend application for type safety
 */

// ============================================================================
// Authentication Types (Better Auth)
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface AuthSession {
  id: string;
  expiresAt: string; // ISO timestamp
  token: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

// ============================================================================
// Metrics Types
// ============================================================================

export type Platform = 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'youtube' | 'facebook' | 'threads' | 'bluesky';

export interface SocialMetric {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  platform: Platform;
  followers: number;
  engagement_rate?: string | null; // Decimal value as string
  reach?: number | null;
  impressions?: number | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface CreateMetricRequest {
  date: string; // YYYY-MM-DD format
  platform: Platform;
  followers: number;
  engagement_rate?: number;
  reach?: number;
  impressions?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface MetricsSummary {
  totalFollowers: number;
  totalFollowersByPlatform: Record<Platform, number>;
  averageEngagement: number;
  totalReach: number;
  totalImpressions: number;
  recentMetrics: SocialMetric[];
  growthTrend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

// ============================================================================
// Goals Types
// ============================================================================

export type GoalType = 'followers' | 'engagement' | 'reach' | 'impressions' | 'likes' | 'comments' | 'shares';
export type GoalPlatform = Platform | 'all';
export type GoalStatus = 'active' | 'completed' | 'abandoned';

export interface UserGoal {
  id: string;
  userId: string;
  goal_type: GoalType;
  platform: GoalPlatform;
  target_value: number;
  current_value: number;
  deadline: string; // ISO timestamp
  status: GoalStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface CreateGoalRequest {
  goal_type: GoalType;
  platform: GoalPlatform;
  target_value: number;
  deadline: string; // ISO timestamp
}

export interface UpdateGoalRequest {
  current_value?: number;
  status?: GoalStatus;
}

export interface GoalProgress {
  goal: UserGoal;
  percentComplete: number; // 0-100
  daysRemaining: number;
  isOverdue: boolean;
}

// ============================================================================
// Analytics/Trends Types
// ============================================================================

export type PeriodType = 'weekly' | 'monthly';

export interface TrendDataPoint {
  period: string; // e.g., "2024-W02" or "2024-01"
  followers: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  changePercent: number; // % change from previous period
}

export interface TrendSummary {
  avgFollowers: number;
  avgEngagement: number;
  totalGrowth: number;
  bestPeriod: string | null;
  lowestPeriod: string | null;
}

export interface TrendsResponse {
  period: PeriodType;
  platform: string; // 'all' or specific platform
  data: TrendDataPoint[];
  summary: TrendSummary;
}

// ============================================================================
// API Query Parameters
// ============================================================================

export interface MetricsQueryParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  platform?: Platform;
}

export interface TrendsQueryParams {
  period?: PeriodType; // default: 'weekly'
  platform?: Platform;
  limit?: number; // default: 12
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate goal progress percentage
 */
export function calculateGoalProgress(goal: UserGoal): number {
  return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
}

/**
 * Check if goal is overdue
 */
export function isGoalOverdue(goal: UserGoal): boolean {
  return goal.status === 'active' && new Date() > new Date(goal.deadline);
}

/**
 * Get days remaining for goal
 */
export function getDaysRemaining(goal: UserGoal): number {
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const diffMs = deadline.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format engagement rate as percentage
 */
export function formatEngagementRate(rate?: string | null): string {
  if (!rate) return '0%';
  return `${parseFloat(rate).toFixed(2)}%`;
}

/**
 * Format follower count with abbreviation
 */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

/**
 * Get platform icon/color mapping
 */
export const platformConfig: Record<Platform, { color: string; icon: string; label: string }> = {
  instagram: { color: '#E4405F', icon: 'instagram', label: 'Instagram' },
  twitter: { color: '#1DA1F2', icon: 'twitter', label: 'Twitter/X' },
  tiktok: { color: '#000000', icon: 'tiktok', label: 'TikTok' },
  linkedin: { color: '#0A66C2', icon: 'linkedin', label: 'LinkedIn' },
  youtube: { color: '#FF0000', icon: 'youtube', label: 'YouTube' },
  facebook: { color: '#1877F2', icon: 'facebook', label: 'Facebook' },
  threads: { color: '#000000', icon: 'threads', label: 'Threads' },
  bluesky: { color: '#1185FE', icon: 'bluesky', label: 'Bluesky' },
};

// ============================================================================
// Error Handling Types
// ============================================================================

export interface APIError {
  error: string;
  message?: string;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Usage Examples
// ============================================================================

/*
import type { SocialMetric, UserGoal, TrendsResponse } from './types';

// Fetch metrics
const metricsResponse = await fetch('/api/metrics?platform=instagram&startDate=2024-01-01', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const metrics: SocialMetric[] = await metricsResponse.json();

// Fetch goals
const goalsResponse = await fetch('/api/goals', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const goals: UserGoal[] = await goalsResponse.json();

// Calculate progress
const goal = goals[0];
const progress = calculateGoalProgress(goal); // 0-100
const daysLeft = getDaysRemaining(goal);
const overdue = isGoalOverdue(goal);

// Fetch trends
const trendsResponse = await fetch('/api/analytics/trends?period=weekly&platform=instagram', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const trends: TrendsResponse = await trendsResponse.json();

// Display metrics
metrics.forEach(metric => {
  console.log(`${metric.date}: ${formatFollowers(metric.followers)} followers`);
  console.log(`Engagement: ${formatEngagementRate(metric.engagement_rate)}`);
});
*/
