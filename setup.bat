@echo off
echo ========================================
echo AI-Studio Platform - Quick Start
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo [2/5] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 goto error

echo.
echo [3/5] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 goto error
cd ..

echo.
echo [4/5] Generating Prisma Client...
cd backend
call npx prisma generate
if errorlevel 1 goto error

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Setup PostgreSQL database (see SETUP.md)
echo 2. Configure backend\.env file
echo 3. Run database migrations:
echo    cd backend
echo    npx prisma migrate dev
echo    npm run db:seed
echo 4. Start development servers:
echo    npm run dev
echo.
echo For detailed instructions, see SETUP.md
echo ========================================
goto end

:error
echo.
echo ERROR: Installation failed!
echo Please check the error messages above and try again.
pause
exit /b 1

:end
pause
