# Tally

The Tally to-do apps: two web apps and a mobile app that share one list. All three read and write
the same Supabase `todos` table, so a task added on the phone shows up on the web and the other way
round. There is no sign-in: everyone sees and edits the same list.

| App | Folder | What it is | Where |
| --- | --- | --- | --- |
| **Tally** | `apps/web` | The list on the web: warm paper, serif wordmark, green accent | _deploying_ |
| **Tally Admin** | `apps/admin` | Every item in one table with created dates; dark rail, teal accent | _deploying_ |
| **Tally Mobile** | `apps/mobile` | Native iOS and Android app (Expo); navy header, coral accent | Run with `npx expo start` |

Each app's `DESIGN.md` describes its palette, type and layout.

## Tech stack

- **npm workspaces**: the apps live in `apps/*`, with one `package-lock.json` at the root.
- **Web** (`web`, `admin`): Vite + React 19 + TypeScript, plain CSS per app. Each build is a static
  `dist/` folder.
- **Mobile** (`mobile`): Expo SDK 57 (React Native 0.86) + TypeScript, iOS and Android only.
- **Supabase** for storage: one `todos` table (`id`, `title`, `done`, `created_at`), used with
  `@supabase/supabase-js` and the public publishable key. The mobile app adds
  `react-native-url-polyfill` and `@react-native-async-storage/async-storage`, as Supabase's React
  Native guide sets it up.
- **Vercel** hosts the two web apps as separate projects (root directory `apps/web` and
  `apps/admin`), with a preview deployment for every pull request.

## Local setup

```bash
npm install                     # once, at the root
npm run dev -w tally-web        # http://localhost:5173
npm run dev -w tally-admin      # http://localhost:5174
cd apps/mobile && npx expo start  # then press i (iOS Simulator), a (Android) or scan the QR code with Expo Go
```

| Command (at the root) | What it does |
| --- | --- |
| `npm run build` | Type-checks and builds both web apps |
| `npm run build -w tally-web` | Builds one web app into `apps/web/dist` |
| `npm run lint` | ESLint in both web apps |
| `npm run typecheck` | Type-checks all three apps |

For the mobile app, `npx expo-doctor` in `apps/mobile` checks the Expo setup. Native projects
(`ios/`, `android/`) come from `npx expo prebuild` and are not committed.

## Supabase

All three apps use the same project, `https://hszqtfynyogshhltamep.supabase.co`. The URL and the
publishable key are defaults in each app's `src/lib/supabase.ts`; both are public by design, and
row level security decides what they may do. To point an app elsewhere, set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the web apps, or
`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for mobile (see each app's
`.env.example`).

The `todos` table already exists. For a fresh project, apply
`supabase/migrations/20261007120000_todos.sql` (SQL Editor, or `npx supabase db push` after
`npx supabase link`). Its policies let the `anon` role read and change every row, which suits a
shared demo list; tighten them before storing anything private.

## Deploy (Vercel)

The two web apps are separate Vercel projects connected to this repository:

| Setting | Value |
| --- | --- |
| Root Directory | `apps/web` or `apps/admin` |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Include files outside the root directory | on (installs from the root lockfile) |

A push to `main` deploys both to production; a pull request gets a preview of each. The mobile app
ships through the app stores, not Vercel.

## Project structure

```
apps/
  web/        Tally, the list on the web
  admin/      Tally Admin, the table view
  mobile/     Tally Mobile, the Expo app for iOS and Android
supabase/
  migrations/ The todos table and its row level security policies
```
