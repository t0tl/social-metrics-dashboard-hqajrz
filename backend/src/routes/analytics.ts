import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

export function registerAnalyticsRoutes(app: App) {
  const requireAuth = app.requireAuth();

  // GET /api/analytics/trends - Get trend data for charts (weekly/monthly growth)
  app.fastify.get(
    '/api/analytics/trends',
    {
      schema: {
        description: 'Get trend data for charts (weekly/monthly growth)',
        tags: ['analytics'],
        querystring: {
          type: 'object',
          properties: {
            period: { type: 'string', enum: ['weekly', 'monthly'], description: 'Aggregation period (default: weekly)' },
            platform: { type: 'string', description: 'Filter by platform' },
            limit: { type: 'string', description: 'Number of periods to return (default: 12)' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              period: { type: 'string' },
              platform: { type: 'string' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    period: { type: 'string' },
                    followers: { type: 'integer' },
                    engagement_rate: { type: 'number' },
                    reach: { type: 'integer' },
                    impressions: { type: 'integer' },
                    likes: { type: 'integer' },
                    comments: { type: 'integer' },
                    shares: { type: 'integer' },
                    changePercent: { type: 'number' },
                  },
                },
              },
              summary: {
                type: 'object',
                properties: {
                  avgFollowers: { type: 'integer' },
                  avgEngagement: { type: 'number' },
                  totalGrowth: { type: 'number' },
                  bestPeriod: { type: 'string' },
                  lowestPeriod: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { period = 'weekly', platform, limit = '12' } = request.query as { period?: 'weekly' | 'monthly'; platform?: string; limit?: string };
      const maxLimit = parseInt(limit) || 12;

      // Fetch all metrics for user
      let metrics = await app.db
        .select()
        .from(schema.socialMetrics)
        .where(eq(schema.socialMetrics.user_id, session.user.id))
        .orderBy(schema.socialMetrics.date);

      if (platform) {
        metrics = metrics.filter((m) => m.platform === platform);
      }

      if (metrics.length === 0) {
        return {
          period,
          platform: platform || 'all',
          data: [],
          summary: {
            avgFollowers: 0,
            avgEngagement: 0,
            totalGrowth: 0,
            bestPeriod: null,
            lowestPeriod: null,
          },
        };
      }

      // Group metrics by period
      const grouped: Record<string, typeof metrics> = {};

      metrics.forEach((metric) => {
        const date = new Date(metric.date);
        let periodKey: string;

        if (period === 'monthly') {
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
          // Weekly: ISO week date
          const onejan = new Date(date.getFullYear(), 0, 1);
          const millisecsInDay = 86400000;
          const weekNum = Math.ceil(((date.getTime() - onejan.getTime()) / millisecsInDay + onejan.getDay() + 1) / 7);
          periodKey = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
        }

        if (!grouped[periodKey]) {
          grouped[periodKey] = [];
        }
        grouped[periodKey].push(metric);
      });

      // Calculate aggregates for each period
      const trendData = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-maxLimit)
        .map(([periodKey, periodMetrics]) => {
          const avgFollowers = Math.round(periodMetrics.reduce((sum, m) => sum + m.followers, 0) / periodMetrics.length);
          const avgEngagement =
            periodMetrics.filter((m) => m.engagement_rate).reduce((sum, m) => sum + Number(m.engagement_rate || 0), 0) /
              (periodMetrics.filter((m) => m.engagement_rate).length || 1) || 0;
          const avgReach = Math.round(periodMetrics.reduce((sum, m) => sum + (m.reach || 0), 0) / periodMetrics.length);
          const avgImpressions = Math.round(periodMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0) / periodMetrics.length);
          const totalLikes = periodMetrics.reduce((sum, m) => sum + (m.likes || 0), 0);
          const totalComments = periodMetrics.reduce((sum, m) => sum + (m.comments || 0), 0);
          const totalShares = periodMetrics.reduce((sum, m) => sum + (m.shares || 0), 0);

          return {
            period: periodKey,
            followers: avgFollowers,
            engagement_rate: Math.round(avgEngagement * 100) / 100,
            reach: avgReach,
            impressions: avgImpressions,
            likes: totalLikes,
            comments: totalComments,
            shares: totalShares,
            changePercent: 0, // Will calculate after
          };
        });

      // Calculate change percentages
      for (let i = 1; i < trendData.length; i++) {
        const prevFollowers = trendData[i - 1].followers;
        if (prevFollowers > 0) {
          trendData[i].changePercent = Math.round(((trendData[i].followers - prevFollowers) / prevFollowers) * 10000) / 100;
        }
      }

      // Calculate summary
      const avgFollowers = Math.round(trendData.reduce((sum, d) => sum + d.followers, 0) / trendData.length);
      const avgEngagement = Math.round((trendData.reduce((sum, d) => sum + d.engagement_rate, 0) / trendData.length) * 100) / 100;
      const totalGrowth = trendData.length > 0 ? trendData[trendData.length - 1].changePercent : 0;
      const bestPeriod = trendData.reduce((best, d) => (d.followers > best.followers ? d : best), trendData[0])?.period || null;
      const lowestPeriod = trendData.reduce((lowest, d) => (d.followers < lowest.followers ? d : lowest), trendData[0])?.period || null;

      return {
        period,
        platform: platform || 'all',
        data: trendData,
        summary: {
          avgFollowers,
          avgEngagement,
          totalGrowth,
          bestPeriod,
          lowestPeriod,
        },
      };
    }
  );
}
