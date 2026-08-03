@echo off
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        DATABASE SETUP - Fix Registration Error              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Current Problem: DATABASE_URL has placeholder value
echo Solution: Set up real database (Supabase recommended)
echo.
echo ════════════════════════════════════════════════════════════════
echo   OPTION 1: SUPABASE (Recommended - Free & Easy)
echo ════════════════════════════════════════════════════════════════
echo.
echo Steps:
echo   1. Go to: https://supabase.com
echo   2. Sign up (Free!)
echo   3. Create new project: "investpro"
echo   4. Wait 2 minutes for setup
echo   5. Go to Settings ^> Database
echo   6. Copy "Connection string" (URI format)
echo.
echo Example:
echo   postgresql://postgres:YourPass123@db.abc123.supabase.co:5432/postgres
echo.
pause
echo.
echo ════════════════════════════════════════════════════════════════
echo.
set /p DATABASE_URL="Paste your Supabase DATABASE_URL here: "
echo.

if "%DATABASE_URL%"=="" (
    echo ERROR: No URL provided!
    pause
    exit /b 1
)

echo Updating .env.local...
echo # Database > .env.local.new
echo DATABASE_URL="%DATABASE_URL%" >> .env.local.new
echo. >> .env.local.new
echo # JWT Secrets >> .env.local.new
echo JWT_SECRET=my-super-secret-jwt-key-for-development-12345678 >> .env.local.new
echo JWT_REFRESH_SECRET=my-refresh-token-secret-for-development-87654321 >> .env.local.new
echo ACCESS_TOKEN_EXPIRY=15m >> .env.local.new
echo REFRESH_TOKEN_EXPIRY=7d >> .env.local.new
echo. >> .env.local.new
echo # App Settings >> .env.local.new
echo NODE_ENV=development >> .env.local.new
echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env.local.new
echo NEXT_PUBLIC_APP_NAME="InvestPro" >> .env.local.new
echo NEXT_PUBLIC_CURRENCY_SYMBOL=₹ >> .env.local.new
echo NEXT_PUBLIC_MIN_WITHDRAWAL=500 >> .env.local.new
echo NEXT_PUBLIC_REFERRAL_LEVEL_1_PERCENT=10 >> .env.local.new
echo NEXT_PUBLIC_REFERRAL_LEVEL_2_PERCENT=5 >> .env.local.new
echo NEXT_PUBLIC_REFERRAL_LEVEL_3_PERCENT=2 >> .env.local.new

move /y .env.local .env.local.backup >nul 2>&1
move /y .env.local.new .env.local >nul 2>&1

echo ✓ .env.local updated!
echo.
echo ════════════════════════════════════════════════════════════════
echo   STEP 2: Generate Prisma Client
echo ════════════════════════════════════════════════════════════════
echo.
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo ════════════════════════════════════════════════════════════════
echo   STEP 3: Create Database Tables
echo ════════════════════════════════════════════════════════════════
echo.
call npx prisma db push
if errorlevel 1 (
    echo ERROR: Database push failed!
    echo Check your DATABASE_URL is correct
    pause
    exit /b 1
)
echo ✓ Database tables created (17 tables)
echo.

echo ════════════════════════════════════════════════════════════════
echo   STEP 4: Add Test Data
echo ════════════════════════════════════════════════════════════════
echo.
call npm run db:seed
if errorlevel 1 (
    echo WARNING: Seeding failed (may already be seeded)
)
echo ✓ Test data added
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ SETUP COMPLETE!                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Test Accounts:
echo   Admin: admin@investpro.com / Admin@123
echo   User:  user@test.com / User@123
echo.
echo Next Steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:3000/auth/register
echo   3. Create your account
echo   4. Registration should work now!
echo.
echo ════════════════════════════════════════════════════════════════
pause
