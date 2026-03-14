<div align="center">

# 🚀 CreatorHub

**Sell your digital products effortlessly.**

Upload, sell, and deliver digital products automatically — ebooks, templates, UI kits, courses, source code, and more.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Storage-3ECF8E?logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-clone--install)
  - [Environment Setup](#2-configure-environment)
  - [Database Setup](#3-set-up-database)
  - [Supabase Storage](#4-set-up-supabase-storage)
  - [Run Dev Server](#5-run-development-server)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [User Flows](#-user-flows)
- [Authentication Setup](#-authentication-setup)
- [Payment Integration](#-payment-integration-mayar)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/password + Google OAuth with Supabase Auth |
| 📊 **Creator Dashboard** | Revenue analytics, sales tracking, product management |
| 📦 **Product Management** | Create, edit, delete, publish/unpublish digital products |
| 🛒 **Checkout Flow** | Seamless purchase experience with email capture |
| 💳 **Payment Integration** | Mayar payment gateway (pending verification) |
| 📥 **Secure File Delivery** | Signed URL downloads after successful payment |
| 🏪 **Creator Store** | Public storefront for each creator |
| 📈 **Sales Analytics** | Revenue charts, top products, conversion rates |
| 🌗 **Dark Mode** | System-aware theme toggle with smooth transitions |
| 🎨 **Modern UI** | TailwindCSS 4 with GSAP animations |
| 📱 **Responsive** | Mobile-first responsive design |
| ⚡ **Performance** | React Server Components, streaming, edge-ready |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Next.js 16](https://nextjs.org/) | Full-stack React framework (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type-safe development |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) | Managed PostgreSQL database |
| **ORM** | [Prisma 6](https://prisma.io/) | Type-safe database queries |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) | Email/password + Google OAuth |
| **Storage** | [Supabase Storage](https://supabase.com/storage) | File uploads (products & thumbnails) |
| **Styling** | [TailwindCSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| **Animations** | [GSAP](https://gsap.com/) | High-performance animations |
| **Charts** | [Recharts](https://recharts.org/) | Revenue & sales visualizations |
| **Runtime** | [Bun](https://bun.sh/) / Node.js 20+ | JavaScript runtime |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│                  React Server Components                │
│                    + Client Components                  │
└──────────────┬───────────────────────┬──────────────────┘
               │                       │
       Server Actions            API Routes
               │                       │
┌──────────────▼───────────────────────▼──────────────────┐
│                   Next.js Server (App Router)           │
│              ┌─────────────┐ ┌────────────────┐         │
│              │   Prisma    │ │ Supabase Client │         │
│              └──────┬──────┘ └───────┬────────┘         │
└─────────────────────┼────────────────┼──────────────────┘
                      │                │
              ┌───────▼───┐    ┌───────▼────────┐
              │ PostgreSQL │    │ Supabase       │
              │ (Supabase) │    │ Auth + Storage │
              └────────────┘    └────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| [Node.js](https://nodejs.org/) | 20+ | ✅ (or Bun) |
| [Bun](https://bun.sh/) | 1.0+ | ✅ (or Node.js) |
| [Supabase Account](https://supabase.com/) | — | ✅ |
| [Git](https://git-scm.com/) | 2.0+ | ✅ |

### 1. Clone & Install

```bash
git clone https://github.com/your-username/creator-hub.git
cd creator-hub
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment (optional for dev)
PAYMENT_GATEWAY_WEBHOOK_SECRET=your_webhook_secret
```

> **💡 Tip:** Get your credentials from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API

### 3. Set Up Database

```bash
# Generate Prisma Client
bun run db:generate

# Run migrations
bun run db:migrate
```

### 4. Set Up Supabase Storage

In your [Supabase Dashboard](https://supabase.com/dashboard) → Storage, create two buckets:

| Bucket | Access | Purpose |
|--------|--------|---------|
| `product-files` | **Private** | Digital product files (secured by signed URLs) |
| `product-thumbnails` | **Public** | Product thumbnail images |

**Storage Policies for `product-thumbnails` (public read):**

```sql
-- Allow public read
CREATE POLICY "Public read thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-thumbnails');

-- Allow authenticated upload
CREATE POLICY "Authenticated upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-thumbnails' AND auth.role() = 'authenticated');
```

**Storage Policies for `product-files` (private):**

```sql
-- Allow authenticated upload
CREATE POLICY "Authenticated upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-files' AND auth.role() = 'authenticated');

-- Allow authenticated read (for signed URLs)
CREATE POLICY "Authenticated read files" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-files' AND auth.role() = 'authenticated');
```

### 5. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
creator-hub/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── public/                        # Static assets
├── src/
│   ├── actions/                   # Server Actions
│   │   ├── auth.ts                #   Auth (signUp, signIn, signOut)
│   │   ├── orders.ts              #   Orders (create, simulate payment)
│   │   └── products.ts            #   Products (CRUD, toggle publish)
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, theme, meta)
│   │   ├── page.tsx               # Landing page
│   │   ├── globals.css            # Global styles & animations
│   │   ├── api/
│   │   │   ├── auth/logout/       #   POST /api/auth/logout
│   │   │   ├── download/          #   GET  /api/download?orderId=...
│   │   │   ├── thumbnail/         #   GET  /api/thumbnail?ref=...
│   │   │   └── webhooks/payment/  #   POST /api/webhooks/payment
│   │   ├── auth/
│   │   │   ├── login/             #   Login page
│   │   │   ├── register/          #   Register page
│   │   │   ├── verify-email/      #   Email verification page
│   │   │   ├── confirm/           #   Auth confirmation callback
│   │   │   └── callback/          #   OAuth callback
│   │   ├── checkout/
│   │   │   ├── [productId]/       #   Checkout page
│   │   │   ├── confirm/           #   Payment confirmation
│   │   │   └── success/           #   Success + download
│   │   ├── dashboard/
│   │   │   ├── page.tsx           #   Dashboard overview
│   │   │   ├── layout.tsx         #   Dashboard layout (sidebar)
│   │   │   ├── analytics/         #   Analytics page
│   │   │   ├── orders/            #   Orders management
│   │   │   ├── products/          #   Product management
│   │   │   └── profile/           #   Profile settings
│   │   ├── products/[slug]/       #   Public product page
│   │   └── store/[userId]/        #   Creator store page
│   ├── components/
│   │   ├── ui/                    # Reusable UI primitives
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── DashboardMain.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ...
│   │   └── landing/               # Landing page sections
│   │       ├── HeroSection.tsx
│   │       ├── FeaturesSection.tsx
│   │       └── ...
│   ├── generated/prisma/          # Auto-generated Prisma Client
│   ├── hooks/
│   │   └── useGSAP.ts            # GSAP animation hook
│   └── lib/
│       ├── auth.ts                # getCurrentUser, requireAuth
│       ├── prisma.ts              # Prisma client singleton
│       ├── storage.ts             # Signed URL generation
│       ├── utils.ts               # Formatters, slug, helpers
│       └── supabase/
│           ├── client.ts          # Browser Supabase client
│           ├── server.ts          # Server Supabase client
│           └── middleware.ts      # Auth middleware
├── .env.example                   # Environment template
├── .gitignore
├── Dockerfile                     # Production Docker image
├── next.config.ts                 # Next.js configuration
├── package.json
├── prisma.config.ts               # Prisma configuration
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄️ Database Schema

```
┌──────────┐       ┌───────────┐       ┌──────────┐       ┌──────────┐
│   User   │──────<│  Product   │──────<│  Order   │──────<│ Payment  │
└──────────┘  1:N  └───────────┘  1:N  └──────────┘  1:1  └──────────┘
```

### Models

| Model | Key Fields | Description |
|-------|-----------|-------------|
| **User** | `id`, `name`, `email`, `avatarUrl`, `bio` | Creator account (synced with Supabase Auth) |
| **Product** | `title`, `slug`, `price`, `fileUrl`, `thumbnailUrl`, `published` | Digital product listing |
| **Order** | `buyerEmail`, `price`, `status`, `isDemo` | Purchase record |
| **Payment** | `paymentGatewayId`, `status`, `method` | Payment tracking |

### Relationships

- `User` → has many `Product` (cascade delete)
- `Product` → has many `Order` (cascade delete)
- `Order` → has one `Payment` (cascade delete)

---

## 📡 API Reference

### API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/logout` | `POST` | ✅ | Sign out current user |
| `/api/download?orderId=<id>` | `GET` | — | Download file (requires completed order) |
| `/api/thumbnail?ref=<ref>` | `GET` | — | Get thumbnail public URL |
| `/api/webhooks/payment` | `POST` | 🔑 Webhook Secret | Payment gateway webhook callback |

### Server Actions

| Action | File | Description |
|--------|------|-------------|
| `signUp` | `actions/auth.ts` | Register new account |
| `signIn` | `actions/auth.ts` | Login with email/password |
| `signOut` | `actions/auth.ts` | Logout |
| `resendVerificationEmail` | `actions/auth.ts` | Resend email verification |
| `createProduct` | `actions/products.ts` | Create new product with file upload |
| `updateProduct` | `actions/products.ts` | Update product details & files |
| `deleteProduct` | `actions/products.ts` | Delete product & associated data |
| `toggleProductPublished` | `actions/products.ts` | Publish/unpublish product |
| `createOrder` | `actions/orders.ts` | Create order from checkout |
| `createDemoOrder` | `actions/orders.ts` | Create demo order (no real purchase) |
| `simulatePaymentSuccess` | `actions/orders.ts` | Simulate payment (demo mode) |

### Webhook Payload

```json
POST /api/webhooks/payment
Headers:
  x-webhook-signature: <signature>

Body:
{
  "orderId": "uuid",
  "status": "success" | "failed",
  "paymentGatewayId": "gateway_tx_id"
}
```

---

## 👤 User Flows

### 🎨 Creator Flow

```
Register → Verify Email → Login → Dashboard
    ↓
Create Product → Upload File + Thumbnail → Set Price → Publish
    ↓
Share Product Link → Customers Purchase → Track Sales in Dashboard
    ↓
View Analytics → Revenue Charts → Top Products → Conversion Rates
```

### 🛒 Customer Flow

```
Visit Product Page → Click "Buy Now"
    ↓
Enter Email → Review Order → Confirm Payment
    ↓
Payment Success → Download File
```

### 🏪 Store Flow

```
Visit /store/[userId] → Browse Creator's Products → Click Product → Checkout
```

---

## 🔐 Authentication Setup

CreatorHub supports two authentication methods:

### 1. Email & Password (Local Auth)

Built-in authentication using Supabase Auth:

- ✅ User registration with email verification
- ✅ Secure password login
- ✅ Password reset functionality
- ✅ Session management with secure cookies

**No additional setup required** - works out of the box with Supabase.

### 2. Google OAuth

Sign in with Google accounts for seamless authentication:

- ✅ One-click login with Google
- ✅ Automatic user profile creation
- ✅ Email verification via Google
- ✅ Secure OAuth 2.0 flow

#### Setup Google OAuth

**Step 1: Create OAuth Credentials in Google Cloud**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web Application**
6. Add authorized redirect URIs:

```
Development:  http://localhost:3000/auth/callback
Production:   https://your-domain.com/auth/callback
```

7. Add authorized JavaScript origins:

```
Development:  http://localhost:3000
Production:   https://your-domain.com
```

8. Copy **Client ID** and **Client Secret**

**Step 2: Configure Supabase**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Authentication** → **Providers**
3. Find **Google** and enable it
4. Paste your Google **Client ID** and **Client Secret**
5. Save changes

**Step 3: Verify Callback URL**

Ensure your callback URL matches exactly in all three places:

- ✅ Google Cloud Console
- ✅ Supabase Dashboard
- ✅ Application code (`signInWithGoogle()` action)

Current callback URL in code:

```typescript
// src/actions/auth.ts
redirectTo: `${baseUrl}/auth/callback`
```

#### Testing Authentication

1. ✅ Local Auth: Register with email/password on login page
2. ✅ Google OAuth: Click "Google" button on login/register page
3. ✅ Email Verification: Check inbox for verification link
4. ✅ Session: After login, user can access dashboard

---

## 💳 Payment Integration (Mayar)

CreatorHub is integrated with **Mayar** payment gateway for processing customer payments. However, the integration is **currently pending verification** with Mayar.

### Current Status ⏳

- ✅ Backend payment infrastructure is complete
- ✅ Webhook endpoints are ready to receive payment confirmations
- ✅ Order management system supports payment tracking
- ⚠️ **Checkout cannot be completed yet** until Mayar merchant account is verified
- ⏳ Awaiting approval from Mayar to activate payment processing

### What's Already Implemented

| Component | Status | Details |
|-----------|--------|---------|
| Order creation flow | ✅ Complete | Orders created after customer enters email |
| Payment confirmation page | ✅ Complete | Awaits payment gateway confirmation |
| Webhook handler | ✅ Complete | `/api/webhooks/payment` ready to process callbacks |
| Demo/Test mode | ✅ Complete | Users can test purchase flow with demo orders |
| Secure file delivery | ✅ Complete | Signed URL download system after order completion |
| Payment tracking | ✅ Complete | Database models for payment history |

### Environment Variables

To enable payment processing once verified, configure in `.env`:

```env
PAYMENT_GATEWAY_SECRET=your_mayar_api_key
PAYMENT_GATEWAY_WEBHOOK_SECRET=your_webhook_secret
```

### Webhook Configuration

Once Mayar account is verified, configure webhook in Mayar Dashboard:

```
Webhook URL: https://your-domain.com/api/webhooks/payment
Webhook Secret: [Your PAYMENT_GATEWAY_WEBHOOK_SECRET]
Events: payment.success, payment.failed
```

### Testing Current Flow

You can test the purchase flow using demo mode:

1. ✅ Users can browse products and enter email
2. ✅ Orders are created in the system
3. ✅ Demo orders can be tested without real payment
4. ✅ File download system works after successful payment (demo)
5. ⏳ Real payment processing (pending Mayar verification)

Once Mayar merchant account is verified, real checkout will be fully operational.

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**

```bash
git add .
git commit -m "feat: ready for production"
git push origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework Preset: **Next.js**

3. **Set Environment Variables** in Vercel Dashboard:

```
DATABASE_URL=...
DIRECT_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
PAYMENT_GATEWAY_WEBHOOK_SECRET=...
```

4. **Deploy!** Vercel will automatically:
   - Install dependencies
   - Generate Prisma Client
   - Build the application
   - Deploy to edge network

5. **Run database migrations** (first deploy only):

```bash
bunx prisma migrate deploy
```

> **💡 Note:** Remove `output: "standalone"` from `next.config.ts` when deploying to Vercel, as Vercel handles this automatically.

### Option 2: Docker

```bash
# Build the image
docker build -t creatorhub .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e DIRECT_URL="your_direct_url" \
  -e NEXT_PUBLIC_SUPABASE_URL="your_supabase_url" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key" \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  -e PAYMENT_GATEWAY_WEBHOOK_SECRET="your_secret" \
  creatorhub
```

**Docker Compose:**

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

```bash
docker compose up -d
```

### Option 3: Node.js Server

```bash
# Install dependencies
bun install

# Generate Prisma Client
bun run db:generate

# Run database migrations
bun run db:migrate:deploy

# Build for production
bun run build

# Start production server
bun run start
```

Use a process manager like [PM2](https://pm2.keymetrics.io/) for production:

```bash
npm install -g pm2
pm2 start npm --name "creatorhub" -- start
pm2 save
pm2 startup
```

---

## 🔑 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection (pooled) | `postgresql://...?pgbouncer=true` |
| `DIRECT_URL` | ✅ | PostgreSQL connection (direct, for migrations) | `postgresql://...` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL | `https://abc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key | `eyJ...` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Application URL | `https://your-domain.com` |
| `PAYMENT_GATEWAY_WEBHOOK_SECRET` | ⚠️ | Webhook signature secret | `whsec_...` |

---

## 🔒 Security

CreatorHub implements several security measures for production:

| Measure | Implementation |
|---------|---------------|
| **CSRF Protection** | Next.js Server Actions with built-in CSRF tokens |
| **XSS Prevention** | React auto-escaping + `X-Content-Type-Options: nosniff` |
| **Clickjacking** | `X-Frame-Options: DENY` header |
| **Auth Middleware** | Supabase session validation on every request |
| **Protected Routes** | Middleware redirects unauthenticated users |
| **Signed URLs** | Short-lived signed URLs for file downloads (5 min TTL) |
| **Demo Isolation** | Demo orders cannot download real files |
| **Input Validation** | Server-side validation on all Server Actions |
| **SQL Injection** | Prisma parameterized queries |
| **Referrer Policy** | `strict-origin-when-cross-origin` |
| **Permissions Policy** | Camera, microphone, geolocation disabled |
| **No Powered-By** | `X-Powered-By` header removed |

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `bun run dev` | Start development server |
| `build` | `bun run build` | Generate Prisma Client + build for production |
| `start` | `bun run start` | Start production server |
| `lint` | `bun run lint` | Run ESLint |
| `typecheck` | `bun run typecheck` | Run TypeScript type checking |
| `db:generate` | `bun run db:generate` | Generate Prisma Client |
| `db:migrate` | `bun run db:migrate` | Run dev migrations |
| `db:migrate:deploy` | `bun run db:migrate:deploy` | Deploy migrations (production) |
| `db:studio` | `bun run db:studio` | Open Prisma Studio |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
