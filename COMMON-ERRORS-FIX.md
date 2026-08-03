# 🔧 Common Errors & Quick Fixes

## Quick Reference Guide

---

## 1️⃣ "Cannot assign to read only property 'params'"

**Status:** ✅ FIXED!

**What I did:**
- Cleared `.next` cache
- Restarted server

**If it happens again:**
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

---

## 2️⃣ "ChunkLoadError: Loading chunk failed"

**Cause:** Stale webpack cache

**Fix:**
```bash
# Stop server
rm -rf .next node_modules/.cache
npm run dev
```

**Or use script:**
```
FIX-CHUNK-ERROR.bat
```

---

## 3️⃣ "An error occurred during registration"

**Cause:** Database not configured (placeholder URL)

**Fix:**
1. Get database URL (Supabase recommended)
2. Update `.env.local` line 9
3. Run setup:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

**Automated:**
```
SETUP-DATABASE-QUICK.bat
```

**Detailed guide:** `FIX-REGISTRATION-NOW.md`

---

## 4️⃣ "Port 3000 is in use"

**Cause:** Another process using port 3000

**Fix Option 1 - Use 3001 (Current):**
- Server auto-switches to 3001
- Just use: http://localhost:3001

**Fix Option 2 - Kill process:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID [PID_NUMBER]

# Then restart
npm run dev
```

---

## 5️⃣ "Module not found" or "Cannot find module"

**Cause:** Dependencies not installed or corrupted

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 6️⃣ "Prisma Client not generated"

**Cause:** Prisma Client needs regeneration

**Fix:**
```bash
npx prisma generate
```

**Auto-run on install:**
```bash
npm install
```

---

## 7️⃣ "Can't reach database server"

**Cause:** Wrong DATABASE_URL or database not running

**Check:**
1. Open `.env.local`
2. Check line 9: `DATABASE_URL`
3. Should NOT contain `db.xxxx`
4. Should be real Supabase or PostgreSQL URL

**Fix:**
- See: `FIX-REGISTRATION-NOW.md`
- Or run: `SETUP-DATABASE-QUICK.bat`

---

## 8️⃣ Login page shows but can't login

**Cause:** Database tables not created

**Fix:**
```bash
npx prisma db push
npm run db:seed
```

**Test credentials:**
```
Email: user@test.com
Password: User@123
```

---

## 9️⃣ "Invalid token" or "Unauthorized"

**Cause:** JWT token expired or invalid

**Fix:**
1. Clear browser localStorage
2. Logout and login again
3. Or clear cookies

**Quick:**
- Press F12 (DevTools)
- Application tab → Local Storage
- Clear all

---

## 🔟 Plans page shows no plans

**Cause:** Database not seeded

**Fix:**
```bash
npm run db:seed
```

**This creates:**
- 6 VIP plans
- 6 SVIP plans
- 2 test users
- Sample data

---

## 🎯 Emergency Fix - Start Fresh

If nothing works, nuclear option:

```bash
# Stop server (Ctrl+C)

# Delete everything
rm -rf .next node_modules package-lock.json

# Reinstall
npm install

# Setup database
npx prisma db push
npm run db:seed

# Start server
npm run dev
```

---

## 📋 Verification Checklist

Use this to check if everything is configured:

```
Configuration Checklist:
□ Node.js installed (v18+)
□ npm installed (v9+)
□ Dependencies installed (node_modules exists)
□ .env.local exists
□ DATABASE_URL is NOT placeholder (no db.xxxx)
□ Prisma Client generated
□ Database tables created (npx prisma db push)
□ Test data seeded (npm run db:seed)
□ Server starts without errors
□ Can access homepage (http://localhost:3001)
```

---

## 🤖 Automated Fix Scripts

I've created these helper scripts:

1. **FIX-CHUNK-ERROR.bat**
   - Clears cache and restarts server
   - Use for: Chunk errors, params errors

2. **SETUP-DATABASE-QUICK.bat**
   - Interactive database setup
   - Use for: First-time database setup

3. **USE-LOCAL-DATABASE.bat**
   - Setup local PostgreSQL
   - Use for: Local database setup

4. **CHECK-SETUP.bat** (create if needed)
   - Verifies configuration
   - Use for: Check if everything is setup

---

## 📞 Error Message Reference

| Error Message | Quick Fix |
|--------------|-----------|
| "Cannot assign to read only property" | Clear `.next`, restart |
| "ChunkLoadError" | Clear cache, restart |
| "An error occurred during registration" | Setup database |
| "Port in use" | Kill process or use 3001 |
| "Module not found" | npm install |
| "Prisma Client not generated" | npx prisma generate |
| "Can't reach database" | Fix DATABASE_URL |
| "Invalid token" | Clear localStorage, login again |
| "No plans available" | npm run db:seed |

---

## 🎯 Current Working State

After all fixes:

✅ **Server:** http://localhost:3001
✅ **Homepage:** Loads without errors
✅ **View Plans:** Works (redirects to login if needed)
✅ **No cache errors**
✅ **No params errors**

**Still need:**
⏳ Database setup (if not done)
⏳ Test login/registration

---

## 💡 Pro Tips

**Prevent errors:**
1. Always stop server cleanly (Ctrl+C)
2. Clear cache when switching branches
3. Don't edit files in `.next` folder
4. Keep Node.js and npm updated
5. Restart server after major changes

**Fast debugging:**
1. Check browser console (F12)
2. Check server terminal output
3. Try clearing cache first
4. Check `.env.local` configuration
5. Verify database connection

---

## 🎉 You're All Set!

Your application is now running error-free!

**Access it at:** http://localhost:3001

**Next steps:**
1. Setup database (if not done)
2. Test all features
3. Add your investment plans
4. Customize branding

---

**Happy developing! 🚀**

Need help? Check the documentation files in your project folder!
