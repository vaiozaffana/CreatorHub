# Contributing to CreatorHub

Thank you for your interest in contributing to CreatorHub! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **PostgreSQL** database (we recommend [Supabase](https://supabase.com))
- **Git**

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/creator-hub.git
   cd creator-hub
   ```
3. **Install dependencies:**
   ```bash
   bun install
   ```
4. **Set up environment:** Copy `.env.example` → `.env` and fill in your Supabase credentials
5. **Set up database:**
   ```bash
   bun run db:generate
   bun run db:migrate
   ```
6. **Start dev server:**
   ```bash
   bun run dev
   ```

## Project Structure

```
src/
├── actions/         → Server Actions (auth, products, orders)
├── app/             → Next.js App Router pages & API routes
├── components/      → React components (UI, dashboard, landing)
├── generated/       → Prisma generated client (auto-generated)
├── hooks/           → Custom React hooks
└── lib/             → Utilities (prisma, supabase, auth, storage)
```

## Code Guidelines

- **TypeScript** — All code must be typed. No `any` unless absolutely necessary.
- **Server Components** — Use React Server Components by default, `"use client"` only when needed.
- **Server Actions** — Business logic goes in `src/actions/`, not in components.
- **Naming** — PascalCase for components, camelCase for utilities and hooks.
- **Imports** — Use `@/` path alias for all project imports.

## Git Workflow

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Run checks:
   ```bash
   bun run lint
   bun run typecheck
   bun run build
   ```
4. Commit with conventional commits:
   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`
   - `refactor: restructure code`
5. Push and open a Pull Request

## Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Ensure all checks pass (lint, typecheck, build)
- Keep PRs focused — one feature/fix per PR
- Add screenshots for UI changes

## Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Include browser/environment info
- Add screenshots if applicable

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
