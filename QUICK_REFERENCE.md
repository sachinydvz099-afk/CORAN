# AI-Studio Quick Reference Guide

## 🚀 Quick Commands

### Installation & Setup
```bash
# Quick setup (Windows)
setup.bat

# Or manual installation
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Database
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Seed database
npm run db:seed

# Open Prisma Studio
npm run prisma:studio
```

### Development
```bash
# Run both servers concurrently
npm run dev

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Build & Production
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Start production backend
cd backend && npm start
```

---

## 📡 API Quick Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
```bash
# Register
POST /api/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

# Login
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Returns: { "token": "...", "user": {...} }
```

### Projects
```bash
# List projects
GET /api/projects
Headers: Authorization: Bearer <token>

# Create project
POST /api/projects
{
  "title": "My Animation",
  "prompt_text": "Story here...",
  "target_length_minutes": 40,
  "style": "2D_flat"
}

# Get project
GET /api/projects/:id

# Update project
PUT /api/projects/:id

# Delete project
DELETE /api/projects/:id
```

### Characters
```bash
# Create characters
POST /api/projects/:id/characters
{
  "actions": [
    {
      "name": "Hero",
      "role": "protagonist",
      "image_choice": "generated"
    }
  ]
}

# List characters
GET /api/projects/:id/characters
```

### Rendering
```bash
# Start render
POST /api/projects/:id/render
{
  "render_type": "final_video",
  "resolution": "1080p",
  "output_format": "mp4"
}

# Check status
GET /api/render_jobs/:jobId/status
```

---

## 🗄️ Database Schema Quick Ref

### Main Tables
- **users** - User accounts
- **projects** - Animation projects
- **characters** - Generated characters
- **scenes** - Story scenes
- **render_jobs** - Rendering tasks
- **voice_styles** - Available voices
- **notifications** - User notifications
- **billing_records** - Credit tracking

### Key Relationships
```
User ──< Project ──< Character
                 ──< Scene ──<>── Character
                 ──< RenderJob
User ──< Notification
User ──< BillingRecord
```

---

## 🎨 Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User login |
| `/register` | Register | User signup |
| `/dashboard` | Dashboard | Project list |
| `/projects/new` | CreateProject | New project form |
| `/projects/:id` | ProjectDetail | Project details |

---

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📊 Project Status Values

| Status | Description |
|--------|-------------|
| `draft` | Initial creation |
| `processing` | AI generation in progress |
| `completed` | Video ready |
| `failed` | Error occurred |

---

## 🎭 Animation Styles

| Value | Label | Description |
|-------|-------|-------------|
| `2D_flat` | 2D Flat | Modern flat design |
| `3D` | 3D Realistic | Detailed 3D |
| `anime` | Anime | Japanese animation |
| `cartoon` | Cartoon | Western cartoon |
| `realistic` | Realistic | Photo-realistic |

---

## 🔐 Auth Flow

1. User registers → Receives 100 credits
2. User logs in → Receives JWT token
3. Token stored in localStorage
4. All API requests include: `Authorization: Bearer <token>`
5. Token expires after 7 days (default)

---

## 💳 Credit System

### Default Costs (Example)
- **Character Generation**: 10 credits each
- **Scene Render**: 20 credits each
- **Final Video**: 50 credits
- **40-min Video**: ~300 credits total

### Tiers
- **Free**: 100 credits (signup)
- **Pro**: $29/month, 1000 credits
- **Enterprise**: Custom

---

## 🛠️ Common Tasks

### Add a New API Endpoint

1. Create validator in `backend/src/validators/`
2. Create controller in `backend/src/controllers/`
3. Add route in `backend/src/routes/`
4. Register route in `backend/src/index.ts`

### Add a New Database Table

1. Update `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name table_name`
3. Run `npx prisma generate`

### Add a New Frontend Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link if needed

---

## 🐛 Debugging

### Backend Logs
```bash
# Check logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Database Inspection
```bash
# Open Prisma Studio
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

### Redis Queue
```bash
# Connect to Redis CLI
redis-cli

# Check queues
KEYS *
LLEN bull:render:waiting
LLEN bull:scene:waiting
```

---

## 📦 Project Structure (Simplified)

```
coran/
├── backend/
│   ├── src/
│   │   ├── controllers/    # API logic
│   │   ├── routes/         # Endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── prisma/         # Database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── App.tsx
│   └── package.json
└── package.json
```

---

## 🔗 Useful URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **Prisma Studio**: http://localhost:5555

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `SETUP.md` | Setup instructions |
| `API_SPECIFICATION.md` | API reference |
| `PROJECT_SUMMARY.md` | Project overview |
| `ARCHITECTURE_DIAGRAMS.md` | Visual diagrams |
| `QUICK_REFERENCE.md` | This file |

---

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection:
psql -U postgres -d ai_studio
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping  # Should return PONG
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000
# Kill process or change PORT in .env
```

### Prisma Errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

---

## 🎯 Key Features Checklist

- ✅ User authentication (JWT)
- ✅ Project CRUD operations
- ✅ Character generation
- ✅ Scene management
- ✅ Render job queue
- ✅ Credit system
- ✅ Notifications
- ✅ Team collaboration
- ✅ Dark mode UI
- ✅ Responsive design

---

## 📞 Getting Help

1. Check this quick reference
2. Read `SETUP.md` for detailed setup
3. Review `API_SPECIFICATION.md` for API details
4. Check logs in `backend/logs/`
5. Open an issue on GitHub

---

**Last Updated**: November 2025
**Version**: 1.0.0
