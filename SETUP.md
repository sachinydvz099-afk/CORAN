# AI-Studio Platform Setup Guide

Follow these steps to set up and run the AI-Studio platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** 6 or higher ([Download](https://redis.io/download))
- **npm** or **yarn** package manager

## Step 1: Clone & Install Dependencies

```bash
# Navigate to the project directory
cd coran

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

## Step 2: Setup PostgreSQL Database

1. **Create a new database:**

```sql
CREATE DATABASE ai_studio;
CREATE USER ai_studio_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ai_studio TO ai_studio_user;
```

2. **Note your connection details** - you'll need these for the environment variables.

## Step 3: Setup Redis

**Windows:**
- Download Redis from https://github.com/microsoftarchive/redis/releases
- Install and run Redis server on default port 6379

**Or use Docker:**
```bash
docker run -d -p 6379:6379 redis:latest
```

## Step 4: Configure Environment Variables

### Backend Configuration

1. **Copy the example environment file:**

```bash
cd backend
copy .env.example .env
```

2. **Edit `backend/.env` with your settings:**

```env
# Database
DATABASE_URL="postgresql://ai_studio_user:your_secure_password@localhost:5432/ai_studio?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
JWT_EXPIRES_IN=7d

# Redis (for job queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS S3 / Asset Storage (Optional for development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=ai-studio-assets

# AI Services (These are placeholder URLs - implement your own AI services)
AI_CHARACTER_SERVICE_URL=http://localhost:5000
AI_SCENE_SERVICE_URL=http://localhost:5001
AI_VOICE_SERVICE_URL=http://localhost:5002
AI_RENDER_SERVICE_URL=http://localhost:5003

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# CDN
CDN_BASE_URL=https://cdn.example.com
```

### Frontend Configuration

1. **Copy the example environment file:**

```bash
cd ../frontend
copy .env.example .env
```

2. **Edit `frontend/.env`:**

```env
VITE_API_URL=http://localhost:3000/api
```

## Step 5: Initialize Database

```bash
# Navigate to backend directory
cd backend

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed initial data (voice styles)
npm run db:seed
```

## Step 6: Start the Development Servers

You have two options:

### Option A: Run Both Services Concurrently (Recommended)

From the root directory:

```bash
npm run dev
```

This will start both backend and frontend servers simultaneously.

### Option B: Run Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 7: Access the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## Step 8: Create Your First Account

1. Navigate to http://localhost:5173
2. Click "Sign up" to create a new account
3. Fill in your details (you'll get 100 free credits)
4. Login and start creating animated videos!

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # Windows (in Services)
   # Look for "postgresql-x64-14" service
   ```

2. Test connection:
   ```bash
   psql -U ai_studio_user -d ai_studio -h localhost
   ```

3. Check DATABASE_URL in `.env` is correct

### Redis Connection Issues

1. Verify Redis is running:
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. Check REDIS_HOST and REDIS_PORT in `.env`

### Port Already in Use

If port 3000 or 5173 is already in use:

1. **Backend**: Change PORT in `backend/.env`
2. **Frontend**: Change port in `frontend/vite.config.ts`:
   ```typescript
   server: {
     port: 5174, // Change to any available port
   }
   ```

### Prisma Issues

If Prisma commands fail:

```bash
cd backend
npx prisma generate
npx prisma migrate reset
```

## Optional: View Database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens a GUI at http://localhost:5555 to view/edit your database.

## Development Workflow

### Making Database Changes

1. Edit `backend/prisma/schema.prisma`
2. Create migration:
   ```bash
   cd backend
   npx prisma migrate dev --name description_of_change
   ```
3. Prisma Client will auto-regenerate

### API Testing

Use tools like:
- **Postman** - Import endpoints from API_SPECIFICATION.md
- **Thunder Client** (VS Code extension)
- **curl** or **httpie**

Example:
```bash
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Need Help?

- Check the [README.md](./README.md) for architecture overview
- Review [API_SPECIFICATION.md](./API_SPECIFICATION.md) for API details
- Open an issue on GitHub
- Contact support@ai-studio.example.com

## Next Steps

1. ✅ Set up the development environment
2. 📖 Read the API documentation
3. 🎨 Explore the frontend UI
4. 🔧 Implement AI service integrations
5. 🚀 Deploy to production

Happy coding! 🎬✨
