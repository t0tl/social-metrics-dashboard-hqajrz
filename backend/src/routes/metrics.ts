import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

export function registerMetricsRoutes(app: App) {
  const requireAuth = app.requireAuth();

  // GET /api/metrics - Fetch social media metrics with filtering
  app.fastify.get(
    '/api/metrics',
    {
      schema: {
        description: 'Fetch social media metrics with date range and platform filtering',
        tags: ['metrics'],
        querystring: {
          type: 'object',
          properties: {
            startDate: { type: 'string', description: 'ISO date string (YYYY-MM-DD)' },
            endDate: { type: 'string', description: 'ISO date string (YYYY-MM-DD)' },
            platform: { type: 'string', description: 'Filter by platform' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                date: { type: 'string' },
                platform: { type: 'string' },
                followers: { type: 'integer' },
                engagement_rate: { type: 'number' },
                reach: { type: 'integer' },
                impressions: { type: 'integer' },
                likes: { type: 'integer' },
                comments: { type: 'integer' },
                shares: { type: 'integer' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { startDate, endDate, platform } = request.query as { startDate?: string; endDate?: string; platform?: string };

      const conditions: any[] = [eq(schema.socialMetrics.user_id, session.user.id)];

      if (startDate) {
        conditions.push(gte(schema.socialMetrics.date, new Date(startDate).toISOString().split('T')[0]));
      }
      if (endDate) {
        conditions.push(lte(schema.socialMetrics.date, new Date(endDate).toISOString().split('T')[0]));
      }
      if (platform) {
        conditions.push(eq(schema.socialMetrics.platform, platform as any));
      }

      const metrics = await app.db
        .select()
        .from(schema.socialMetrics)
        .where(and(...conditions))
        .orderBy(schema.socialMetrics.date);

      return metrics;
    }
  );

  // POST /api/metrics - Add new metric data point
  app.fastify.post(
    '/api/metrics',
    {
      schema: {
        description: 'Add a new social media metric',
        tags: ['metrics'],
        body: {
          type: 'object',
          required: ['date', 'platform', 'followers'],
          properties: {
            date: { type: 'string', description: 'ISO date string (YYYY-MM-DD)' },
            platform: { type: 'string', enum: ['instagram', 'twitter', 'tiktok', 'linkedin', 'youtube', 'facebook', 'threads', 'bluesky'] },
            followers: { type: 'integer' },
            engagement_rate: { type: 'number' },
            reach: { type: 'integer' },
            impressions: { type: 'integer' },
            likes: { type: 'integer' },
            comments: { type: 'integer' },
            shares: { type: 'integer' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              date: { type: 'string' },
              platform: { type: 'string' },
              followers: { type: 'integer' },
              engagement_rate: { type: 'number' },
              reach: { type: 'integer' },
              impressions: { type: 'integer' },
              likes: { type: 'integer' },
              comments: { type: 'integer' },
              shares: { type: 'integer' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { date, platform, followers, engagement_rate, reach, impressions, likes, comments, shares } = request.body as { date: string; platform: string; followers: number; engagement_rate?: number; reach?: number; impressions?: number; likes?: number; comments?: number; shares?: number };

      const [metric] = await app.db
        .insert(schema.socialMetrics)
        .values({
          user_id: session.user.id,
          date,
          platform: platform as any,
          followers,
          engagement_rate: engagement_rate?.toString(),
          reach,
          impressions,
          likes,
          comments,
          shares,
        })
        .returning();

      return metric;
    }
  );

  // GET /api/metrics/summary - Get aggregated metrics
  app.fastify.get(
    '/api/metrics/summary',
    {
      schema: {
        description: 'Get aggregated metrics summary (followers, engagement, growth)',
        tags: ['metrics'],
        response: {
          200: {
            type: 'object',
            properties: {
              totalFollowers: { type: 'integer' },
              totalFollowersByPlatform: { type: 'object' },
              averageEngagement: { type: 'number' },
              totalReach: { type: 'integer' },
              totalImpressions: { type: 'integer' },
              recentMetrics: { type: 'array' },
              growthTrend: {
                type: 'object',
                properties: {
                  direction: { type: 'string', enum: ['up', 'down', 'stable'] },
                  percentage: { type: 'number' },
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

      // Get all metrics for the user
      const allMetrics = await app.db
        .select()
        .from(schema.socialMetrics)
        .where(eq(schema.socialMetrics.user_id, session.user.id))
        .orderBy(schema.socialMetrics.date);

      if (allMetrics.length === 0) {
        return {
          totalFollowers: 0,
          totalFollowersByPlatform: {},
          averageEngagement: 0,
          totalReach: 0,
          totalImpressions: 0,
          recentMetrics: [],
          growthTrend: { direction: 'stable', percentage: 0 },
        };
      }

      // Calculate summary metrics
      const totalFollowers = allMetrics.reduce((sum, m) => sum + m.followers, 0);
      const totalFollowersByPlatform = allMetrics.reduce(
        (acc, m) => {
          acc[m.platform] = (acc[m.platform] || 0) + m.followers;
          return acc;
        },
        {} as Record<string, number>
      );

      const avgEngagement =
        allMetrics.filter((m) => m.engagement_rate).reduce((sum, m) => sum + Number(m.engagement_rate || 0), 0) /
          (allMetrics.filter((m) => m.engagement_rate).length || 1) || 0;

      const totalReach = allMetrics.reduce((sum, m) => sum + (m.reach || 0), 0);
      const totalImpressions = allMetrics.reduce((sum, m) => sum + (m.impressions || 0), 0);

      // Get recent metrics (last 7 entries per platform)
      const recentMetrics = allMetrics.slice(-7);

      // Calculate growth trend
      const oldestFollowers = allMetrics[0].followers;
      const newestFollowers = allMetrics[allMetrics.length - 1].followers;
      const growthPercentage = ((newestFollowers - oldestFollowers) / oldestFollowers) * 100 || 0;
      const direction = growthPercentage > 0.5 ? 'up' : growthPercentage < -0.5 ? 'down' : 'stable';

      return {
        totalFollowers,
        totalFollowersByPlatform,
        averageEngagement: Math.round(avgEngagement * 100) / 100,
        totalReach,
        totalImpressions,
        recentMetrics,
        growthTrend: {
          direction,
          percentage: Math.round(growthPercentage * 100) / 100,
        },
      };
    }
  );
}
