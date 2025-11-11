# AI-Studio API Specification

Complete API documentation with request/response JSON schemas.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 POST /register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePa$$word",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "subscription_tier": "free",
  "credits_balance": 100,
  "created_at": "2025-11-11T08:00:00Z"
}
```

**Error Responses:**
- `400` - Validation error or email already exists
- `500` - Internal server error

---

### 1.2 POST /login

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePa$$word"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 604800,
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "subscription_tier": "free",
    "credits_balance": 100
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `500` - Internal server error

---

## 2. Project Endpoints

### 2.1 GET /projects

List all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "projects": [
    {
      "project_id": "456e8400-e29b-41d4-a716-446655440000",
      "title": "My Epic Animation",
      "status": "draft",
      "style": "2D_flat",
      "target_length_minutes": 45,
      "created_at": "2025-11-10T12:00:00Z",
      "updated_at": "2025-11-10T12:15:00Z",
      "thumbnail_url": "https://cdn.example.com/thumbnails/456.png",
      "character_count": 3,
      "scene_count": 12
    }
  ]
}
```

---

### 2.2 POST /projects

Create a new animation project.

**Request:**
```json
{
  "title": "My Epic Animation",
  "description": "A heroic journey in a medieval kingdom.",
  "prompt_text": "A young blacksmith in a medieval kingdom rises to defeat a dragon...",
  "target_length_minutes": 40,
  "style": "2D_flat"
}
```

**Validation:**
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `prompt_text`: Required, min 10 characters
- `target_length_minutes`: Required, 1-120
- `style`: Required, one of: `2D_flat`, `3D`, `anime`, `cartoon`, `realistic`

**Response (201 Created):**
```json
{
  "project_id": "456e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My Epic Animation",
  "description": "A heroic journey in a medieval kingdom.",
  "prompt_text": "A young blacksmith in a medieval kingdom rises to defeat a dragon...",
  "target_length_minutes": 40,
  "style": "2D_flat",
  "status": "draft",
  "created_at": "2025-11-11T08:05:00Z",
  "updated_at": "2025-11-11T08:05:00Z"
}
```

---

### 2.3 GET /projects/:id

Get detailed project information.

**Response (200 OK):**
```json
{
  "project_id": "456e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My Epic Animation",
  "description": "A heroic journey in a medieval kingdom.",
  "prompt_text": "A young blacksmith in a medieval kingdom rises to defeat a dragon...",
  "target_length_minutes": 40,
  "style": "2D_flat",
  "status": "draft",
  "created_at": "2025-11-11T08:05:00Z",
  "updated_at": "2025-11-11T08:10:00Z",
  "completed_at": null,
  "characters": [...],
  "scenes": [...],
  "render_job_count": 0
}
```

---

### 2.4 PUT /projects/:id

