# 🚀 Backend Setup Guide - Complete Database Connection

## ✅ What's Been Created

### Backend API Routes (Fully Functional)

All API endpoints are now ready and connected:

#### 1. **Wallet APIs**
- `POST /api/wallet/recharge` - Add funds to wallet
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/wallet/withdraw` - Get withdrawal history
- `GET /api/wallet/balance` - Get wallet balances
- `GET /api/wallet/transactions` - Get transaction history

#### 2. **Support APIs**
- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets` - Get user's tickets

#### 3. **Notifications API**
- `GET /api/notifications` - Get all notifications
- `PATCH /api/notifications` - Mark as read

#### 4. **Dashboard APIs** (Already Existing)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/plans` - Get investment plans
- `POST /api/investments/create` - Create investment
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

---

## 🗄️ Database Setup

### Option 1: Supabase (Recommended - Free & Easy)

**Why Supabase?**
- ✅ Free tier available
- ✅ No local PostgreSQL installation needed
- ✅ Cloud-hosted and managed
- ✅ Instant setup

**Steps:**

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub/Google

2. **Create New Project:**
   - Click "New Project"
   - Project Name: `investpro`
   - Database Password: (Create strong password)
   - Region: Choose closest to you
   - Click "Create new project" (takes 2-3 minutes)

3. **Get Connection String:**
   - Go to Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

4. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

---

### Option 2: Local PostgreSQL

**Prerequisites:**
- PostgreSQL installed on your system

**Steps:**

1. **Install PostgreSQL:**
   - Download from: https://www.postgresql.org/download/
   - During installation, set password for `postgres` user

2. **Create Database:**
   ```cmd
   psql -U postgres
   CREATE DATABASE investment_db;
   \q
   ```

3. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/investment_db"
   ```

---

## 📦 Installation Steps

### Step 1: Install Dependencies

```cmd
npm install
```

This installs all required packages including:
- Prisma (Database ORM)
- Next.js
- React
- TypeScript
- Tailwind CSS
- All UI components

### Step 2: Generate Prisma Client

```cmd
npx prisma generate
```

This creates the Prisma client based on your schema.

### Step 3: Push Database Schema

```cmd
npx prisma db push
```

This creates all 17 tables in your database:
- users
- wallets
- plans
- investments
- daily_income_history
- transactions
- withdrawals
- referral_earnings
- otp_codes
- notifications
- support_tickets
- banners
- notices
- popup_announcements
- activity_logs
- system_settings

### Step 4: Seed Database with Test Data

```cmd
npm run db:seed
```

This creates:
- **Admin user:** admin@investpro.com / Admin@123
- **Test user:** user@test.com / User@123
- **6 investment plans** (3 VIP + 3 SVIP)
- Sample data for testing

### Step 5: Start Development Server

```cmd
npm run dev
```

Server starts on: http://localhost:3000

---

## 🧪 Testing the Backend

### 1. Test Authentication

```cmd
# Register a new user
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test@123\",\"name\":\"Test User\"}"

