Write-Host "🚀 AI-Studio Vercel Deployment Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-Not (Test-Path .git)) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Pre-deployment Checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Backend Setup:" -ForegroundColor Yellow
Write-Host "   - [ ] Create PostgreSQL database (Vercel Postgres, Supabase, or Neon)"
Write-Host "   - [ ] Generate JWT secret: openssl rand -base64 32"
Write-Host "   - [ ] Optional: Set up Redis (Upstash)"
Write-Host ""
Write-Host "2. GitHub Setup:" -ForegroundColor Yellow
Write-Host "   - [ ] Create GitHub repository"
Write-Host "   - [ ] Push code to GitHub:"
Write-Host "         git add ."
Write-Host "         git commit -m 'Initial commit'"
Write-Host "         git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
Write-Host "         git push -u origin main"
Write-Host ""
Write-Host "3. Vercel Backend Deployment:" -ForegroundColor Yellow
Write-Host "   - [ ] Import project from GitHub"
Write-Host "   - [ ] Root Directory: backend"
Write-Host "   - [ ] Build Command: npm run vercel-build"
Write-Host "   - [ ] Output Directory: dist"
Write-Host "   - [ ] Add environment variables (DATABASE_URL, JWT_SECRET, etc.)"
Write-Host ""
Write-Host "4. Vercel Frontend Deployment:" -ForegroundColor Yellow
Write-Host "   - [ ] Import same GitHub repository"
Write-Host "   - [ ] Root Directory: frontend"
Write-Host "   - [ ] Build Command: npm run build"
Write-Host "   - [ ] Output Directory: dist"
Write-Host "   - [ ] Add VITE_API_URL environment variable"
Write-Host ""
Write-Host "5. Post-Deployment:" -ForegroundColor Yellow
Write-Host "   - [ ] Run database migrations"
Write-Host "   - [ ] Test API connectivity"
Write-Host "   - [ ] Configure custom domains (optional)"
Write-Host ""
Write-Host "📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Have you pushed your code to GitHub? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "✅ Great! Proceed with Vercel deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com/new"
    Write-Host "2. Import your GitHub repository"
    Write-Host "3. Deploy backend first (root: backend)"
    Write-Host "4. Then deploy frontend (root: frontend)"
} else {
    Write-Host "⚠️  Please push your code to GitHub first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands to run:" -ForegroundColor Cyan
    Write-Host "  git add ."
    Write-Host "  git commit -m 'Prepare for Vercel deployment'"
    Write-Host "  git remote add origin YOUR_GITHUB_REPO_URL"
    Write-Host "  git push -u origin main"
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
