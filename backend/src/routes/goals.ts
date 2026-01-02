import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, and } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

export function registerGoalsRoutes(app: App) {
  const requireAuth = app.requireAuth();

  // GET /api/goals - Fetch all user goals
  app.fastify.get(
    '/api/goals',
    {
      schema: {
        description: 'Fetch all user goals',
        tags: ['goals'],
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                goal_type: { type: 'string' },
                platform: { type: 'string' },
                target_value: { type: 'integer' },
                current_value: { type: 'integer' },
                deadline: { type: 'string' },
                status: { type: 'string' },
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

      const goals = await app.db
        .select()
        .from(schema.userGoals)
        .where(eq(schema.userGoals.user_id, session.user.id))
        .orderBy(schema.userGoals.deadline);

      return goals;
    }
  );

  // POST /api/goals - Create a new goal
  app.fastify.post(
    '/api/goals',
    {
      schema: {
        description: 'Create a new user goal',
        tags: ['goals'],
        body: {
          type: 'object',
          required: ['goal_type', 'platform', 'target_value', 'deadline'],
          properties: {
            goal_type: { type: 'string', enum: ['followers', 'engagement', 'reach', 'impressions', 'likes', 'comments', 'shares'] },
            platform: { type: 'string', enum: ['instagram', 'twitter', 'tiktok', 'linkedin', 'youtube', 'facebook', 'threads', 'bluesky', 'all'] },
            target_value: { type: 'integer' },
            deadline: { type: 'string', description: 'ISO timestamp' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              goal_type: { type: 'string' },
              platform: { type: 'string' },
              target_value: { type: 'integer' },
              current_value: { type: 'integer' },
              deadline: { type: 'string' },
              status: { type: 'string' },
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

      const { goal_type, platform, target_value, deadline } = request.body as { goal_type: string; platform: string; target_value: number; deadline: string };

      const [goal] = await app.db
        .insert(schema.userGoals)
        .values({
          user_id: session.user.id,
          goal_type: goal_type as any,
          platform: platform as any,
          target_value,
          deadline: new Date(deadline),
        })
        .returning();

      return goal;
    }
  );

  // PATCH /api/goals/:id - Update goal progress
  app.fastify.patch(
    '/api/goals/:id',
    {
      schema: {
        description: 'Update goal progress or status',
        tags: ['goals'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            current_value: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'completed', 'abandoned'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              goal_type: { type: 'string' },
              platform: { type: 'string' },
              target_value: { type: 'integer' },
              current_value: { type: 'integer' },
              deadline: { type: 'string' },
              status: { type: 'string' },
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

      const { id } = request.params as { id: string };
      const { current_value, status } = request.body as { current_value?: number; status?: string };

      // Verify goal belongs to user
      const goal = await app.db
        .select()
        .from(schema.userGoals)
        .where(and(eq(schema.userGoals.id, id), eq(schema.userGoals.user_id, session.user.id)));

      if (goal.length === 0) {
        return reply.code(404).send({ error: 'Goal not found' });
      }

      const updateData: any = {};
      if (current_value !== undefined) {
        updateData.current_value = current_value;
      }
      if (status !== undefined) {
        updateData.status = status;
      }

      const [updated] = await app.db
        .update(schema.userGoals)
        .set(updateData)
        .where(eq(schema.userGoals.id, id))
        .returning();

      return updated;
    }
  );

  // DELETE /api/goals/:id - Delete a goal
  app.fastify.delete(
    '/api/goals/:id',
    {
      schema: {
        description: 'Delete a user goal',
        tags: ['goals'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const session = await requireAuth(request, reply);
      if (!session) return;

      const { id } = request.params as { id: string };

      // Verify goal belongs to user
      const goal = await app.db
        .select()
        .from(schema.userGoals)
        .where(and(eq(schema.userGoals.id, id), eq(schema.userGoals.user_id, session.user.id)));

      if (goal.length === 0) {
        return reply.code(404).send({ error: 'Goal not found' });
      }

      await app.db.delete(schema.userGoals).where(eq(schema.userGoals.id, id));

      return { message: 'Goal deleted successfully' };
    }
  );
}
