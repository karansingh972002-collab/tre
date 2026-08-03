@echo off
echo ===============================================
echo    Use Local PostgreSQL Database
echo ===============================================
echo.
echo REQUIREMENTS:
echo - PostgreSQL must be installed
echo - PostgreSQL service must be running
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Creating local database...
psql -U postgres -c "CREATE DATABASE investment_db;" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Could not create database.
    echo This might be OK if database already exists.
    echo.
)

echo Updating .env.local to use local database...
powershell -Command "(Get-Content .env.local) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/investment_db\"' | Set-Content .env.local"

echo.
echo ===============================================
echo Setting up database tables...
echo ===============================================
npx prisma db push

echo.
echo ===============================================
echo Adding test data...
echo ===============================================
npm run db:seed

echo.
echo ===============================================
echo    SUCCESS! Local database is ready!
echo ===============================================
echo.
echo Database: investment_db
echo User: postgres
echo Password: postgres
echo.
echo Now restart your server:
echo   npm run dev
echo.
pause
