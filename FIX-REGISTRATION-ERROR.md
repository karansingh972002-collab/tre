# 🔧 Fix: "An error occurred during registration"

## ❌ Problem
Getting error: **"An error occurred during registration"**

## 🎯 Root Cause
Your `DATABASE_URL` in `.env.local` is still using the placeholder value:
```
DATABASE_URL="postgresql://postgres:postgres@db.xxxx.supabase.co:5432/postgres"
                                              ^^^^
                                           PLACEHOLDER!
```

The backend can't connect to the database because this URL is not real.

---

## ✅ Solution: Choose ONE Option

### **Option 1: Use Supabase (Recommended - 5 minutes)**

#### Step 1: Create Supabase Account
1. Go to: https://supabase.com
2. Click "Start your project" (Free!)
3. Sign up with GitHub or Google

#### Step 2: Create New Project
1. Click "New Project"
2. **Project Name:** investpro
3. **Database Password:** Create a strong password (save it!)
4. **Region:** Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup

#### Step 3: Get Connection String
1. Once project is ready, go to **Settings** (left sidebar)
2. Click **Database**
3. Scroll to "Connection string"
4. Select **URI** tab
5. Copy the connection string
6. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghij.supabase.co:5432/postgres
   ```

#### Step 4: Update .env.local
1. Open `.env.local` file
2. Find line 9: `DATABASE_URL=...`
3. Replace with YOUR connection string:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
   ```
4. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with your actual password
5. Save the file

#### Step 5: Push Database Schema
```cmd
npx prisma db push
```

This creates all 17 tables in your Supabase database.

#### Step 6: Seed Database
```cmd
npm run db:seed
```

This adds test data and creates admin/user accounts.

#### Step 7: Restart Server
```cmd
npm run dev
```

#### Step 8: Test Registration
1. Go to: http://localhost:3000/auth/register
2. Fill the form
3. Click "Create Account"
4. ✅ Should work now!

---

### **Option 2: Use Local PostgreSQL (15 minutes)**

#### Step 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password for `postgres` user (remember it!)
4. Complete installation

#### Step 2: Create Database
```cmd
# Open Command Prompt
psql -U postgres

# In psql prompt:
CREATE DATABASE investpro;
\q
```

#### Step 3: Update .env.local
Open `.env.local` and update:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/investpro"
```
Replace `YOUR_PASSWORD` with your PostgreSQL password.

#### Step 4: Push Schema & Seed
```cmd
npx prisma db push
npm run db:seed
```

#### Step 5: Restart Server
```cmd
npm run dev
```

---

### **Option 3: Quick Test with SQLite (1 minute)**

For immediate testing only (not for production):

#### Step 1: Update schema.prisma
Open `prisma/schema.prisma` and change datasource:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

#### Step 2: Update .env.local
```env
DATABASE_URL="file:./dev.db"
```

#### Step 3: Push & Seed
```cmd
npx prisma db push
npm run db:seed
```

#### Step 4: Test
Registration should work now!

**Note:** SQLite is just for testing. Use PostgreSQL/Supabase for production.

---

## 🧪 Verify Database Connection

Run this command to test:
```cmd
npx prisma db push
```

**Success:** Should show "Your database is now in sync"
**Error:** Database connection failed - check DATABASE_URL

---

## 🔍 Check Server Logs

If still getting errors:

1. **Stop the server** (Ctrl+C in terminal)
2. **Start with logs:**
   ```cmd
   npm run dev
   ```
3. **Try registration again**
4. **Look for error messages** in the terminal
5. **Common errors:**
   - "Can't reach database server" → Wrong DATABASE_URL
   - "P1001" → Database not accessible
   - "P2002" → Duplicate email (expected if retrying)

---

## 📝 Complete Setup Checklist

- [ ] Database created (Supabase or local)
- [ ] DATABASE_URL updated in .env.local
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Ran `npm run db:seed`
- [ ] Server running with `npm run dev`
- [ ] Accessing http://localhost:3000 (not 8080)
- [ ] Browser console shows no errors

---

## 🎯 Quick Fix Commands

If you use Supabase, run these in order:

```cmd
# 1. Update .env.local with your Supabase URL first!

# 2. Generate Prisma Client
npx prisma generate

# 3. Create tables
npx prisma db push

# 4. Add test data
npm run db:seed

# 5. Restart server
npm run dev
```

Then test: http://localhost:3000/auth/register

---

## ✅ How to Know It's Fixed

When database is connected correctly:

1. **Registration page loads** without console errors
2. **Filling form and clicking "Create Account":**
   - Shows success toast
   - Redirects to dashboard
   - You see your name in header
   - Wallet balance shows ₹0
   - Welcome notification appears

3. **Check terminal/console:**
   - No database connection errors
   - No Prisma errors
   - Shows successful API calls

---

## 🆘 Still Not Working?

### Check 1: Are you on the right URL?
- ✅ Use: http://localhost:3000
- ❌ Not: http://localhost:8080 (preview only)

### Check 2: Is DATABASE_URL correct?
```cmd
# Check your current value:
type .env.local | findstr DATABASE_URL
```

Should be a REAL database URL, not containing:
- `db.xxxx.supabase.co` ← This is placeholder!
- `your-password` ← Replace with real password!

### Check 3: Is server running?
```cmd
# Should see something like:
# ▲ Next.js 15.0.3
# - Local: http://localhost:3000
```

### Check 4: Check browser console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try registration
4. Look for red error messages
5. Share the error for more help

---

## 📞 Need More Help?

Run this diagnostic:
```cmd
CHECK-SETUP.bat
```

This will tell you exactly what's missing.

---

## 🎉 Expected Result After Fix

```
✅ Form filled
✅ Clicked "Create Account"
✅ Shows: "Registration successful! Welcome to InvestPro!"
✅ Redirects to: http://localhost:3000/dashboard
✅ You're logged in!
✅ Wallet: ₹0.00
✅ Referral Code: ABC12XYZ (unique)
✅ Welcome notification visible
```

---

**Fix your DATABASE_URL and registration will work!** 🚀
