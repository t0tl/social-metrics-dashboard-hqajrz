# Social Media Analytics API - Sample Data & Integration Guide

## Authentication Endpoints (Better Auth)

### Sign Up with Email
```
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Sign In with Email
```
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Sign In with Google
```
POST /api/auth/sign-in/social
Content-Type: application/json

{
  "provider": "google",
  "callbackURL": "http://localhost:3000/auth/callback"
}
```

### Sign In with Apple
```
POST /api/auth/sign-in/social
Content-Type: application/json

{
  "provider": "apple",
  "callbackURL": "http://localhost:3000/auth/callback"
}
```

### Get Current Session
```
GET /api/auth/get-session

Response:
{
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "emailVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "session": {
    "id": "session_xyz789",
    "expiresAt": "2024-02-15T10:30:00Z",
    "token": "...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Sign Out
```
POST /api/auth/sign-out
```

---

## Metrics API

### GET /api/metrics - Fetch Metrics with Filtering

**Request:**
```
GET /api/metrics?startDate=2024-01-01&endDate=2024-01-31&platform=instagram
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): ISO date string (YYYY-MM-DD)
- `endDate` (optional): ISO date string (YYYY-MM-DD)
- `platform` (optional): one of `instagram`, `twitter`, `tiktok`, `linkedin`, `youtube`, `facebook`, `threads`, `bluesky`

**Response:**
```json
[
  {
    "id": "metric_1",
    "userId": "user_abc123",
    "date": "2024-01-15",
    "platform": "instagram",
    "followers": 12500,
    "engagement_rate": "4.32",
    "reach": 45000,
    "impressions": 98000,
    "likes": 2100,
    "comments": 450,
    "shares": 230,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "metric_2",
    "userId": "user_abc123",
    "date": "2024-01-16",
    "platform": "instagram",
    "followers": 12650,
    "engagement_rate": "4.28",
    "reach": 42000,
    "impressions": 95000,
    "likes": 1900,
    "comments": 420,
    "shares": 200,
    "createdAt": "2024-01-16T10:30:00Z",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
]
```

---

### POST /api/metrics - Add New Metric

**Request:**
```
POST /api/metrics
Content-Type: application/json
Authorization: Bearer <token>

{
  "date": "2024-01-17",
  "platform": "instagram",
  "followers": 12800,
  "engagement_rate": 4.45,
  "reach": 50000,
  "impressions": 110000,
  "likes": 2400,
  "comments": 520,
  "shares": 280
}
```

**Response:**
```json
{
  "id": "metric_3",
  "userId": "user_abc123",
  "date": "2024-01-17",
  "platform": "instagram",
  "followers": 12800,
  "engagement_rate": "4.45",
  "reach": 50000,
  "impressions": 110000,
  "likes": 2400,
  "comments": 520,
  "shares": 280,
  "createdAt": "2024-01-17T14:22:15Z",
  "updatedAt": "2024-01-17T14:22:15Z"
}
```

---

### GET /api/metrics/summary - Get Aggregated Metrics

**Request:**
```
GET /api/metrics/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalFollowers": 127500,
  "totalFollowersByPlatform": {
    "instagram": 45000,
    "twitter": 32000,
    "tiktok": 28500,
    "linkedin": 22000
  },
  "averageEngagement": 4.35,
  "totalReach": 458000,
  "totalImpressions": 1250000,
  "recentMetrics": [
    {
      "id": "metric_1",
      "userId": "user_abc123",
      "date": "2024-01-11",
      "platform": "instagram",
      "followers": 12500,
      "engagement_rate": "4.32",
      "reach": 45000,
      "impressions": 98000,
      "likes": 2100,
      "comments": 450,
      "shares": 230,
      "createdAt": "2024-01-11T10:30:00Z",
      "updatedAt": "2024-01-11T10:30:00Z"
    }
  ],
  "growthTrend": {
    "direction": "up",
    "percentage": 2.45
  }
}
```

---

## Goals API

### GET /api/goals - Fetch All User Goals

**Request:**
```
GET /api/goals
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "goal_1",
    "userId": "user_abc123",
    "goal_type": "followers",
    "platform": "instagram",
    "target_value": 50000,
    "current_value": 12800,
    "deadline": "2024-06-30T23:59:59Z",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-17T14:22:15Z"
  },
  {
    "id": "goal_2",
    "userId": "user_abc123",
    "goal_type": "engagement",
    "platform": "all",
    "target_value": 8,
    "current_value": 4.35,
    "deadline": "2024-03-31T23:59:59Z",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-17T14:22:15Z"
  },
  {
    "id": "goal_3",
    "userId": "user_abc123",
    "goal_type": "likes",
    "platform": "tiktok",
    "target_value": 100000,
    "current_value": 45000,
    "deadline": "2024-02-28T23:59:59Z",
    "status": "completed",
    "createdAt": "2024-01-10T10:30:00Z",
    "updatedAt": "2024-01-17T14:22:15Z"
  }
]
```

---

### POST /api/goals - Create New Goal

**Request:**
```
POST /api/goals
Content-Type: application/json
Authorization: Bearer <token>

{
  "goal_type": "followers",
  "platform": "twitter",
  "target_value": 25000,
  "deadline": "2024-04-30T23:59:59Z"
}
```

**Response:**
```json
{
  "id": "goal_4",
  "userId": "user_abc123",
  "goal_type": "followers",
  "platform": "twitter",
  "target_value": 25000,
  "current_value": 0,
  "deadline": "2024-04-30T23:59:59Z",
  "status": "active",
  "createdAt": "2024-01-17T14:25:00Z",
  "updatedAt": "2024-01-17T14:25:00Z"
}
```

