@echo off
echo ===============================================
echo    DATABASE SETUP - Quick Fix
echo ===============================================
echo.
echo The registration error happens because DATABASE_URL
echo in .env.local is still a PLACEHOLDER (db.xxxx)
echo.
echo You have 2 options:
echo.
echo ===============================================
echo OPTION 1: Use Supabase (RECOMMENDED - Free)
echo ===============================================
echo.
echo 1. Go to: https://supabase.com
echo 2. Sign up (free account)
echo 3. Create new project (takes 2 minutes)
echo 4. Go to: Settings -^> Database
echo 5. Copy "Connection string" (URI format)
echo 6. Come back here
echo.
echo Press any key when you have your Supabase URL...
pause >nul
echo.
echo Enter your Supabase DATABASE_URL:
echo (Example: postgresql://postgres:YOUR_PASSWORD@db.abc123.supabase.co:5432/postgres)
echo.
set /p DB_URL="DATABASE_URL: "
echo.

if "%DB_URL%"=="" (
    echo ERROR: No URL entered!
    pause
    exit /b 1
)

echo Updating .env.local...
powershell -Command "(Get-Content .env.local) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"%DB_URL%\"' | Set-Content .env.local"

echo.
echo ===============================================
echo Setting up database tables...
echo ===============================================
npx prisma db push

echo.
echo ===============================================
echo Adding test data (users, plans, etc.)...
echo ===============================================
npm run db:seed

echo.
echo ===============================================
echo    SUCCESS! Database is ready!
echo ===============================================
echo.
echo Now you can:
echo 1. Register new account at: http://localhost:3001/auth/register
echo 2. Or login with test account:
echo    Email: user@test.com
echo    Password: User@123
echo.
echo Press any key to restart the server...
pause >nul

echo.
echo Restarting server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul
start cmd /k npm run dev

echo.
echo Server restarting...
echo Visit: http://localhost:3000
echo.
pause
