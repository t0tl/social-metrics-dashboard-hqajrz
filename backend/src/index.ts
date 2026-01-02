import { createApplication } from "@specific-dev/framework";
import * as appSchema from './db/schema.js';
import * as authSchema from './db/auth-schema.js';
import { registerMetricsRoutes } from './routes/metrics.js';
import { registerGoalsRoutes } from './routes/goals.js';
import { registerAnalyticsRoutes } from './routes/analytics.js';

const schema = { ...appSchema, ...authSchema };

// Create application with schema for full database type support
export const app = await createApplication(schema);

// Export App type for use in route files
export type App = typeof app;

// Enable authentication with Better Auth (Google, Apple, and email/password)
app.withAuth();

// Register routes - add your route modules here
// IMPORTANT: Always use registration functions to avoid circular dependency issues
registerMetricsRoutes(app);
registerGoalsRoutes(app);
registerAnalyticsRoutes(app);

await app.run();
app.logger.info('Application running');
