@echo off
echo ===============================================
echo    Fixing Next.js Chunk Load Error
echo ===============================================
echo.

echo [1/5] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/5] Clearing Next.js build cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/5] Clearing npm cache...
npm cache clean --force

echo [4/5] Reinstalling dependencies...
npm install

echo [5/5] Starting development server...
echo.
echo ===============================================
echo    Server will start on http://localhost:3000
echo ===============================================
echo.
npm run dev
