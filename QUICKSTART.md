# 🚀 Quick Start - Get Running in 5 Minutes

## Fastest Way to Run on Localhost

### Windows Users:

**Run this one command:**
```bash
START.bat
```

The script will:
1. Install dependencies
2. Create environment file
3. Generate Prisma Client
4. Setup database (optional)
5. Start the server at http://localhost:3000

---

### Manual Setup (All Platforms):

**Step 1: Install dependencies**
```bash
npm install
```

**Step 2: Setup environment**
```bash
# Windows
copy .env.local.example .env.local

# Mac/Linux
cp .env.local.example .env.local
```

**Step 3: Edit `.env.local`** 

For quick testing, you can use the default values. Just make sure to set:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/investment_db"
```

**Step 4: Setup database**
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npx prisma db push

# Seed with test data
npm run db:seed
```

**Step 5: Start server**
```bash
npm run dev
```

**🎉 Visit http://localhost:3000**

---

## Default Login Credentials

**Admin Panel:**
- Email: `admin@investpro.com`
- Password: `Admin@123`

**User Dashboard:**
- Email: `user@test.com`
- Password: `User@123`

---

## Don't have PostgreSQL?

### Option 1: Use Supabase (Free & Easy)
1. Go to https://supabase.com
2. Create free account and project
3. Copy the connection string
4. Paste in `.env.local`:
```env
DATABASE_URL="your-supabase-connection-string"
```

### Option 2: Use Docker
```bash
docker-compose up -d postgres
```

---

## Common Issues

**Port 3000 in use?**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
set PORT=3001
npm run dev
```

**Database connection error?**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env.local`
- Try: `npx prisma studio` to test connection

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## What's Included

✅ **6 Investment Plans** (3 VIP + 3 SVIP)
✅ **2 Test Users** (Admin + Regular User)
✅ **Sample Data** (Banners, Notices, Settings)
✅ **Complete Authentication** (Login, Register, JWT)
✅ **Dashboard** with real-time stats
✅ **Responsive Design** (Mobile, Tablet, Desktop)
✅ **Dark/Light Mode**

---

## Next Steps

1. Login with test credentials
2. View investment plans
3. Check dashboard stats
4. Explore admin panel (as admin user)
5. Start customizing!

---

## Need Help?

- Check `SETUP.md` for detailed instructions
- Check `README.md` for project overview
- View database with: `npm run db:studio`

**Happy Building! 🎉**
