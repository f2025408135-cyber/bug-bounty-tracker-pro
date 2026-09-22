# Bug Bounty Tracker Pro

Interactive bug bounty tracking application with gamification, rich analytics, and team collaboration features.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL via Prisma
- **Auth:** NextAuth.js

## Features

### Tracking

- **Multi-program dashboard** — track findings across bug bounty programs simultaneously
- **Severity classification** — CVSS scoring with custom severity levels
- **Status workflow** — submitted → triaged → confirmed → resolved → paid
- **Evidence management** — attach screenshots, videos, and PoC files
- **Tagging & filtering** — organize by vulnerability type, platform, status

### Gamification

- **Points system** — earn points based on severity and impact
- **Achievement badges** — milestones for streaks, categories, and payouts
- **Leaderboards** — compare with team members
- **Payout tracking** — total earnings, pending, and historical trends

### Analytics

- **Finding statistics** — by severity, type, platform, time period
- **Response times** — program triage and resolution speed
- **Success rates** — accepted vs. duplicate vs. N/A ratios
- **Revenue reports** — monthly and per-program earnings

## Quick Start

```bash
git clone https://github.com/f2025408135-cyber/bug-bounty-tracker-pro.git
cd bug-bounty-tracker-pro
npm install
cp .env.example .env.local
# Configure database and auth
npx prisma generate
npx prisma db push
npm run dev
# → http://localhost:3000
```

## Project Structure

```
bug-bounty-tracker-pro/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── findings/           # Findings CRUD
│   │   ├── programs/           # Bug bounty program management
│   │   ├── analytics/          # Statistics and reports
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── findings/           # Finding-related components
│   │   └── charts/             # Analytics charts
│   ├── lib/                    # Utilities, auth, db
│   └── types/                  # TypeScript definitions
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
└── package.json
```

## Configuration

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Session encryption key |
| `NEXTAUTH_URL` | Application URL |

## License

MIT
