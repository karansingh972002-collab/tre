# Premium Investment Membership Platform

A modern, full-featured investment membership web application with VIP/SVIP tiers, referral system, automated daily income, and comprehensive admin panel.

## Working Local Version

This folder now runs as a functional local website using `production-server.js`
and `data/production-db.json`. No Prisma, Supabase, PostgreSQL, or environment
setup is required for the local version.

```bash
npm run dev
```

Open:

```text
http://localhost:8080
```

Admin:

```text
http://localhost:8080/#admin
```

Default admin password:

```text
admin123
```

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Payment**: Stripe & Razorpay Integration
- **Authentication**: JWT, OTP Verification
- **Animations**: Framer Motion, Lottie

## Features

### User Features
- 🔐 Complete Authentication (Register, Login, OTP, Forgot Password)
- 💰 Multi-tier Investment Plans (VIP & SVIP)
- 👥 Multi-level Referral System (3 levels)
- 💳 Wallet System (Deposit, Withdraw, Transaction History)
- 📊 Real-time Dashboard with Analytics
- 📈 Automated Daily Income Distribution
- 🎨 Dark/Light Mode Support
- 📱 Fully Responsive Mobile-First Design
- 🔔 Push Notifications
- 📧 Email Notifications

### Admin Features
- 📊 Comprehensive Analytics Dashboard
- 👥 User Management (Freeze, Delete, View)
- 💸 Transaction Management (Approve/Reject Withdrawals)
- 📦 Plan Management (CRUD Operations)
- 🎯 CMS (Banners, Notices, Popups)
- 💬 Support Message Management
- 📝 Activity Audit Logs
- 📈 Advanced Charts & Reports
- 📤 Export (CSV, Excel, PDF)

### Security
- CSRF Protection
- XSS Protection
- Rate Limiting
- Encrypted Passwords
- Role-Based Access Control
- Audit Logging

### Performance
- Image Optimization
- Lazy Loading
- Code Splitting
- PWA Support
- SEO Optimized

## Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL (or Supabase account)
- Docker (optional)

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd investment-platform
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Supabase URL and keys
- Stripe/Razorpay keys
- JWT secret
- Email service credentials
- etc.

4. **Run database migrations**
```bash
npm run db:migrate
```

5. **Seed initial data (optional)**
```bash
npm run db:seed
```

6. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec app npm run db:migrate
```

## Project Structure

```
investment-platform/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # User dashboard
│   │   ├── (admin)/           # Admin panel
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── admin/            # Admin components
│   │   └── shared/           # Shared components
│   ├── lib/                   # Utilities & helpers
│   │   ├── db/               # Database utilities
│   │   ├── auth/             # Authentication
│   │   ├── payments/         # Payment integrations
│   │   └── utils/            # Helper functions
│   ├── types/                 # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # State management
│   └── styles/                # Global styles
├── public/                    # Static assets
├── prisma/                    # Database schema
├── docker/                    # Docker configuration
└── docs/                      # Documentation
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The application uses PostgreSQL with the following main tables:
- users
- plans (vip_plans, svip_plans)
- investments
- wallets
- transactions
- referrals
- daily_income_history
- withdrawals
- admin_activity_logs

See `prisma/schema.prisma` for complete schema.

## API Documentation

API documentation is available at `/api/docs` (Swagger UI) when running in development mode.

### Main API Endpoints

**Authentication**
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/verify-otp`
- POST `/api/auth/forgot-password`
- POST `/api/auth/refresh`

**Dashboard**
- GET `/api/dashboard/stats`
- GET `/api/plans`
- POST `/api/investments/create`

**Wallet**
- GET `/api/wallet/balance`
- POST `/api/wallet/deposit`
- POST `/api/wallet/withdraw`
- GET `/api/wallet/transactions`

**Referrals**
- GET `/api/referrals/stats`
- GET `/api/referrals/tree`

**Admin**
- GET `/api/admin/dashboard`
- GET `/api/admin/users`
- PUT `/api/admin/users/:id`
- GET `/api/admin/withdrawals`
- POST `/api/admin/withdrawals/:id/approve`

## Cron Jobs

The application includes automated tasks:

**Daily Income Distribution**
- Runs at midnight (00:00 UTC)
- Credits daily income to active investments
- Stops after plan validity expires
- Maintains earning history

Set up cron job:
```bash
# Using Vercel Cron
# See vercel.json

# Or using external service
curl -X POST https://your-domain.com/api/cron/daily-income \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Deployment

### Vercel (Recommended for Next.js)

```bash
npm install -g vercel
vercel
```

### Docker Production

```bash
docker build -t investment-platform .
docker run -p 3000:3000 investment-platform
```

### Manual Deployment

1. Build the application
```bash
npm run build
```

2. Start production server
```bash
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## SEO

The application is optimized for search engines:
- Dynamic meta tags
- Open Graph tags
- robots.txt
- sitemap.xml (auto-generated)
- Structured data

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Security Best Practices

- Never commit `.env` files
- Use strong JWT secrets
- Enable rate limiting in production
- Regular security audits
- Keep dependencies updated
- Use HTTPS in production
- Implement proper CORS policies

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@yourplatform.com or join our Discord channel.

## Changelog

See CHANGELOG.md for release history.
