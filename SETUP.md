# Local Development Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed (or use Supabase)
- Git installed

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
copy .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database - Option 1: Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/investment_db"

# Database - Option 2: Supabase (Recommended for quick start)
# Get these from https://supabase.com
DATABASE_URL="your-supabase-connection-string"
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
```

### 3. Setup Database

#### Option A: Using Local PostgreSQL
```bash
# Create database
createdb investment_db

# Run migrations
npm run db:migrate:dev

# Seed initial data
npm run db:seed
```

#### Option B: Using Supabase (Easier)
1. Create account at https://supabase.com
2. Create new project
3. Copy connection string to `.env.local`
4. Run migrations:
```bash
npm run db:push
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

## Default Login Credentials (After Seeding)

**Admin:**
- Email: admin@investpro.com
- Password: Admin@123

**Test User:**
- Email: user@test.com
- Password: User@123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate:dev` - Create and apply migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with test data
- `npm run db:studio` - Open Prisma Studio (Database GUI)

## Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
set PORT=3001 && npm run dev
```

### Database connection issues
- Make sure PostgreSQL is running
- Check connection string in `.env.local`
- Ensure database exists

### Prisma errors
```bash
# Regenerate Prisma Client
npm run db:generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup environment variables
3. ✅ Setup database
4. ✅ Run migrations
5. ✅ Start development server
6. 🎉 Build your investment platform!
