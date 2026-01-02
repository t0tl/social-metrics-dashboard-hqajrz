# Social Media Analytics API - Quick Reference

## 🔐 Authentication (Better Auth)

All endpoints except auth require a valid Bearer token in the `Authorization` header.

### Get Auth Token
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123"}'

# Get session
curl -X GET http://localhost:3000/api/auth/get-session

# Sign out
curl -X POST http://localhost:3000/api/auth/sign-out
```

---

## 📊 Metrics Endpoints

### 1. Get Metrics (with filters)
```bash
curl -X GET "http://localhost:3000/api/metrics?startDate=2024-01-01&endDate=2024-01-31&platform=instagram" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `platform` (optional): instagram, twitter, tiktok, linkedin, youtube, facebook, threads, bluesky

---

### 2. Add New Metric
```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-17",
    "platform": "instagram",
    "followers": 12800,
    "engagement_rate": 4.45,
    "reach": 50000,
    "impressions": 110000,
    "likes": 2400,
    "comments": 520,
    "shares": 280
  }'
```

**Required Fields:**
- `date`: YYYY-MM-DD format
- `platform`: instagram, twitter, tiktok, linkedin, youtube, facebook, threads, bluesky
- `followers`: integer

**Optional Fields:**
- `engagement_rate`: number (decimal)
- `reach`: integer
- `impressions`: integer
- `likes`: integer
- `comments`: integer
- `shares`: integer

---

### 3. Get Metrics Summary
```bash
curl -X GET http://localhost:3000/api/metrics/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Returns:**
- `totalFollowers`: Sum of all followers across metrics
- `totalFollowersByPlatform`: Breakdown by platform
- `averageEngagement`: Average engagement rate
- `totalReach`: Sum of all reach
- `totalImpressions`: Sum of all impressions
- `recentMetrics`: Last 7 metric entries
- `growthTrend`: Direction (up/down/stable) and percentage

---

## 🎯 Goals Endpoints

### 1. Get All Goals
```bash
curl -X GET http://localhost:3000/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Create Goal
```bash
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

**Required Fields:**
- `goal_type`: followers, engagement, reach, impressions, likes, comments, shares
- `platform`: instagram, twitter, tiktok, linkedin, youtube, facebook, threads, bluesky, all
- `target_value`: integer (target number)
- `deadline`: ISO timestamp (e.g., 2024-06-30T23:59:59Z)

---

### 3. Update Goal Progress
```bash
curl -X PATCH http://localhost:3000/api/goals/GOAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_value": 15000,
    "status": "active"
  }'
```

**Optional Fields:**
- `current_value`: integer
- `status`: active, completed, abandoned

---

### 4. Delete Goal
```bash
curl -X DELETE http://localhost:3000/api/goals/GOAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📈 Analytics / Trends Endpoints

### Get Trend Data
```bash
curl -X GET "http://localhost:3000/api/analytics/trends?period=weekly&platform=instagram&limit=12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `period` (optional): weekly or monthly (default: weekly)
- `platform` (optional): specific platform filter
- `limit` (optional): number of periods to return (default: 12)

**Returns:**
- `period`: Aggregation period
- `platform`: Filter platform
- `data`: Array of trend data points with:
  - `period`: Period identifier (e.g., 2024-W02)
  - `followers`: Average followers for period
  - `engagement_rate`: Average engagement
  - `reach`: Average reach
  - `impressions`: Average impressions
  - `likes`: Total likes
  - `comments`: Total comments
  - `shares`: Total shares
  - `changePercent`: % change from previous period
- `summary`: Summary stats including avg followers, avg engagement, total growth, best/worst periods

---

## 📋 Platform Options

Available platforms across all endpoints:
- `instagram`
- `twitter`
- `tiktok`
- `linkedin`
- `youtube`
- `facebook`
- `threads`
- `bluesky`

**Note:** Goals can target `all` platforms in addition to individual platforms

---

## 🎯 Goal Types

- `followers`: Track follower growth
- `engagement`: Track engagement rate
- `reach`: Track reach metrics
- `impressions`: Track total impressions
- `likes`: Track total likes
- `comments`: Track total comments
- `shares`: Track total shares

---

## 📝 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not found (goal/metric doesn't exist) |
| 500 | Server error |

---

## 🚀 Common Tasks

### Dashboard - Show follower summary
```javascript
const summary = await fetch('/api/metrics/summary', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

console.log(`Total followers: ${summary.totalFollowers}`);
console.log(`Instagram: ${summary.totalFollowersByPlatform.instagram}`);
console.log(`Growth: ${summary.growthTrend.direction} (${summary.growthTrend.percentage}%)`);
```

### Chart - Weekly trend
```javascript
const trends = await fetch('/api/analytics/trends?period=weekly', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Use trends.data for chart visualization
// X-axis: period, Y-axis: followers/engagement/reach
```

### Goal tracking - Show progress
```javascript
const goals = await fetch('/api/goals', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

goals.forEach(goal => {
  const progress = (goal.current_value / goal.target_value) * 100;
  console.log(`${goal.goal_type}: ${progress.toFixed(1)}% complete`);
});
```

### Update metrics from external API
```javascript
const data = await fetchFromInstagramAPI();

await fetch('/api/metrics', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    platform: 'instagram',
    followers: data.followers,
    engagement_rate: data.engagementRate,
    reach: data.reach,
    impressions: data.impressions,
    likes: data.likes,
    comments: data.comments,
    shares: data.shares
  })
});
```

---

## 📚 Full Documentation

See `SAMPLE_DATA.md` for comprehensive API examples with request/response bodies.

See `TYPESCRIPT_TYPES.ts` for TypeScript type definitions to use in your frontend.
