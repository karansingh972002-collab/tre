# 🚀 Installation Guide - Step by Step

## ⚠️ Getting "Connection Refused" Error?

This means the server isn't running yet. Follow these steps:

---

## Step 1: Install Dependencies (5-10 minutes)

Open your terminal in this project folder and run:

```bash
npm install
```

**This will take 5-10 minutes.** Wait for it to complete.

---

## Step 2: Create Environment File

```bash
# Windows Command Prompt
copy .env.local.example .env.local

# Windows PowerShell
Copy-Item .env.local.example .env.local
```

---

## Step 3: Edit .env.local File

Open `.env.local` in a text editor and update:

### Option A: Without Database (Quick Test)
Skip database for now, just set:
```env
JWT_SECRET=my-secret-key-123456789
JWT_REFRESH_SECRET=my-refresh-secret-123456789
```

### Option B: With Supabase (Recommended - Free)
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Copy the connection string
5. In `.env.local`, set:
```env
DATABASE_URL="your-supabase-connection-string-here"
```

---

## Step 4: Generate Prisma Client

```bash
npm run db:generate
```

---

## Step 5: Setup Database (If using Supabase)

```bash
npx prisma db push
npm run db:seed
```

---

## Step 6: Start the Server

```bash
npm run dev
```

**Wait for:**
```
✓ Ready in 3.5s
○ Compiling / ...
✓ Compiled / in 2.3s
```

---

## Step 7: Open Browser

Go to: **http://localhost:3000**

---

## 🔐 Login Credentials (After Seeding)

**User Account:**
- Email: user@test.com  
- Password: User@123

**Admin Account:**
- Email: admin@investpro.com
- Password: Admin@123

---

## ❌ Still Not Working?

### Check if npm install completed:
```bash
dir node_modules
```
Should show many folders. If empty, npm install didn't finish.

### Check if server is running:
After `npm run dev`, you should see:
```
- Local: http://localhost:3000
```

### Try different port:
```bash
set PORT=3001
npm run dev
```
Then visit: http://localhost:3001

### Check Node version:
```bash
node --version
```
Should be v18 or higher.

---

## 📝 Installation Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created
- [ ] JWT secrets set in `.env.local`
- [ ] Prisma client generated
- [ ] Database setup (optional for first run)
- [ ] Server started with `npm run dev`
- [ ] Browser opens http://localhost:3000

---

## 🆘 Need Help?

**Common Issues:**

1. **"npm" not recognized**
   - Install Node.js from https://nodejs.org

2. **Port 3000 busy**
   - Use: `set PORT=3001 && npm run dev`

3. **Prisma errors**
   - Run: `npm run db:generate`

4. **Database errors**
   - Skip database for now, authentication will work without it

5. **Installation stuck**
   - Press Ctrl+C and retry
   - Or use: `npm install --legacy-peer-deps`

---

## 💡 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# View database (GUI)
npm run db:studio

# Reset everything
npm run db:generate
npx prisma db push
npm run db:seed

# Build for production
npm run build
npm start
```
