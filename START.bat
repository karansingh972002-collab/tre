@echo off
echo ====================================
echo Premium Investment Platform Setup
echo ====================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [1/5] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
    echo.
) else (
    echo [1/5] Dependencies already installed
    echo.
)

:: Check if .env.local exists
if not exist ".env.local" (
    echo [2/5] Creating .env.local file...
    copy .env.local.example .env.local
    echo ✓ Environment file created
    echo.
    echo IMPORTANT: Edit .env.local with your database credentials
    echo Press any key to continue...
    pause >nul
) else (
    echo [2/5] Environment file exists
    echo.
)

:: Generate Prisma Client
echo [3/5] Generating Prisma Client...
call npm run db:generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

:: Ask about database setup
echo [4/5] Database Setup
echo.
set /p SETUP_DB="Do you want to setup the database now? (y/n): "
if /i "%SETUP_DB%"=="y" (
    echo Running database migrations...
    call npx prisma db push
    if errorlevel 1 (
        echo.
        echo ERROR: Database migration failed
        echo Make sure your database is running and .env.local is configured correctly
        echo.
        pause
        exit /b 1
    )
    echo ✓ Database migrated
    echo.
    
    echo Seeding database with test data...
    call npm run db:seed
    if errorlevel 1 (
        echo WARNING: Database seeding failed, but you can continue
    ) else (
        echo ✓ Database seeded
    )
    echo.
)

:: Start dev server
echo [5/5] Starting development server...
echo.
echo ====================================
echo Server will start at: http://localhost:3000
echo ====================================
echo.
echo Default Login Credentials:
echo - Admin: admin@investpro.com / Admin@123
echo - User:  user@test.com / User@123
echo.
echo Press Ctrl+C to stop the server
echo ====================================
echo.

call npm run dev
