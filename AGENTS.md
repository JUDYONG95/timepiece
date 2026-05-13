# AGENTS.md

## Stack
- Next.js 16 (App Router, RSC), React 19, TypeScript (strict)
- Tailwind CSS v4 (`@import 'tailwindcss'`, `@theme inline`, `@custom-variant dark` — no `@tailwind` directives)
- shadcn/ui new-york style, Radix UI primitives, lucide-react icons
- `next-themes` (class-based dark mode via `.dark`)
- `@vercel/analytics` (production only)
- Auth.js v5 (`next-auth` beta), Prisma 6 + SQLite, `bcryptjs` (credentials auth)

## Package manager
pnpm (lockfile: `pnpm-lock.yaml`)

## Commands
| Command | What it does |
|---------|-------------|
| `pnpm dev` | Next.js dev server |
| `pnpm build` | `next build` |
| `pnpm start` | `next start` |
| `pnpm lint` | `tsc --noEmit` |
| `pnpm db:push` | `prisma db push` |
| `pnpm db:seed` | seed default admin user |
| `pnpm db:studio` | `prisma studio` |

## Known quirks
- **TypeScript errors are invisible to `next build`** — `next.config.mjs` sets `typescript.ignoreBuildErrors: true`. Run `tsc --noEmit` for real type checking.
- **No test framework** in dependencies — do not attempt `pnpm test`.
- **Next.js 16 removed `next lint`** — `pnpm lint` runs `tsc --noEmit` instead.
- **Two `globals.css` files exist**: `app/globals.css` (active — warm tones, serif fonts) and `styles/globals.css` (unused — neutral tones, sans-serif). Imported in layout is `app/globals.css`.
- **Path alias `@/*`** — maps to project root (not `src/`).
- **v0.dev generated** — `.gitignore` excludes v0 sandbox artifacts (`__v0_*`, `.snowflake/`, `.v0-trash/`).
- **Auth**: Credentials (email+password) via Auth.js v5 with JWT sessions. Route protection uses `proxy.ts` (Next.js 16 replaces `middleware.ts`). Protected routes check auth in `lib/auth.config.ts`.

## Architecture
- Single-page showcase site (`app/page.tsx` renders Hero + 3 WatchCards + Footer)
- Admin dashboard at `/admin` (protected, shows watch list with sign-out)
- Login at `/login` (email/password form)
- Auth API at `/api/auth/[...nextauth]`
- SQLite database (`prisma/dev.db`) with single `User` table
- Default admin: `admin@example.com` / `admin123` (from `prisma/seed.js`)
- No API routes, no database queries on the public site
- Data is static (hardcoded in `app/page.tsx`)
- `components/ui/` — 57 shadcn/ui primitives (most unused)