# Login
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@test.com\",\"password\":\"User@123\"}"
```

### 2. Test Wallet Recharge

```cmd
# Get token from login response, then:
curl -X POST http://localhost:3000/api/wallet/recharge ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"amount\":1000,\"paymentMethod\":\"UPI\",\"paymentId\":\"PAY123\"}"
```

### 3. Test Withdrawal

```cmd
curl -X POST http://localhost:3000/api/wallet/withdraw ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"amount\":500,\"bankAccount\":\"1234567890\",\"ifscCode\":\"SBIN0001234\"}"
```

### 4. Test Support Ticket

```cmd
curl -X POST http://localhost:3000/api/support/tickets ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"subject\":\"Test Issue\",\"message\":\"This is a test ticket\"}"
```

---

## 🌐 Frontend Integration

All frontend pages are now connected to backend:

### Recharge Page
- Real-time wallet balance
- UPI & Card payment forms
- Transaction recording
- Notifications

### Withdraw Page
- Fetches real wallet balance
- Validates withdrawal amount
- Creates withdrawal requests
- Shows real withdrawal history
- Status tracking (Pending/Approved/Completed)

### Support Page
- Creates real support tickets
- Fetches user's ticket history
- Shows ticket status
- FAQ section

### Dashboard
- Real-time statistics
- Active investments
- Earnings tracking
- Referral data

---

## 🔐 Authentication Flow

1. **User registers** → Account created with wallet
2. **User logs in** → Receives JWT token
3. **Token stored** in localStorage
4. **All API calls** include token in Authorization header
5. **Backend verifies** token before processing requests

---

## 📊 Database Schema Overview

### Core Tables

**users** - User accounts and profiles
- Stores: email, password (hashed), name, role, status
- Referral system: referralCode, referredBy
- Security: 2FA, login attempts, locked status

**wallets** - User wallet balances
- availableBalance - Money ready to use
- lockedBalance - Money in pending withdrawals
- incomeWallet - Daily income accumulated
- referralBonus - Commission earnings
- totalDeposited, totalWithdrawn, totalInvested, totalEarned

**plans** - Investment plans (VIP/SVIP)
- name, type, investmentAmount, dailyIncome
- validity, totalReturn, availableSlots
- status (ACTIVE/INACTIVE)

**investments** - User's active investments
- orderId, amount, dailyIncome, totalReturn
- daysCompleted, totalEarned
- status (ACTIVE/COMPLETED/CANCELLED)
- startDate, endDate, lastIncomeDate

**transactions** - All wallet transactions
- type: DEPOSIT, WITHDRAWAL, INVESTMENT, DAILY_INCOME, etc.
- amount, status, description
- balanceBefore, balanceAfter
- paymentMethod, paymentId

**withdrawals** - Withdrawal requests
- amount, fee, netAmount
- status: PENDING, APPROVED, REJECTED, COMPLETED
- accountDetails (JSON with bank info)
- processedBy, processedAt

**support_tickets** - User support requests
- subject, message, status
- priority, category
- response, respondedBy, respondedAt

**notifications** - User notifications
- title, message, type
- read status
- metadata (JSON)

---

## 🔄 Automatic Features

### Daily Income Cron Job
Location: `src/app/api/cron/daily-income/route.ts`

**What it does:**
- Runs daily at midnight
- Credits daily income to all active investments
- Updates wallet balances
- Creates transaction records
- Sends notifications

**To test manually:**
```cmd
curl http://localhost:3000/api/cron/daily-income
```

---

## 🎯 Environment Variables

Required in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://..."

# JWT Secrets
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MIN_WITHDRAWAL=500
NEXT_PUBLIC_REFERRAL_LEVEL_1_PERCENT=10
NEXT_PUBLIC_REFERRAL_LEVEL_2_PERCENT=5
NEXT_PUBLIC_REFERRAL_LEVEL_3_PERCENT=2
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
**Solution:**
- Check DATABASE_URL is correct
- Verify Supabase project is active
- Check internet connection

### Error: "Prisma Client not generated"
**Solution:**
```cmd
npx prisma generate
```

### Error: "Table doesn't exist"
**Solution:**
```cmd
npx prisma db push
```

### Error: "Invalid token"
**Solution:**
- Token expired, login again
- Check JWT_SECRET in .env.local

### Port 3000 already in use
**Solution:**
```cmd
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Dev server running (`npm run dev`)
- [ ] Can login at http://localhost:3000
- [ ] Can recharge wallet
- [ ] Can withdraw funds
- [ ] Can create support tickets
- [ ] Dashboard shows data

---

## 📱 Test User Accounts

After seeding, use these accounts:

**Admin:**
- Email: admin@investpro.com
- Password: Admin@123
- Access: Full admin panel

**User:**
- Email: user@test.com
- Password: User@123
- Access: Standard user features

---

## 🚀 Next Steps

1. **Complete setup** using steps above
2. **Test all features** with test accounts
3. **Configure payment gateway** (Razorpay/Stripe)
4. **Set up email service** (for notifications)
5. **Deploy to production** (Vercel recommended)

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error messages carefully
3. Check database connection
4. Verify all environment variables
5. Check Prisma schema is up to date

---

**Your backend is fully ready! Follow the steps above to get everything running.** 🎉
