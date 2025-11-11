#!/bin/bash

echo "=========================================="
echo "🎬 AI Video Generator - Quick Setup"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and add your API keys:"
    echo "   - OPENAI_API_KEY (required for script analysis)"
    echo "   - STABILITY_AI_KEY (required for character/scene generation)"
    echo "   - ELEVENLABS_API_KEY (required for voice synthesis)"
    echo "   - REPLICATE_API_KEY (optional for advanced animation)"
    echo ""
    echo "Get your API keys from:"
    echo "   OpenAI: https://platform.openai.com/api-keys"
    echo "   Stability AI: https://platform.stability.ai/"
    echo "   ElevenLabs: https://elevenlabs.io/"
    echo "   Replicate: https://replicate.com/account/api-tokens"
    echo ""
    read -p "Press Enter after adding your API keys..."
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Check for MongoDB
echo "🗄️  Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install MongoDB:"
    echo "   macOS: brew install mongodb-community"
    echo "   Ubuntu: sudo apt install mongodb"
    echo "   Windows: Download from https://www.mongodb.com/try/download/community"
    echo ""
else
    echo "✅ MongoDB found"
fi

echo ""
echo "=========================================="
echo "✨ Setup Complete!"
echo "=========================================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:5173/auto-video"
echo ""
echo "📖 Documentation:"
echo "  - AI_VIDEO_GENERATION_GUIDE.md - Complete usage guide"
echo "  - IMPLEMENTATION_SUMMARY.md - Technical overview"
echo "  - README.md - Project overview"
echo ""
echo "🎬 Generate your first 40-minute video!"
echo "=========================================="
