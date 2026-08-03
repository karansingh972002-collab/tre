# 🚀 Deploy to Vercel - Complete Guide

## ❌ Current Error

```
Error: Could not find Prisma Schema
prisma/schema.prisma: file not found
```

**Cause:** The `prisma` folder wasn't committed to Git.

---

## ✅ Fix & Deploy Steps

### Step 1: Add Prisma Files to Git

```bash
# Check what files are tracked
git status

# Add prisma folder
git add prisma/

# Commit
git commit -m "Add prisma schema for deployment"

# Push to GitHub
git push origin main
```

### Step 2: Setup Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

**Required:**
```
DATABASE_URL = your_database_connection_string
```

**All Environment Variables:**
```
DATABASE_URL = postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
JWT_SECRET = your-secret-key-here-use-strong-random-string
JWT_REFRESH_SECRET = your-refresh-secret-key-here-different-from-above
NODE_ENV = production
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME = Premium Investment Platform
```

**Optional (same as .env.local):**
```
ACCESS_TOKEN_EXPIRY = 15m
REFRESH_TOKEN_EXPIRY = 7d
NEXT_PUBLIC_CURRENCY_SYMBOL = ₹
NEXT_PUBLIC_CURRENCY_CODE = INR
NEXT_PUBLIC_MIN_WITHDRAWAL = 100
NEXT_PUBLIC_MAX_WITHDRAWAL = 100000
NEXT_PUBLIC_ENABLE_DARK_MODE = true
NEXT_PUBLIC_ENABLE_PWA = true
```

### Step 3: Setup Database (Supabase Recommended)

**Get Production Database:**

1. Go to https://supabase.com
2. Create new project (or use existing)
3. Get connection string:
   - Settings → Database
   - Copy "Connection string" (URI format)
4. Add to Vercel environment variables

**Important:** Use a **production database**, not your local one!

### Step 4: Redeploy

After adding environment variables:

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click **Redeploy** on latest deployment
4. Or push a new commit to trigger deployment

---

## 📝 Vercel Configuration

I've created `vercel.json` with optimal settings:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

This ensures Prisma Client is generated during build.

---

## 🔧 Alternative: Manual Build Override

If you need to override build settings in Vercel:

1. **Project Settings** → **Build & Development Settings**
2. **Build Command:**
   ```bash
   npx prisma generate && npm run build
   ```
3. **Install Command:**
   ```bash
   npm install
   ```

---

## 🗄️ Database Setup on Deployment

### Option 1: Prisma Migrate (Recommended)

```bash
# After deployment, run migrations
npx prisma migrate deploy
```

### Option 2: Push Schema

```bash
# Push schema to production database
npx prisma db push
```

### Option 3: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
```

---

## ⚠️ Important Security Notes

### DO NOT commit these files:
- ❌ `.env.local` (contains secrets)
- ❌ `.env` (contains secrets)
- ❌ `firebase-admin-sdk.json` (if using)

### DO commit these files:
- ✅ `prisma/schema.prisma`
- ✅ `prisma/seed.ts`
- ✅ `vercel.json`
- ✅ All source code files

---

## 🧪 Test Deployment

After successful deployment:

1. **Visit your app:**
   ```
   https://your-app.vercel.app
   ```

2. **Check homepage loads**

3. **Check plans page:**
   ```
   https://your-app.vercel.app/dashboard/plans
   ```

4. **Check API:**
   ```
   https://your-app.vercel.app/api/plans
   ```

---

## 🔍 Troubleshooting

### Error: "Could not find Prisma Schema"

**Solution:**
```bash
# Ensure prisma folder is committed
git add prisma/
git commit -m "Add prisma schema"
git push
```

### Error: "Can't reach database server"

**Solution:**
- Check DATABASE_URL in Vercel environment variables
- Ensure database URL is accessible from internet
- Supabase databases are public by default

### Error: "Invalid `prisma.plan.findMany()`"

**Solution:**
- Database tables don't exist
- Run: `npx prisma db push` in production
- Or use migrations: `npx prisma migrate deploy`

### Error: "Module not found"

**Solution:**
- Check all dependencies are in `package.json`
- Clear Vercel build cache and redeploy

---

## 📋 Pre-Deployment Checklist

```
□ prisma/schema.prisma committed to Git
□ prisma/seed.ts committed to Git
□ vercel.json created and committed
□ DATABASE_URL added to Vercel env vars
□ JWT_SECRET added to Vercel env vars
□ JWT_REFRESH_SECRET added to Vercel env vars
□ Production database created (Supabase)
□ Database is accessible from internet
□ All sensitive files in .gitignore
□ Latest code pushed to GitHub
□ Vercel project connected to GitHub repo
```

---

## 🎯 Quick Fix Commands

```bash
# 1. Add and commit prisma files
git add prisma/
git add vercel.json
git commit -m "Fix: Add prisma schema for deployment"
git push origin main

# 2. Setup production database
# Get Supabase URL and add to Vercel

# 3. After deployment, setup tables
npx prisma db push
npm run db:seed
```

---

## 🌐 Environment Variables Template

Copy this to Vercel environment variables:

```env
# Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# JWT Secrets (generate strong random strings)
JWT_SECRET=super-secret-key-production-change-this-12345678
JWT_REFRESH_SECRET=refresh-secret-key-production-change-this-87654321

# App Config
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Premium Investment Platform

# Token Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# App Settings
NEXT_PUBLIC_CURRENCY_SYMBOL=₹
NEXT_PUBLIC_CURRENCY_CODE=INR
NEXT_PUBLIC_MIN_WITHDRAWAL=100
NEXT_PUBLIC_MAX_WITHDRAWAL=100000

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_REFERRALS=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

---

## 🚀 Deploy Now!

**Quick Steps:**

1. Commit prisma files:
   ```bash
   git add prisma/ vercel.json
   git commit -m "Add prisma for deployment"
   git push
   ```

2. Add DATABASE_URL to Vercel

3. Redeploy in Vercel dashboard

4. Done! ✅

---

## 📞 Need Help?

**Common Issues:**
- Prisma error → Check files committed
- Database error → Check DATABASE_URL
- Build error → Check environment variables
- 500 error → Check Vercel logs

**Vercel Logs:**
- Dashboard → Deployments → Click deployment → View logs

---

## ✅ Success Checklist

After deployment succeeds:

```
✓ Build completes without errors
✓ Homepage loads: https://your-app.vercel.app
✓ Plans page works: /dashboard/plans
✓ API returns data: /api/plans
✓ Database connected
✓ All pages accessible
```

---

**Ready to deploy? Follow Step 1 above! 🚀**
