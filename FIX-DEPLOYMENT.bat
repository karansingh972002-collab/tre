@echo off
echo ===============================================
echo    Fix Vercel Deployment Error
echo ===============================================
echo.
echo This will add prisma files to Git and push them.
echo.
pause

echo.
echo [1/4] Checking Git status...
git status

echo.
echo [2/4] Adding prisma folder to Git...
git add prisma/
git add vercel.json

echo.
echo [3/4] Committing changes...
git commit -m "Fix deployment: Add prisma schema and config"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ===============================================
echo    Files Pushed Successfully!
echo ===============================================
echo.
echo NEXT STEPS:
echo.
echo 1. Go to Vercel Dashboard
echo 2. Settings -^> Environment Variables
echo 3. Add DATABASE_URL with your Supabase URL
echo 4. Redeploy
echo.
echo Need Supabase URL?
echo → https://supabase.com
echo → Create project
echo → Settings -^> Database -^> Copy connection string
echo.
echo See DEPLOY-TO-VERCEL.md for detailed guide
echo.
pause
