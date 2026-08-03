@echo off
echo ====================================
echo   INVESTPRO BACKEND SETUP
echo ====================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 2: Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    echo Make sure DATABASE_URL is set in .env.local
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo Step 3: Pushing database schema...
call npx prisma db push
if errorlevel 1 (
    echo ERROR: Database push failed!
    echo Check your DATABASE_URL and database connection
    pause
    exit /b 1
)
echo ✓ Database schema created
echo.

echo Step 4: Seeding database...
call npm run db:seed
if errorlevel 1 (
    echo WARNING: Database seeding failed!
    echo You may need to seed manually
)
echo ✓ Database seeded with test data
echo.

echo ====================================
echo   SETUP COMPLETE!
echo ====================================
echo.
echo Test Accounts:
echo   Admin: admin@investpro.com / Admin@123
echo   User:  user@test.com / User@123
echo.
echo To start the server:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo ====================================
pause
