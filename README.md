# Inked Whispers

The official website and administrative portal for **Inked Whispers**: *Where Words Become Legacy.*

- **Public website**: Home, About Us, About Core, New Events, Past Events, Join Us, Newsletter, Contact Us, Privacy Policy, Terms & Conditions.
- **Admin portal** (`/admin`): Dashboard, Applications, Positions, Events, Past Events (winners, highlights, results, certificates, photo galleries), Newsletter, Contact Messages, Core Members, Website Content, Settings.
- **Stack**: Next.js 16 (App Router, JavaScript only), React 19, Supabase (Postgres, Auth, Storage, Row Level Security), Lucide React, Google Fonts (Cormorant Garamond and Manrope via `next/font`). Ready to deploy on Vercel.

---

## Contents

1. [Project structure](#project-structure)
2. [Deployment guide (steps 1–14)](#deployment-guide)
3. [Environment variables and Vercel](#environment-variables)
4. [Security model](#security-model)
5. [Replacing the logo and placeholders](#replacing-the-logo-and-placeholders)
6. [Day-to-day admin tasks](#day-to-day-admin-tasks)
7. [Troubleshooting](#troubleshooting)

---

## Project structure

```
inked-whispers/
├── app/
│   ├── (site)/                 Public pages (share the navbar and footer)
│   │   ├── page.js             Home
│   │   ├── about/  core/  events/  events/[slug]/
│   │   ├── past-events/  past-events/[slug]/
│   │   ├── join/  newsletter/  contact/  privacy/  terms/
│   ├── admin/
│   │   ├── login/              Admin login (Supabase Auth, no sign-up)
│   │   ├── logout/             Signs out non-admin sessions
│   │   └── (panel)/            Every protected admin page (server-side requireAdmin)
│   ├── api/
│   │   ├── applications/  contact/  newsletter/     Public form handlers
│   │   └── admin/export/{applications,newsletter}/  CSV exports (admin only)
│   ├── sitemap.js  robots.js  manifest.js  not-found.js  error.js
├── components/
│   ├── site/                   Public UI (Navbar, Hero, EventCard, Gallery, forms…)
│   ├── admin/                  Admin UI (Shell, tables, forms, editors…)
│   └── ui/                     Shared primitives (Field, Modal, StatusBadge…)
├── lib/
│   ├── supabase/               server.js, public.js, admin.js (service role), proxy.js
│   ├── actions/                Admin Server Actions (each re-checks admin rights)
│   ├── auth.js  security.js  validations.js  storage.js  data.js  site-config.js
├── styles/                     site.css, admin.css, components.css
├── public/                     logo/, images/
├── supabase/
│   ├── migrations/0001_schema.sql   Tables, enums, triggers, helper functions
│   ├── migrations/0002_rls.sql      Row Level Security policies
│   ├── migrations/0003_storage.sql  Storage buckets and policies
│   ├── seed.sql                     Departments, core team, contact details
│   ├── updates/                     One-off scripts for existing databases
│   └── create-first-admin.sql       Grants admin access to a user
├── proxy.js                    Protects /admin/* (Next.js 16 "proxy", formerly middleware)
├── next.config.mjs             Security headers, CSP, image domains
└── .env.example
```

### Database tables

| Table | Purpose | Public access |
|---|---|---|
| `profiles` | Display name for each auth user | Own row only |
| `admins` | Who may use the admin portal (`owner`, `admin`, `editor`) | None. Writable only from the SQL editor |
| `core_members` | About Core page | Read active rows |
| `events` | Upcoming and past events, including winners, highlights, results, certificates | Read published, non-draft rows |
| `event_gallery` | Photos for past events | Read photos of published events |
| `positions` | Departments and roles on Join Us | Read active rows |
| `applications` | Join Us submissions | **None** (admins only) |
| `newsletter_subscribers` | Newsletter sign-ups (unique email) | **None** |
| `contact_messages` | Contact form submissions | **None** |
| `site_content` | Editable website copy (key → JSON) | Read |
| `rate_limits` | Server-side rate limiting buckets | None |

---

## Deployment guide

You need a GitHub account, a [Supabase](https://supabase.com) account and a [Vercel](https://vercel.com) account. All three have free tiers.

### 1. Install the project

Install **Node.js 22 LTS** (20.9+ works; 22+ is recommended because the Supabase client is dropping Node 20).

```bash
cd inked-whispers
npm install
```

### 2. Create a Supabase project

1. Go to <https://supabase.com/dashboard> and click **New project**.
2. Choose a name (e.g. `inked-whispers`), a strong database password (store it in a password manager) and the region closest to your audience (for India: **Mumbai, ap-south-1**).
3. Wait for the project to finish provisioning.

### 3. Prepare the database

Open **SQL Editor** in the Supabase dashboard. You will run five files from the `supabase/` folder, **in this order**.

### 4. Run the SQL migrations

For each file, click **New query**, paste the entire file, then click **Run**:

1. `supabase/migrations/0001_schema.sql`: tables, enums, triggers, helper functions
2. `supabase/migrations/0002_rls.sql`: Row Level Security policies
3. `supabase/migrations/0003_storage.sql`: storage buckets (`media` public, `resumes` private) and policies
4. `supabase/migrations/0004_admin_safeguards.sql`: locks `admins` to read-only through the API and blocks removing the last owner
5. `supabase/seed.sql`: the four departments (Human Resources, PR & Marketing, Social Media, Creative Writing), the core team (Mihika Goel, Anshika Jaiswal, Sanskar Srivastava) and contact details

> **Already set up the database with the earlier version?** Run `supabase/updates/2026-10-content-update.sql` once instead of re-running the seed. It swaps in the new departments, core team and website text, and keeps past applications intact.

All four files are idempotent, so running them again is safe. Afterwards, **Table Editor** should list all the tables above, and **Storage** should show the `media` and `resumes` buckets.

### 5. Configure authentication

In **Authentication → Sign In / Providers → Email**:

- Keep **Email** enabled.
- **Turn OFF "Allow new users to sign up".** The website has no sign-up page, and this also blocks sign-ups through the API.
- Keep **Confirm email** on.

In **Authentication → URL Configuration**:

- **Site URL**: your production URL, e.g. `https://www.your-domain.com` (use `http://localhost:3000` until you have a domain).
- **Redirect URLs**: add `http://localhost:3000/**` and `https://your-vercel-project.vercel.app/**`, plus your custom domain later.

Optional but recommended: under **Authentication → Rate Limits**, keep the defaults. Under **Policies/Passwords**, set a minimum password length of 12.

### 6. Create the two administrators (invite flow, no shared or typed passwords)

The two initial owners are `pranav.pandey6780@gmail.com` and `inked.whispers.org@gmail.com`. Each gets a separate account and chooses their own password.

1. **Email templates.** In **Authentication → Email Templates**, paste `supabase/email-templates/invite.html` into **Invite user** and `recovery.html` into **Reset password**. They link to `/admin/auth/confirm`, which signs the person in and sends them to choose a password.
2. **Site URL.** Make sure **Authentication → URL Configuration → Site URL** is your real domain (or `http://localhost:3000` while testing), because the links use it.
3. **Send the invitations.** Put `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (step 7), then run:

   ```bash
   npm run admins:setup
   ```

   This invites any of the two addresses that has no account yet. It never sets or prints a password and never touches an existing account. *(Alternative: Authentication → Users → **Invite user**.)*
4. **Each administrator** opens their email, clicks the link, and chooses a password (12+ characters). They land on the dashboard only if they are listed as an admin (next step).
5. **Grant access.** After both have accepted, run `npm run admins:setup` again, or paste `supabase/grant-initial-admins.sql` into the SQL Editor. Either grants `owner` only to confirmed accounts, skips the rest with a message, and never overwrites an existing admin's role.

Forgot a password later? **/admin/forgot-password** emails a one-time reset link. To add more admins later, invite them and use `supabase/create-first-admin.sql` (role `admin`). Admin rights can **only** be granted with the service role or the SQL editor. No page or API on the website can create an admin.

### 7. Configure environment variables

In Supabase, open **Project Settings → API** (or **API Keys**) and copy:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` / secret key → `SUPABASE_SERVICE_ROLE_KEY` (**keep this secret**)

Create `.env.local` in the project root (it is git-ignored):

```bash
cp .env.example .env.local
```

Fill in the values. Generate the salt with `openssl rand -hex 32`. See [Environment variables](#environment-variables) for what each one does.

### 8. Run locally

```bash
npm run dev
```

Open <http://localhost:3000>. The public site works even before Supabase is configured: it shows graceful empty states and placeholder content. Admin login is at <http://localhost:3000/admin/login>.

Before deploying, check a production build:

```bash
npm run build && npm start
```

### 9. Push to GitHub

```bash
git init        # if not already a repository
git add .
git commit -m "Inked Whispers website"
git branch -M main
git remote add origin https://github.com/<your-account>/inked-whispers.git
git push -u origin main
```

Check that `.env.local` is **not** in the commit. It is listed in `.gitignore`.

### 10. Deploy on Vercel

1. <https://vercel.com/new> → **Import** your GitHub repository.
2. Framework preset: **Next.js** (auto-detected). Leave the build command (`next build`) and output settings at their defaults.
3. Open **Environment Variables** and add the five variables from the table below for **Production** and **Preview**.
4. Click **Deploy**.
5. After the first deploy, open **Settings → General → Node.js Version** and confirm **22.x** or newer.

### 11. Connect a custom domain

1. Vercel → your project → **Settings → Domains** → add `your-domain.com` and `www.your-domain.com`.
2. At your domain registrar, add the DNS records Vercel shows (usually an `A` record for the apex and a `CNAME` for `www` → `cname.vercel-dns.com`). HTTPS is issued automatically.
3. Update `NEXT_PUBLIC_SITE_URL` in Vercel to the final domain (no trailing slash) and **redeploy**. This value drives canonical URLs, the sitemap and Open Graph tags.
4. In Supabase → **Authentication → URL Configuration**, set **Site URL** to the domain and add `https://your-domain.com/**` to Redirect URLs.

### 12. Test admin login

1. Visit `https://your-domain.com/admin/dashboard`. You should be redirected to `/admin/login`.
2. Sign in with an admin created in step 6, and you should land on the dashboard.
3. Sign in with a non-admin account (if you create one for testing). You should see *"This account does not have administrative access."*
4. Click **Logout**, then go back to `/admin/dashboard`. You should be redirected to login again.
5. Create a test event in **Events → New Event**, set it to **Registration Open** with a registration URL, tick **Visible on website**, save, and confirm it appears on the home page and `/events`.

### 13. Test the application form

1. **Positions**: confirm the four departments are visible (edit or hide any you don't need).
2. Visit `/join`, choose a department and position, fill in the form, attach a small PDF résumé, tick the confirmation, and click **SUBMIT APPLICATION**. You should see *"Application Received."*
3. In the admin, **Applications** should list it. Open it, download the résumé (a signed link valid for 5 minutes), change the status, and add a note.
4. Try **Export CSV**.
5. Confirm the application is **not** publicly readable. In a private window, `https://<project>.supabase.co/rest/v1/applications?select=*` with only the anon key returns `[]`.

### 14. Test newsletter and contact

1. Subscribe at `/newsletter` (or in the footer). Subscribing again with the same email shows *"This email is already subscribed."*
2. Admin → **Newsletter** lists the subscriber, and **Export CSV** works.
3. Send a message from `/contact` with an inquiry type. Admin → **Contact Messages** shows it as **Unread**. Opening it marks it **Read**, and you can set it to **Resolved**.
4. Finally, check **Website Content → Contact & Social**. It is pre-filled with inked.whispers.org@gmail.com and Instagram @iw_verse. Add a LinkedIn URL when you have one; empty social fields stay hidden on the site.

---

## Environment variables

| Variable | Where it is used | Exposed to browser? | Add to Vercel? |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, robots, Open Graph | Yes (not secret) | **Yes**, your final domain, e.g. `https://www.your-domain.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | All Supabase clients | Yes (not secret) | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public reads and admin session (protected by RLS) | Yes (designed to be public) | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.js` only: public form handlers and rate limiting, after validation | **Never** | **Yes**, as a server-side variable. Do **not** prefix with `NEXT_PUBLIC_` |
| `RATE_LIMIT_SALT` | Hashes IPs and emails before they are stored in `rate_limits` | Never | **Yes**, any long random string |

> **IMPORTANT: Never place `SUPABASE_SERVICE_ROLE_KEY` in client-side code.** It bypasses Row Level Security. In this project it is read only in `lib/supabase/admin.js`, which begins with `import 'server-only'`. Any attempt to import it from a client component fails the build. Never give it a `NEXT_PUBLIC_` prefix, never paste it into a browser, and rotate it in Supabase (Project Settings → API) if it is ever exposed.

When you change environment variables in Vercel, **redeploy**. `NEXT_PUBLIC_*` values are embedded at build time.

---

## Security model

- **Authentication**: Supabase Auth (email and password). Passwords are hashed and stored by Supabase, never by this app. Sessions live in secure, HTTP-only cookies managed by `@supabase/ssr`. **Keep me signed in** sets a 30-day persistent session; unticking it makes the session end when the browser closes.
- **No public sign-up**: there is no register page, and you disable sign-ups in Supabase (step 5).
- **Authorization in depth**:
  1. `proxy.js` redirects unauthenticated requests for `/admin/*` to the login page.
  2. Every admin page calls `requireAdmin()` on the server, which verifies the user with Supabase (`getUser`, not just the cookie) and checks `public.admins`.
  3. Every admin Server Action calls `assertAdmin()` again. Server Actions are public HTTP endpoints, so each one re-checks.
  4. **Row Level Security** in Postgres enforces the same rules even if application code had a bug. Private tables (`applications`, `contact_messages`, `newsletter_subscribers`) have no public read policy, and `admins` has no write policy at all.
- **Public forms** (`/api/applications`, `/api/contact`, `/api/newsletter`): same-origin check (CSRF protection), honeypot field, server-side validation and length limits, and database-backed rate limiting (per hashed IP). Inserts happen only on the server.
- **File uploads**: résumés must be PDFs of 4 MB or less. Images must be JPG, PNG or WebP of 5 MB or less. Files are verified by **magic bytes**, not just extension, and stored under random UUID names. Résumés live in a **private** bucket and are served only through 5-minute signed URLs to admins.
- **XSS**: React escapes all output. User text is never rendered as HTML (`dangerouslySetInnerHTML` is used only for JSON-LD built from trusted config). External links are restricted to `http(s)` and opened with `rel="noopener noreferrer"`.
- **CSV exports** neutralise spreadsheet formula injection (`=`, `+`, `-`, `@`).
- **Headers**: Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `X-Robots-Tag: noindex` on `/admin`.
- **Login hardening**: generic error messages, rate limits of 10 attempts per IP and 6 per account per 15 minutes, and a post-login redirect restricted to `/admin/*` paths.

---

## Replacing the logo and placeholders

**The official logo was not included with the brief**, so this project ships with a carefully designed placeholder emblem (a winged fountain-pen nib with the wordmark).

To use the official logo:

1. Export it as a **transparent PNG**, ideally at least 1024 px on its longest side.
2. Replace `public/logo/inked-whispers-logo.png` (full logo with wordmark, used in the hero, login page and footer) and `public/logo/emblem.png` (the mark alone, used in the navbar and admin sidebar).
3. If the aspect ratio differs, update `logo.width` and `logo.height` in `lib/site-config.js`. The UI sizes the logo by height and never stretches it.
4. Replace `app/icon.png` (512×512), `app/apple-icon.png` (180×180), `app/favicon.ico` and `public/images/site/og-image.jpg` (1200×630).

The official website copy, the core team, the departments and the contact details are already filled in. A few deliberate placeholders remain:

| Placeholder | Where to change it |
|---|---|
| Core member portraits ("Portrait to come") | Admin → Core Members → edit → upload a photo |
| LinkedIn / YouTube / other social links (hidden while empty) | Admin → Website Content → Contact & Social |
| `[FOUNDING YEAR]`, `[EVENT DETAILS]`, `[MILESTONE DETAILS]`, `[CURRENT DIRECTION]` | Admin → Website Content → Our Journey |
| Featured cards on the home page | Admin → Website Content → Featured |
| Privacy Policy and Terms | `app/(site)/privacy/page.js`, `app/(site)/terms/page.js`. Have these reviewed for your jurisdiction before launch |

Social links in `[BRACKETS]` render as inert labels; empty ones are hidden. Neither ever becomes a broken link.

---

## Day-to-day admin tasks

| Task | Where |
|---|---|
| Publish a new event | Events → New Event → status **Published** or **Registration Open**, tick **Visible on website** |
| Close registrations | Edit the event → status **Registration Closed** |
| Archive an event | Edit → status **Completed**. It moves to Past Events, where you add winners, highlights, results, certificate info and photos |
| Review applicants | Applications → filter by department, position or status → open → change status |
| Open or close a role | Positions → edit → availability **Open / Limited / Closed** or untick **Show on the Join Us page** |
| Export data | Applications or Newsletter → **Export CSV** (respects the current filters) |
| Reorder core members or gallery photos | Use the arrow buttons |

All changes are revalidated immediately, so the public site updates without a redeploy.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Login says "Authentication is not configured" | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing. Add it and **redeploy** |
| Login works but you are sent back with "does not have administrative access" | Run `supabase/create-first-admin.sql` with the exact email |
| Forms say "temporarily unavailable" | `SUPABASE_SERVICE_ROLE_KEY` is missing on the server, or the migrations were not run |
| Uploaded images don't display | Confirm `0003_storage.sql` ran and `NEXT_PUBLIC_SUPABASE_URL` is set at **build** time (it configures allowed image hosts and CSP) |
| Dashboard shows "Some statistics could not be loaded" | Migrations are incomplete. Re-run `0001`–`0003` |
| Pages show old content | Saving in the admin revalidates pages. Otherwise public pages refresh every 1–5 minutes |

---

© 2026 Inked Whispers. All rights reserved.
