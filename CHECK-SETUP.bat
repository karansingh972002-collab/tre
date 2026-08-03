@echo off
echo ====================================
echo   CHECKING INVESTPRO SETUP STATUS
echo ====================================
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found!
    goto :end
)
echo ✓ Node.js installed
echo.

echo Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found!
    goto :end
)
echo ✓ npm installed
echo.

echo Checking if node_modules exists...
if exist "node_modules\" (
    echo ✓ node_modules found
) else (
    echo ✗ node_modules NOT found
    echo   Run: npm install
)
echo.

echo Checking Prisma Client...
if exist "node_modules\.prisma\client\" (
    echo ✓ Prisma Client generated
) else (
    echo ✗ Prisma Client NOT generated
    echo   Run: npx prisma generate
)
echo.

echo Checking .env.local...
if exist ".env.local" (
    echo ✓ .env.local exists
    echo.
    echo Checking DATABASE_URL...
    findstr "DATABASE_URL" .env.local > nul
    if errorlevel 1 (
        echo ✗ DATABASE_URL not found in .env.local
    ) else (
        echo ✓ DATABASE_URL configured
    )
) else (
    echo ✗ .env.local NOT found
    echo   Copy .env.local.example to .env.local
)
echo.

echo Checking package.json...
if exist "package.json" (
    echo ✓ package.json exists
) else (
    echo ✗ package.json NOT found
)
echo.

echo ====================================
echo   DIAGNOSIS COMPLETE
echo ====================================
echo.
echo Next Steps:
echo   1. If node_modules missing: npm install
echo   2. If Prisma not generated: npx prisma generate
echo   3. If DATABASE_URL missing: Setup database
echo   4. Run: npm run dev
echo   5. Test: http://localhost:3000
echo ====================================

:end
pause
