# AI-Studio Platform

An online platform where users submit story prompts and the system **auto-generates full-length (≥40 minute) animated videos** with AI-selected characters, scenes, voice/dialogue, and motion rendering.

## 🎬 NEW: Fully Automated AI Video Generation

**Transform any script into a complete animated video in minutes!**

This platform now features advanced AI-powered video generation that can:
- ✨ Analyze scripts using GPT-4 and intelligently break them into scenes
- 🎭 Auto-generate character designs with Stability AI
- 🎙️ Create voice-overs with emotional delivery using ElevenLabs
- 🎨 Generate scene backgrounds and visual elements
- 🎞️ Assemble complete 40+ minute animated videos automatically

### Quick Start: Generate Your First Video

```bash
# 1. Start the backend
cd backend
npm install
npm run dev

# 2. Start the frontend
cd frontend
npm install
npm run dev

# 3. Visit http://localhost:5173/auto-video
# 4. Enter your script and click "Generate Video"
```

See [AI_VIDEO_GENERATION_GUIDE.md](./AI_VIDEO_GENERATION_GUIDE.md) for detailed documentation.

## 🏗️ Architecture Overview

### Tech Stack

**Backend:**
- Node.js with Express & TypeScript
- PostgreSQL with Prisma ORM
- Redis & BullMQ for job queues
- JWT authentication

**Frontend:**
- React 18 with Vite
- TypeScript
- Tailwind CSS
- Zustand for state management
- React Router for navigation

### Project Structure

```
coran/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── validators/       # Request schemas
│   │   ├── utils/            # Helpers
│   │   └── prisma/           # Database schema & migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # State management
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── package.json              # Workspace root
```

## 📊 Database Schema (ER Diagram)

### Entities

**User**
- `user_id` (PK, UUID)
- `email` (unique)
- `password_hash`
- `name`
- `subscription_tier` (free/pro/enterprise)
- `credits_balance`
- `created_at`, `updated_at`

**Project**
- `project_id` (PK, UUID)
- `user_id` (FK → User)
- `title`
- `description`
- `prompt_text` (story prompt)
- `target_length_minutes`
- `style` (2D_flat/3D/anime/cartoon/realistic)
- `status` (draft/processing/completed/failed)
- `version_id` (FK → Version, current version)
- `thumbnail_url`
- `created_at`, `updated_at`, `completed_at`

**Version**
- `version_id` (PK, UUID)
- `project_id` (FK → Project)
- `version_number`
- `changes_summary`
- `created_at`

**Character**
- `character_id` (PK, UUID)
- `project_id` (FK → Project)
- `name`
- `role`
- `image_url`
- `image_metadata` (JSON)
- `voice_style_id` (FK → VoiceStyle)
- `created_at`, `updated_at`

**VoiceStyle**
- `voice_style_id` (PK, UUID)
- `name`
- `language`
- `accent`
- `description`
- `sample_url`
- `created_at`, `updated_at`

**Scene**
- `scene_id` (PK, UUID)
- `project_id` (FK → Project)
- `scene_number`
- `title`
- `start_time_seconds`
- `end_time_seconds`
- `status` (pending/rendering/completed)
- `storyboard_url`
- `dialogue_text`
- `created_at`, `updated_at`

**SceneCharacter** (join table)
- `scene_id` (FK → Scene)
- `character_id` (FK → Character)

**Asset**
- `asset_id` (PK, UUID)
- `project_id` (FK → Project, nullable)
- `type` (image/video/audio)
- `url`
- `metadata` (JSON)
- `created_at`, `updated_at`

**RenderJob**
- `job_id` (PK, UUID)
- `project_id` (FK → Project)
- `job_type` (scene_render/final_video_render)
- `payload` (JSON)
- `status` (queued/running/success/failed)
- `started_at`, `completed_at`
- `output_url`
- `error_message`

**BillingRecord**
- `billing_id` (PK, UUID)
- `user_id` (FK → User)
- `project_id` (FK → Project, nullable)
- `credits_used`
- `amount_charged`
- `description`
- `created_at`

**Notification**
- `notification_id` (PK, UUID)
- `user_id` (FK → User)
- `type`
- `payload` (JSON)
- `is_read`
- `created_at`

**Team**
- `team_id` (PK, UUID)
- `name`
- `created_at`

**TeamMember**
- `team_member_id` (PK, UUID)
- `team_id` (FK → Team)
- `user_id` (FK → User)
- `role`
- `created_at`

### Relationships

- User 1→* Project
- Project 1→* Version
- Project 1→* Character
- Project 1→* Scene
- Project 0/1→ Version (current version)
- Scene N↔M Character (via SceneCharacter)
- Character N→1 VoiceStyle
- Project 1→* Asset
- Project 1→* RenderJob
- User 1→* BillingRecord
- User 1→* Notification
- Team 1→* TeamMember
- User 1→* TeamMember

## 🔄 Sequence Diagrams

