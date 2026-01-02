import { pgTable, text, timestamp, numeric, integer, date, index } from 'drizzle-orm/pg-core';
import { user } from './auth-schema.js';

export const socialMetrics = pgTable(
  'social_metrics',
  {
    id: text('id').primaryKey().$defaultFn(() => Math.random().toString(36).substring(2)),
    user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    platform: text('platform', {
      enum: ['instagram', 'twitter', 'tiktok', 'linkedin', 'youtube', 'facebook', 'threads', 'bluesky'],
    }).notNull() as any,
    followers: integer('followers').notNull(),
    engagement_rate: numeric('engagement_rate', { precision: 5, scale: 2 }),
    reach: integer('reach'),
    impressions: integer('impressions'),
    likes: integer('likes'),
    comments: integer('comments'),
    shares: integer('shares'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => [
    index('user_date_idx').on(table.user_id, table.date),
    index('user_platform_idx').on(table.user_id, table.platform),
  ]
);

export const userGoals = pgTable(
  'user_goals',
  {
    id: text('id').primaryKey().$defaultFn(() => Math.random().toString(36).substring(2)),
    user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    goal_type: text('goal_type', {
      enum: ['followers', 'engagement', 'reach', 'impressions', 'likes', 'comments', 'shares'],
    }).notNull() as any,
    platform: text('platform', {
      enum: ['instagram', 'twitter', 'tiktok', 'linkedin', 'youtube', 'facebook', 'threads', 'bluesky', 'all'],
    }).notNull() as any,
    target_value: integer('target_value').notNull(),
    current_value: integer('current_value').default(0).notNull(),
    deadline: timestamp('deadline').notNull(),
    status: text('status', {
      enum: ['active', 'completed', 'abandoned'],
    }).default('active').notNull() as any,
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => [
    index('user_goals_idx').on(table.user_id),
    index('user_goals_status_idx').on(table.user_id, table.status),
  ]
);
