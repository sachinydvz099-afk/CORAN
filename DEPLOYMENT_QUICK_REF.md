# Vercel Deployment Quick Reference

## 🎯 Quick Start

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy Backend
- **URL**: https://vercel.com/new
- **Root Directory**: `backend`
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`

**Environment Variables (Backend):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### 3. Deploy Frontend
- **URL**: https://vercel.com/new
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables (Frontend):**
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## 📦 Database Providers

| Provider | Free Tier | URL |
|----------|-----------|-----|
| Vercel Postgres | ✅ | https://vercel.com/storage/postgres |
| Supabase | ✅ 500MB | https://supabase.com |
| Neon | ✅ 3GB | https://neon.tech |
| Railway | ✅ Limited | https://railway.app |

## 🔧 Post-Deployment

### Run Migrations
```bash
npm i -g vercel
cd backend
vercel link
vercel env pull .env.production
npx prisma migrate deploy
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs, verify dependencies |
| DB connection error | Verify DATABASE_URL, check SSL requirements |
| API not connecting | Check VITE_API_URL, verify CORS settings |
| Prisma errors | Ensure @prisma/client is in dependencies |

## 🌐 Project URLs

After deployment, you'll have:
- **Backend**: `https://[project-name].vercel.app`
- **Frontend**: `https://[project-name].vercel.app`

## ⚡ Auto-Deploy

Vercel automatically deploys when you:
- Push to `main` branch → Production
- Create Pull Request → Preview deployment

## 📊 Project Structure

```
your-repo/
├── backend/           ← Deploy as separate Vercel project
│   ├── vercel.json
│   └── package.json
└── frontend/          ← Deploy as separate Vercel project
    ├── vercel.json
    └── package.json
```

## 🔐 Security Checklist

- ✅ Strong JWT_SECRET (32+ characters)
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ Environment variables for all secrets
- ✅ Proper CORS configuration
- ✅ Database SSL enabled

## 💡 Tips

1. **Test locally first**: Ensure everything works before deploying
2. **Use preview deployments**: Test changes in PR preview before merging
3. **Monitor logs**: Check Vercel dashboard for errors
4. **Set up domains**: Use custom domains for production
5. **Enable analytics**: Track usage with Vercel Analytics

## 📞 Support Resources

- 📖 Full Guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- 🌐 Vercel Docs: https://vercel.com/docs
- 💬 Vercel Discord: https://vercel.com/discord
- 📚 Prisma Docs: https://www.prisma.io/docs