### Sequence A: New Project Creation and Character Generation

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant AI-Character-Service
    participant Database
    participant AssetStorage

    User->>Frontend: Create new project (prompt, style, length)
    Frontend->>Backend: POST /api/projects
    Backend->>Database: Insert Project record (status=draft)
    Backend->>AI-Character-Service: Request character proposals
    AI-Character-Service->>AssetStorage: Store generated images
    AssetStorage-->>AI-Character-Service: Return image URLs
    AI-Character-Service-->>Backend: Return character proposals
    Backend->>Database: Insert Character records
    Backend-->>Frontend: Return project + characters
    User->>Frontend: Review/approve characters
    Frontend->>Backend: PUT /api/projects/:id/characters
    Backend->>Database: Update Character records
    User->>Frontend: Trigger scene breakdown
    Backend->>Scene-Service: Analyze prompt, generate scenes
    Scene-Service->>Database: Insert Scene records
    Backend-->>Frontend: Return scene list
    User->>Frontend: Edit scenes, submit for render
    Frontend->>Backend: POST /api/projects/:id/render
    Backend->>Database: Insert RenderJob records
    Backend->>JobQueue: Enqueue render jobs
    Backend-->>Frontend: Return job status
```

### Sequence B: Render Completion and Video Delivery

```mermaid
sequenceDiagram
    participant JobWorker
    participant JobQueue
    participant Database
    participant AssetStorage
    participant NotificationService
    participant User

    JobWorker->>JobQueue: Pick scene_render job
    JobWorker->>AssetStorage: Fetch assets (characters, backgrounds)
    JobWorker->>JobWorker: Run rendering engine
    JobWorker->>AssetStorage: Store video segment
    AssetStorage-->>JobWorker: Return output_url
    JobWorker->>Database: Update RenderJob (status=success)
    Database->>Database: Check if all scenes complete
    alt All scenes rendered
        Database->>JobQueue: Enqueue final_video_render
        JobWorker->>JobQueue: Pick final_video_render
        JobWorker->>AssetStorage: Fetch all scene segments
        JobWorker->>JobWorker: Stitch & encode video
        JobWorker->>AssetStorage: Store final video
        JobWorker->>Database: Update RenderJob + Project (completed)
        NotificationService->>User: Send completion notification
        User->>Frontend: View notification
        Frontend->>AssetStorage: Load video for streaming/download
    end
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Setup environment variables:**

Backend (.env):
```bash
cd backend
cp .env.example .env
# Edit .env with your database and service URLs
```

Frontend (.env):
```bash
cd frontend
cp .env.example .env
# Edit .env with API URL
```

3. **Setup database:**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

4. **Start services:**

In separate terminals:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

Or run both concurrently:
```bash
npm run dev
```

5. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Characters
- `POST /api/projects/:id/characters` - Create characters
- `GET /api/projects/:id/characters` - List characters
- `PUT /api/projects/:projectId/characters/:characterId` - Update character
- `DELETE /api/projects/:projectId/characters/:characterId` - Delete character

### Scenes
- `GET /api/projects/:id/scenes` - List scenes
- `PUT /api/projects/:projectId/scenes/:sceneId` - Update scene
- `DELETE /api/projects/:projectId/scenes/:sceneId` - Delete scene

### Rendering
- `POST /api/projects/:id/render` - Create render job
- `GET /api/render_jobs/:jobId/status` - Get render job status

### Voice Styles
- `GET /api/voice_styles` - List available voice styles

### Billing
- `GET /api/billing/credits` - Get user credits balance

### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 📝 API Request/Response Examples

See [API_SPECIFICATION.md](./API_SPECIFICATION.md) for detailed schemas.

## 🔧 Configuration

### Database
Configure PostgreSQL connection in `backend/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/ai_studio?schema=public"
```

### Redis (Job Queue)
```
REDIS_HOST=localhost
REDIS_PORT=6379
```

### AI Services
Configure external AI service endpoints:
```
AI_CHARACTER_SERVICE_URL=http://localhost:5000
AI_SCENE_SERVICE_URL=http://localhost:5001
AI_VOICE_SERVICE_URL=http://localhost:5002
AI_RENDER_SERVICE_URL=http://localhost:5003
```

## 🎨 Features

- ✅ User authentication & authorization
- ✅ Project management (CRUD)
- ✅ AI character generation
- ✅ Automatic scene breakdown from story prompts
- ✅ Voice style selection
- ✅ Render job queue management
- ✅ Real-time notifications
- ✅ Credit-based billing system
- ✅ Team collaboration support
- ✅ Responsive UI with dark mode

## 📦 Deployment

### Vercel Deployment (Recommended)

This project is configured for easy deployment to Vercel from GitHub.

#### Quick Start

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy Backend**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm run vercel-build`
   - Add environment variables (DATABASE_URL, JWT_SECRET, etc.)

3. **Deploy Frontend**
   - Import same repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Add environment variable: `VITE_API_URL`

#### Documentation

- 📖 **Complete Guide**: See [`VERCEL_DEPLOYMENT_GUIDE.md`](./VERCEL_DEPLOYMENT_GUIDE.md)
- 🚀 **Quick Reference**: See [`DEPLOYMENT_QUICK_REF.md`](./DEPLOYMENT_QUICK_REF.md)
- ✅ **Setup Summary**: See [`DEPLOYMENT_SETUP.md`](./DEPLOYMENT_SETUP.md)

#### Setup Helper

**Windows PowerShell:**
```powershell
.\deploy-vercel.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

### Alternative Deployment

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- CORS enabled
- Request validation with Joi
- SQL injection protection via Prisma

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📧 Support

For support, email support@ai-studio.example.com
