# Vercel Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment Setup

### Database Setup
- [ ] Choose database provider (Vercel Postgres, Supabase, or Neon)
- [ ] Create PostgreSQL database
- [ ] Copy `DATABASE_URL` connection string
- [ ] Test database connection locally (optional)

### Redis Setup (Optional)
- [ ] Sign up for Upstash Redis (https://upstash.com)
- [ ] Create Redis database
- [ ] Copy Redis credentials (host, port, password)

### Security
- [ ] Generate strong JWT secret
  ```bash
  openssl rand -base64 32
  ```
- [ ] Store all secrets securely (use password manager)

## GitHub Repository

- [ ] Code committed to Git
- [ ] GitHub repository created
- [ ] Local repository linked to GitHub remote
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  ```
- [ ] Code pushed to GitHub
  ```bash
  git push -u origin main
  ```

## Backend Deployment

### Vercel Project Setup
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Configure project settings:
  - [ ] Project Name: `ai-studio-backend` (or your choice)
  - [ ] Framework Preset: Other
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm run vercel-build`
  - [ ] Output Directory: `dist`

### Backend Environment Variables
Add these in Vercel project settings:

**Required:**
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Generated secret (32+ characters)
- [ ] `NODE_ENV` - Set to `production`

**Optional (add as needed):**
- [ ] `REDIS_HOST` - Redis hostname
- [ ] `REDIS_PORT` - Redis port (6379)
- [ ] `REDIS_PASSWORD` - Redis password
- [ ] `AWS_REGION` - AWS region (e.g., us-east-1)
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key
- [ ] `S3_BUCKET_NAME` - S3 bucket name
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `AI_CHARACTER_SERVICE_URL` - AI service URL
- [ ] `AI_SCENE_SERVICE_URL` - AI service URL
- [ ] `AI_VOICE_SERVICE_URL` - AI service URL
- [ ] `AI_RENDER_SERVICE_URL` - AI service URL

### Backend Deployment
- [ ] Click "Deploy" button
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Copy deployed backend URL
- [ ] Test health endpoint: `https://your-backend.vercel.app/health`

### Database Migrations
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Navigate to backend directory: `cd backend`
- [ ] Link to Vercel project: `vercel link`
- [ ] Pull environment variables: `vercel env pull .env.production`
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify migrations completed successfully

## Frontend Deployment

### Vercel Project Setup
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select your GitHub repository (same one)
- [ ] Configure project settings:
  - [ ] Project Name: `ai-studio-frontend` (or your choice)
  - [ ] Framework Preset: Vite
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`

### Frontend Environment Variables
- [ ] Add `VITE_API_URL` - Your backend URL with `/api` (e.g., `https://ai-studio-backend.vercel.app/api`)

### Frontend Deployment
- [ ] Click "Deploy" button
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Copy deployed frontend URL
- [ ] Visit frontend URL in browser

### Update API Proxy (Optional)
If using API proxy through frontend:
- [ ] Update `frontend/vercel.json` with actual backend URL
- [ ] Commit and push changes
- [ ] Wait for automatic redeployment

## Testing

### Backend Testing
- [ ] Health check works: `/health`
- [ ] Registration endpoint works: `POST /api/register`
- [ ] Login endpoint works: `POST /api/login`
- [ ] Protected endpoints require auth
- [ ] Database queries work correctly

### Frontend Testing
- [ ] Frontend loads successfully
- [ ] Registration page works
- [ ] Login page works
- [ ] Dashboard loads after login
- [ ] API calls to backend successful
- [ ] No CORS errors in console

### Integration Testing
- [ ] User can register
- [ ] User can login
- [ ] User can create project
- [ ] User can view projects
- [ ] All features work end-to-end

## Post-Deployment

### Configuration
- [ ] Update CORS origins in backend if needed
- [ ] Configure custom domains (if applicable)
- [ ] Set up domain DNS records (if applicable)
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error tracking (Sentry, etc.) (optional)

### Monitoring
- [ ] Check Vercel dashboard for logs
- [ ] Monitor function execution times
- [ ] Check database connection pool usage
- [ ] Monitor error rates

### Documentation
- [ ] Update README with live URLs
- [ ] Document any custom configuration
- [ ] Share deployment URLs with team

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS properly configured
- [ ] JWT secret is strong and unique
- [ ] Database connection uses SSL
- [ ] API rate limiting configured (if needed)

## Optional Enhancements

- [ ] Set up preview deployments for PRs
- [ ] Configure branch deployments
- [ ] Enable Vercel Speed Insights
- [ ] Set up deployment notifications (Slack, Discord)
- [ ] Configure custom 404/error pages
- [ ] Set up database backups
- [ ] Configure CDN for static assets

## Troubleshooting

If something goes wrong, check:

- [ ] Build logs in Vercel dashboard
- [ ] Runtime logs in Vercel dashboard
- [ ] Environment variables are set correctly
- [ ] Database connection string is correct
- [ ] Network requests in browser DevTools
- [ ] `VERCEL_DEPLOYMENT_GUIDE.md` troubleshooting section

## Resources

- [ ] Bookmark Vercel Dashboard
- [ ] Join Vercel Discord for support
- [ ] Save database credentials securely
- [ ] Document custom configuration

---

## Deployment Status

- **Backend URL**: ________________________________
- **Frontend URL**: ________________________________
- **Database Provider**: ________________________________
- **Redis Provider**: ________________________________
- **Deployment Date**: ________________________________

## Notes

Add any notes or custom configuration here:

________________________________
________________________________
________________________________
________________________________
