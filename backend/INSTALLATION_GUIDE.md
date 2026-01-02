# Installation & Setup Guide

## ✅ What's Already Been Implemented

Your social media analytics backend is **fully implemented and ready to use**. No additional setup is needed beyond the automatic verification process.

### What's Included

1. **Database Schema** - Two production-ready tables:
   - `social_metrics` - For storing daily social media metrics
   - `user_goals` - For storing user-defined goals

2. **Better Auth Integration** - Complete authentication system:
   - Email/password signup and login
   - Google OAuth support
   - Apple OAuth support
   - Automatic session management

3. **API Endpoints** - 8 fully functional endpoints:
   - 3 metrics endpoints (GET, POST, summary)
   - 4 goals endpoints (GET, POST, PATCH, DELETE)
   - 1 analytics endpoint (trends)

4. **Type Safety** - TypeScript types for all API responses

5. **Documentation** - Multiple reference guides included

---

## 🚀 Getting Started

### 1. Verify Installation
The platform will automatically:
- Build the project
- Generate database migrations
- Apply migrations to the database
- Start the application
- Verify all endpoints work correctly

No manual commands needed!

### 2. Test Authentication

Once running, test authentication with:

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Response includes token for subsequent requests
# {
#   "user": { "id": "...", "email": "test@example.com", ... },
#   "session": { "token": "...", ... }
# }
```

### 3. Use the Token

Add the token to subsequent requests:

```bash
curl -X GET http://localhost:3000/api/metrics \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### 4. Add Sample Data

```bash
# Add a metric
curl -X POST http://localhost:3000/api/metrics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "platform": "instagram",
    "followers": 10000,
    "engagement_rate": 4.5,
    "reach": 45000,
    "impressions": 98000,
    "likes": 2100,
    "comments": 450,
    "shares": 230
  }'

# Create a goal
curl -X POST http://localhost:3000/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goal_type": "followers",
    "platform": "instagram",
    "target_value": 50000,
    "deadline": "2024-06-30T23:59:59Z"
  }'
```

---

## 📂 Project Structure

```
src/
├── index.ts                      # Main app entry point
├── db/
│   ├── schema.ts                 # App schema (metrics, goals)
│   ├── auth-schema.ts            # Better Auth schema
│   └── migrate.ts                # Migrations
└── routes/
    ├── metrics.ts                # Metrics API
    ├── goals.ts                  # Goals API
    └── analytics.ts              # Analytics/Trends API

drizzle/                          # Auto-generated migrations
drizzle.config.ts                 # Drizzle configuration
```

---

## 🔧 Configuration

### Environment Variables

The application automatically uses:
- `DATABASE_URL` - Connection string (for Neon in production, auto-generated for PGlite in dev)

No configuration needed - everything is handled automatically!

### Database

- **Development**: Uses PGlite (embedded PostgreSQL) locally
- **Production**: Uses Neon (serverless PostgreSQL)
- **Migrations**: Applied automatically on startup

---

## 📚 Documentation Files

The following files are included for reference:

1. **SAMPLE_DATA.md** - Complete API documentation with examples
   - Auth endpoints
   - Request/response bodies
   - Query parameters
   - Integration examples

2. **API_QUICK_REFERENCE.md** - Quick reference for all endpoints
   - cURL examples
   - Common tasks
   - Error codes

3. **TYPESCRIPT_TYPES.ts** - TypeScript type definitions
   - All data models
   - Helper functions
   - Platform configuration

4. **IMPLEMENTATION_SUMMARY.md** - Technical overview
   - Database schema details
   - Endpoint descriptions
   - Architecture overview

---

## 🧪 Testing the API

### Get Session
```bash
curl -X GET http://localhost:3000/api/auth/get-session
```

### List Metrics
```bash
curl -X GET http://localhost:3000/api/metrics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Metrics Summary
```bash
curl -X GET http://localhost:3000/api/metrics/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Trends
```bash
curl -X GET "http://localhost:3000/api/analytics/trends?period=weekly" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔐 Security Features

✅ **Authentication**
- Better Auth handles all security
- Password hashing (bcrypt)
- Session tokens
- OAuth providers managed securely

✅ **Data Isolation**
- All endpoints verify user ownership
- Users can only see their own data
- Foreign key constraints enforce data integrity
- Automatic cascading deletes

✅ **API Protection**
- All non-auth endpoints require authentication
- Input validation on all endpoints
- Rate limiting via framework
- CORS configured

---

## 🚀 Next Steps

1. **Frontend Integration**
   - Use `TYPESCRIPT_TYPES.ts` for type safety
   - Refer to `SAMPLE_DATA.md` for API format
   - Follow examples in `API_QUICK_REFERENCE.md`

2. **Add Social Media Integrations**
   - Fetch data from Instagram, Twitter, etc. APIs
   - Store using `/api/metrics` POST endpoint
   - Update goal progress automatically

3. **Advanced Features**
   - Implement webhook handlers for social media updates
   - Add scheduling for automatic metric collection
   - Create automated alerts for goal milestones
   - Build custom analytics visualizations

4. **Deployment**
   - Platform handles all deployment automatically
   - Set `DATABASE_URL` to your Neon connection string
   - Everything else is configured

---

## ❓ Troubleshooting

### Authentication Not Working
- Ensure token is in `Authorization: Bearer` format
- Check token expiration (sessions are 30 days by default)
- Create new session if needed

### Metrics Not Saving
- Verify you're authenticated (have valid token)
- Check date format is YYYY-MM-DD
- Ensure platform is valid (instagram, twitter, etc.)

### Migrations Issues
- Migrations are automatic - no manual action needed
- Platform handles generation and application
- Check build logs if issues occur

---

## 📖 API Documentation

Full interactive API docs available at:
- `GET /api/auth/reference` - Interactive API explorer
- `GET /api/auth/open-api/generate-schema` - OpenAPI schema (JSON)

---

## 🎯 Summary

Your backend is **production-ready** with:
- ✅ Complete authentication system
- ✅ Database schema and migrations
- ✅ All required API endpoints
- ✅ Type-safe TypeScript implementation
- ✅ Comprehensive documentation
- ✅ Security best practices

Start using the API immediately to track social media metrics and manage goals!
