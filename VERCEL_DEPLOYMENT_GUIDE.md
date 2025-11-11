# Vercel Deployment Guide

This guide will walk you through deploying both the backend and frontend of the AI-Studio project to Vercel from GitHub.

## Prerequisites

1. **GitHub Account** - Your code must be pushed to a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **PostgreSQL Database** - You'll need a hosted PostgreSQL database (Vercel Postgres, Supabase, or Neon)
4. **Redis Instance** - Optional for job queue (Upstash Redis recommended for Vercel)

## Step 1: Prepare Your GitHub Repository

### Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel Dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` connection string

### Option B: External Providers

- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app

## Step 3: Deploy Backend to Vercel

### 3.1 Import Backend Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure the project:
   - **Project Name**: `ai-studio-backend` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

### 3.2 Configure Environment Variables

Add the following environment variables in Vercel:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret (generate with: `openssl rand -base64 32`)
- `NODE_ENV` - `production`

**Optional (add as needed):**
- `REDIS_HOST` - Redis host (e.g., from Upstash)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_PASSWORD` - Redis password
- `AWS_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - S3 bucket name
- `STRIPE_SECRET_KEY` - Stripe secret key
- `AI_CHARACTER_SERVICE_URL` - AI service URL
- `AI_SCENE_SERVICE_URL` - AI service URL
- `AI_VOICE_SERVICE_URL` - AI service URL
- `AI_RENDER_SERVICE_URL` - AI service URL

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Copy your backend URL (e.g., `https://ai-studio-backend.vercel.app`)

### 3.4 Run Database Migrations

After deployment, you need to run migrations:

1. Install Vercel CLI locally:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   cd backend
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.production
   ```

4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Step 4: Deploy Frontend to Vercel

### 4.1 Import Frontend Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select the same GitHub repository
4. Configure the project:
   - **Project Name**: `ai-studio-frontend` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Configure Environment Variables

Add the following environment variable:

- `VITE_API_URL` - Your backend URL (e.g., `https://ai-studio-backend.vercel.app/api`)

### 4.3 Update Frontend vercel.json (Optional)

If you want to proxy API requests through the frontend domain, update `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://ai-studio-backend.vercel.app/api/:path*"
    }
  ]
}
```

Replace `https://ai-studio-backend.vercel.app` with your actual backend URL.

### 4.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your frontend will be available at `https://ai-studio-frontend.vercel.app`

## Step 5: Configure Custom Domains (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Step 6: Enable Automatic Deployments

By default, Vercel automatically deploys:
- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request

To configure this:
1. Go to project settings
2. Click "Git"
3. Configure branch settings

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify `DATABASE_URL` is correctly set
2. Ensure your database allows connections from Vercel's IP ranges
3. Check if SSL is required (add `?sslmode=require` to connection string)

### Build Failures

If the build fails:
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Ensure Prisma client is generated during build

### API Connection Issues

If frontend can't connect to backend:
1. Verify `VITE_API_URL` is set correctly
2. Check CORS settings in backend
3. Verify backend is deployed and running

### Prisma Issues

If you encounter Prisma errors:
1. Ensure `@prisma/client` and `prisma` are in dependencies
2. Run `npx prisma generate` locally to test
3. Check that migrations are applied

## Redis Configuration (Optional)

For job queue functionality, use Upstash Redis:

1. Sign up at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the connection details
4. Add to Vercel environment variables:
   - `REDIS_HOST`
   - `REDIS_PORT`
   - `REDIS_PASSWORD`

## Environment Variables Quick Reference

### Backend Required
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Frontend Required
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## Monitoring and Logs

1. **Vercel Dashboard**: View deployment logs and runtime logs
2. **Analytics**: Enable Vercel Analytics in project settings
3. **Error Tracking**: Consider integrating Sentry or similar

## Updating Your Deployment

### Automatic Updates
Simply push to your GitHub repository:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically rebuild and deploy both projects.

### Manual Deployment
```bash
vercel --prod
```

## Cost Considerations

- **Vercel Free Tier**: Includes generous limits for hobby projects
- **Database**: Most providers offer free tiers (check limits)
- **Redis**: Upstash offers a free tier
- **Storage**: S3 or Vercel Blob for file uploads (separate costs)

## Security Best Practices

1. ✅ Use strong `JWT_SECRET`
2. ✅ Enable HTTPS (automatic on Vercel)
3. ✅ Set proper CORS origins
4. ✅ Use environment variables for all secrets
5. ✅ Enable Vercel's DDoS protection
6. ✅ Regularly update dependencies

## Next Steps

1. Set up monitoring and error tracking
2. Configure custom domains
3. Set up CI/CD testing before deployment
4. Enable Vercel Analytics
5. Configure backup strategies for your database

## Support

- Vercel Documentation: https://vercel.com/docs
- Prisma Documentation: https://www.prisma.io/docs
- GitHub Issues: Create issues in your repository

---

**Deployment Checklist:**

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Database migrations run
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] API connectivity tested
- [ ] Custom domains configured (optional)
- [ ] Monitoring enabled