Update project details.

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "processing"
}
```

**Response (200 OK):**
```json
{
  "project_id": "456e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated Title",
  "description": "Updated description",
  "prompt_text": "A young blacksmith...",
  "target_length_minutes": 40,
  "style": "2D_flat",
  "status": "processing",
  "updated_at": "2025-11-11T08:20:00Z"
}
```

---

### 2.5 DELETE /projects/:id

Delete a project.

**Response (200 OK):**
```json
{
  "message": "Project deleted successfully"
}
```

---

## 3. Character Endpoints

### 3.1 POST /projects/:id/characters

Create characters for a project.

**Request:**
```json
{
  "actions": [
    {
      "role": "hero",
      "name": "Arin",
      "image_choice": "generated",
      "metadata": {
        "pose": "standing",
        "expression": "determined",
        "outfit": "leather apron"
      },
      "voice_style_id": "voice-uuid-here"
    },
    {
      "role": "villain",
      "name": "Drake",
      "image_choice": "generated",
      "metadata": {
        "pose": "smirking",
        "expression": "evil grin",
        "outfit": "black armor"
      }
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "characters": [
    {
      "character_id": "789e8400-e29b-41d4-a716-446655440000",
      "project_id": "456e8400-e29b-41d4-a716-446655440000",
      "name": "Arin",
      "role": "hero",
      "image_url": "https://cdn.example.com/characters/789.png",
      "image_metadata": {
        "pose": "standing",
        "expression": "determined",
        "outfit": "leather apron"
      },
      "voice_style_id": "voice-uuid-here",
      "created_at": "2025-11-11T08:10:00Z",
      "updated_at": "2025-11-11T08:10:00Z"
    },
    {
      "character_id": "790e8400-e29b-41d4-a716-446655440000",
      "project_id": "456e8400-e29b-41d4-a716-446655440000",
      "name": "Drake",
      "role": "villain",
      "image_url": "https://cdn.example.com/characters/790.png",
      "image_metadata": {
        "pose": "smirking",
        "expression": "evil grin",
        "outfit": "black armor"
      },
      "voice_style_id": null,
      "created_at": "2025-11-11T08:10:00Z",
      "updated_at": "2025-11-11T08:10:00Z"
    }
  ]
}
```

---

### 3.2 GET /projects/:id/characters

Get all characters for a project.

**Response (200 OK):**
```json
{
  "characters": [
    {
      "character_id": "789e8400-e29b-41d4-a716-446655440000",
      "project_id": "456e8400-e29b-41d4-a716-446655440000",
      "name": "Arin",
      "role": "hero",
      "image_url": "https://cdn.example.com/characters/789.png",
      "image_metadata": {...},
      "voice_style_id": "voice-uuid",
      "voice_style": {
        "voice_style_id": "voice-uuid",
        "name": "American Male – Neutral",
        "language": "en-US",
        "accent": "American"
      },
      "created_at": "2025-11-11T08:10:00Z",
      "updated_at": "2025-11-11T08:10:00Z"
    }
  ]
}
```

---

## 4. Scene Endpoints

### 4.1 GET /projects/:id/scenes

Get all scenes for a project.

**Response (200 OK):**
```json
{
  "scenes": [
    {
      "scene_id": "1001e8400-e29b-41d4-a716-446655440000",
      "project_id": "456e8400-e29b-41d4-a716-446655440000",
      "scene_number": 1,
      "title": "The Blacksmith's Birth",
      "start_time_seconds": 0,
      "end_time_seconds": 300,
      "status": "pending",
      "storyboard_url": "https://cdn.example.com/storyboards/1001.png",
      "dialogue_text": "In a small village...",
      "characters": [...],
      "created_at": "2025-11-11T08:12:00Z",
      "updated_at": "2025-11-11T08:12:00Z"
    },
    {
      "scene_id": "1002e8400-e29b-41d4-a716-446655440000",
      "project_id": "456e8400-e29b-41d4-a716-446655440000",
      "scene_number": 2,
      "title": "Call to Adventure",
      "start_time_seconds": 300,
      "end_time_seconds": 600,
      "status": "pending",
      "storyboard_url": "https://cdn.example.com/storyboards/1002.png",
      "dialogue_text": "One day, a mysterious stranger...",
      "characters": [...],
      "created_at": "2025-11-11T08:12:30Z",
      "updated_at": "2025-11-11T08:12:30Z"
    }
  ]
}
```

---

## 5. Render Endpoints

### 5.1 POST /projects/:id/render

Create a render job for the project.

**Request:**
```json
{
  "render_type": "final_video",
  "resolution": "1080p",
  "output_format": "mp4",
  "notify_on_complete": true
}
```

**For scene render:**
```json
{
  "render_type": "scene_render",
  "scene_id": "1001e8400-e29b-41d4-a716-446655440000",
  "resolution": "1080p",
  "output_format": "mp4",
  "notify_on_complete": true
}
```

**Validation:**
- `render_type`: Required, one of: `final_video`, `scene_render`
- `resolution`: Optional, one of: `720p`, `1080p`, `4k` (default: `1080p`)
- `output_format`: Optional, one of: `mp4`, `mov`, `webm` (default: `mp4`)
- `scene_id`: Required if `render_type` is `scene_render`

**Response (202 Accepted):**
```json
{
  "job_id": "2001e8400-e29b-41d4-a716-446655440000",
  "project_id": "456e8400-e29b-41d4-a716-446655440000",
  "job_type": "final_video_render",
  "status": "queued",
  "started_at": null,
  "completed_at": null,
  "output_url": null
}
```

---

### 5.2 GET /render_jobs/:jobId/status

Get the status of a render job.

**Response (200 OK) - In Progress:**
```json
{
  "job_id": "2001e8400-e29b-41d4-a716-446655440000",
  "project_id": "456e8400-e29b-41d4-a716-446655440000",
  "job_type": "final_video_render",
  "status": "running",
  "started_at": "2025-11-11T08:20:00Z",
  "completed_at": null,
  "output_url": null,
  "error_message": null
}
```

**Response (200 OK) - Completed:**
```json
{
  "job_id": "2001e8400-e29b-41d4-a716-446655440000",
  "project_id": "456e8400-e29b-41d4-a716-446655440000",
  "job_type": "final_video_render",
  "status": "success",
  "started_at": "2025-11-11T08:20:00Z",
  "completed_at": "2025-11-11T09:45:00Z",
  "output_url": "https://cdn.example.com/videos/456_final_1080p.mp4",
  "error_message": null
}
```

---

## 6. Voice Style Endpoints

### 6.1 GET /voice_styles

Get all available voice styles.

**Response (200 OK):**
```json
{
  "voice_styles": [
    {
      "voice_style_id": "voice1-uuid",
      "name": "American Male – Neutral",
      "language": "en-US",
      "accent": "American",
      "description": "Male voice, neutral tone",
      "sample_url": "https://cdn.example.com/voices/1_sample.mp3",
      "created_at": "2025-10-01T12:00:00Z",
      "updated_at": "2025-10-01T12:00:00Z"
    },
    {
      "voice_style_id": "voice2-uuid",
      "name": "British Female – Dramatic",
      "language": "en-GB",
      "accent": "British",
      "description": "Female voice, cinematic dramatic tone",
      "sample_url": "https://cdn.example.com/voices/2_sample.mp3",
      "created_at": "2025-10-02T12:00:00Z",
      "updated_at": "2025-10-02T12:00:00Z"
    }
  ]
}
```

---

## 7. Billing Endpoints

### 7.1 GET /billing/credits

Get user's credit balance and usage stats.

**Response (200 OK):**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "credits_balance": 1200,
  "projects_this_month": 2,
  "credits_used_this_month": 300
}
```

---

## 8. Notification Endpoints

### 8.1 GET /notifications

Get user notifications.

**Query Parameters:**
- `limit`: Number of notifications to return (default: 20)
- `offset`: Pagination offset (default: 0)
- `unread_only`: Filter unread notifications (default: false)

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "notification_id": "notif1-uuid",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "render_complete",
      "payload": {
        "project_id": "456e8400-e29b-41d4-a716-446655440000",
        "project_title": "My Epic Animation",
        "output_url": "https://cdn.example.com/videos/456_final.mp4"
      },
      "is_read": false,
      "created_at": "2025-11-11T09:45:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

---

### 8.2 PUT /notifications/:id/read

Mark notification as read.

**Response (200 OK):**
```json
{
  "notification_id": "notif1-uuid",
  "is_read": true
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "error": "Project not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "statusCode": 500
}
```

---

## Rate Limiting

- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Enterprise tier: Unlimited

## Webhooks (Future)

Webhook events will be sent to configured URLs for:
- `render.completed`
- `render.failed`
- `project.created`
- `credits.low`
