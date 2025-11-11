@echo off
echo ==========================================
echo 🎬 AI Video Generator - Quick Setup
echo ==========================================
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo 📝 Creating backend\.env file...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env and add your API keys:
    echo    - OPENAI_API_KEY (required for script analysis)
    echo    - STABILITY_AI_KEY (required for character/scene generation)
    echo    - ELEVENLABS_API_KEY (required for voice synthesis)
    echo    - REPLICATE_API_KEY (optional for advanced animation)
    echo.
    echo Get your API keys from:
    echo    OpenAI: https://platform.openai.com/api-keys
    echo    Stability AI: https://platform.stability.ai/
    echo    ElevenLabs: https://elevenlabs.io/
    echo    Replicate: https://replicate.com/account/api-tokens
    echo.
    pause
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed
echo.

REM Check for MongoDB
echo 🗄️  Checking MongoDB...
where mongod >nul 2>nul
if errorlevel 1 (
    echo ⚠️  MongoDB not found. Please install MongoDB:
    echo    Download from: https://www.mongodb.com/try/download/community
    echo.
) else (
    echo ✅ MongoDB found
)

echo.
echo ==========================================
echo ✨ Setup Complete!
echo ==========================================
echo.
echo 🚀 To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:5173/auto-video
echo.
echo 📖 Documentation:
echo   - AI_VIDEO_GENERATION_GUIDE.md - Complete usage guide
echo   - IMPLEMENTATION_SUMMARY.md - Technical overview
echo   - README.md - Project overview
echo.
echo 🎬 Generate your first 40-minute video!
echo ==========================================
pause