---

### PATCH /api/goals/:id - Update Goal Progress

**Request:**
```
PATCH /api/goals/goal_1
Content-Type: application/json
Authorization: Bearer <token>

{
  "current_value": 15000,
  "status": "active"
}
```

**Response:**
```json
{
  "id": "goal_1",
  "userId": "user_abc123",
  "goal_type": "followers",
  "platform": "instagram",
  "target_value": 50000,
  "current_value": 15000,
  "deadline": "2024-06-30T23:59:59Z",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-17T14:30:00Z"
}
```

---

### DELETE /api/goals/:id - Delete Goal

**Request:**
```
DELETE /api/goals/goal_2
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Goal deleted successfully"
}
```

---

## Analytics API

### GET /api/analytics/trends - Get Trend Data for Charts

**Request:**
```
GET /api/analytics/trends?period=weekly&platform=instagram&limit=12
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): `weekly` or `monthly` (default: `weekly`)
- `platform` (optional): Filter by specific platform
- `limit` (optional): Number of periods to return (default: 12)

**Response:**
```json
{
  "period": "weekly",
  "platform": "instagram",
  "data": [
    {
      "period": "2024-W02",
      "followers": 12450,
      "engagement_rate": 4.28,
      "reach": 42500,
      "impressions": 95000,
      "likes": 1950,
      "comments": 410,
      "shares": 190,
      "changePercent": 0
    },
    {
      "period": "2024-W03",
      "followers": 12680,
      "engagement_rate": 4.35,
      "reach": 48000,
      "impressions": 105000,
      "likes": 2250,
      "comments": 470,
      "shares": 240,
      "changePercent": 1.85
    },
    {
      "period": "2024-W04",
      "followers": 12800,
      "engagement_rate": 4.42,
      "reach": 51000,
      "impressions": 110000,
      "likes": 2450,
      "comments": 510,
      "shares": 270,
      "changePercent": 0.94
    }
  ],
  "summary": {
    "avgFollowers": 12643,
    "avgEngagement": 4.35,
    "totalGrowth": 0.94,
    "bestPeriod": "2024-W04",
    "lowestPeriod": "2024-W02"
  }
}
```

---

## Data Structures Summary

### Metric Object
```typescript
{
  id: string;                    // Unique identifier
  userId: string;                // User who owns this metric
  date: string;                  // ISO date (YYYY-MM-DD)
  platform: string;              // 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'youtube' | 'facebook' | 'threads' | 'bluesky'
  followers: number;             // Follower count
  engagement_rate?: number;      // Percentage (e.g., 4.32)
  reach?: number;                // Reach count
  impressions?: number;          // Total impressions
  likes?: number;                // Total likes
  comments?: number;             // Total comments
  shares?: number;               // Total shares
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Goal Object
```typescript
{
  id: string;                    // Unique identifier
  userId: string;                // User who owns this goal
  goal_type: string;             // 'followers' | 'engagement' | 'reach' | 'impressions' | 'likes' | 'comments' | 'shares'
  platform: string;              // Platform or 'all'
  target_value: number;          // Target value to reach
  current_value: number;         // Current progress (default: 0)
  deadline: string;              // ISO timestamp
  status: string;                // 'active' | 'completed' | 'abandoned'
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Trend Data Object
```typescript
{
  period: string;                // Period identifier (e.g., '2024-W02' or '2024-01')
  followers: number;             // Average followers for period
  engagement_rate: number;       // Average engagement rate
  reach: number;                 // Average reach
  impressions: number;           // Average impressions
  likes: number;                 // Total likes for period
  comments: number;              // Total comments for period
  shares: number;                // Total shares for period
  changePercent: number;         // % change from previous period
}
```

---

## Common Frontend Integration Patterns

### 1. Display User's Total Followers by Platform (Dashboard Card)
```javascript
const summary = await fetch('/api/metrics/summary', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Shows breakdown: Instagram: 45K, Twitter: 32K, TikTok: 28.5K, etc.
```

### 2. Show Metric Trends Over Time (Chart)
```javascript
const trends = await fetch('/api/analytics/trends?period=weekly&platform=instagram', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Use trends.data with a chart library (Chart.js, Recharts, etc.)
// X-axis: period, Y-axis: followers, engagement_rate, reach, etc.
```

### 3. Display Active Goals with Progress (Progress Bars)
```javascript
const goals = await fetch('/api/goals', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

const activeGoals = goals.filter(g => g.status === 'active');
// For each goal: show progress bar (current_value / target_value * 100%)
```

### 4. Add Metric Data from External APIs
```javascript
// After fetching data from Instagram, Twitter, etc. APIs:
const newMetric = await fetch('/api/metrics', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    platform: 'instagram',
    followers: 12800,
    engagement_rate: 4.45,
    reach: 50000,
    impressions: 110000,
    likes: 2400,
    comments: 520,
    shares: 280
  })
}).then(r => r.json());
```

### 5. Update Goal Progress
```javascript
// After fetching current metrics from social platforms:
const updatedGoal = await fetch(`/api/goals/${goalId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    current_value: 15000  // Update progress
  })
}).then(r => r.json());

// Automatically mark as completed if current_value >= target_value
if (updatedGoal.current_value >= updatedGoal.target_value) {
  await fetch(`/api/goals/${goalId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'completed' })
  });
}
```
