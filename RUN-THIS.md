# ⚠️ CONNECTION REFUSED ERROR - HERE'S THE FIX

The "Connection Refused" error means **the server is not running**.

## ✅ HERE'S WHAT TO DO:

### 📍 **IMPORTANT: npm install is currently running in the background**

---

## **OPEN YOUR OWN TERMINAL** and follow these steps:

### **Step 1: Wait for npm install to finish**

In your current terminal, you should see `npm install` running.

**WAIT** until you see:
```
added XXX packages in XXXs
```

If it seems stuck (more than 10 minutes), press **Ctrl+C** and run:
```bash
npm install --force
```

---

### **Step 2: Create .env.local file**

Run this command:
```bash
copy .env.local.example .env.local
```

---

### **Step 3: Edit .env.local**

Open `.env.local` in Notepad and make sure it has these lines:
```env
JWT_SECRET=my-secret-key-for-testing-123456
JWT_REFRESH_SECRET=my-refresh-secret-for-testing-123456
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/investment_db"
```

**Save and close** the file.

---

### **Step 4: Generate Prisma Client**

Run:
```bash
npx prisma generate
```

Wait for it to complete.

---

### **Step 5: Start the Development Server**

Run:
```bash
npm run dev
```

**Wait** until you see:
```
✓ Ready in X.Xs
○ Compiling / ...
✓ Compiled / in X.Xs
- Local: http://localhost:3000
```

---

### **Step 6: Open Your Browser**

Go to:
```
http://localhost:3000
```

**The page should now load!** 🎉

---

## 🆘 TROUBLESHOOTING:

### Problem: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org

### Problem: Port 3000 is already in use
**Solution:** 
```bash
set PORT=3001
npm run dev
```
Then open: http://localhost:3001

### Problem: npm install is stuck
**Solution:** 
Press Ctrl+C, then run:
```bash
npm install --force
```

### Problem: Prisma errors
**Solution:**
```bash
npx prisma generate
```

### Problem: Can't find .env.local.example
**Solution:** You're in the wrong folder. Navigate to the project folder first:
```bash
cd path\to\investment-platform
```

---

## 📝 SUMMARY OF COMMANDS (Run these in order):

```bash
# 1. Wait for npm install to complete (or run it if not started)
npm install

# 2. Create environment file
copy .env.local.example .env.local

# 3. Edit .env.local (add JWT secrets)

# 4. Generate Prisma
npx prisma generate

# 5. Start server
npm run dev

# 6. Open browser to http://localhost:3000
```

---

## ✨ THAT'S IT!

Once `npm run dev` shows "Ready", your localhost will work!
