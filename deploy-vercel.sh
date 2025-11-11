#!/bin/bash

echo "🚀 AI-Studio Vercel Deployment Setup"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo ""
echo "1. Backend Setup:"
echo "   - [ ] Create PostgreSQL database (Vercel Postgres, Supabase, or Neon)"
echo "   - [ ] Generate JWT secret: openssl rand -base64 32"
echo "   - [ ] Optional: Set up Redis (Upstash)"
echo ""
echo "2. GitHub Setup:"
echo "   - [ ] Create GitHub repository"
echo "   - [ ] Push code to GitHub:"
echo "         git add ."
echo "         git commit -m 'Initial commit'"
echo "         git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "         git push -u origin main"
echo ""
echo "3. Vercel Backend Deployment:"
echo "   - [ ] Import project from GitHub"
echo "   - [ ] Root Directory: backend"
echo "   - [ ] Build Command: npm run vercel-build"
echo "   - [ ] Output Directory: dist"
echo "   - [ ] Add environment variables (DATABASE_URL, JWT_SECRET, etc.)"
echo ""
echo "4. Vercel Frontend Deployment:"
echo "   - [ ] Import same GitHub repository"
echo "   - [ ] Root Directory: frontend"
echo "   - [ ] Build Command: npm run build"
echo "   - [ ] Output Directory: dist"
echo "   - [ ] Add VITE_API_URL environment variable"
echo ""
echo "5. Post-Deployment:"
echo "   - [ ] Run database migrations"
echo "   - [ ] Test API connectivity"
echo "   - [ ] Configure custom domains (optional)"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"
echo ""

read -p "Have you pushed your code to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "✅ Great! Proceed with Vercel deployment."
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/new"
    echo "2. Import your GitHub repository"
    echo "3. Deploy backend first (root: backend)"
    echo "4. Then deploy frontend (root: frontend)"
else
    echo "⚠️  Please push your code to GitHub first."
    echo ""
    echo "Commands to run:"
    echo "  git add ."
    echo "  git commit -m 'Prepare for Vercel deployment'"
    echo "  git remote add origin YOUR_GITHUB_REPO_URL"
    echo "  git push -u origin main"
fi

echo ""
echo "Done! 🎉"
