# AGENTS.md – Dev Conventions for AI Tools and Human Assistants

You are working inside a Shopify App using Remix, Polaris, and Prisma.

---

## ✳️ Do

- Use `@shopify/polaris` for all UI — import components directly:  
  ```ts
  import { Page, Layout, Card } from "@shopify/polaris"
  ```
- Structure every Polaris page as:  
  `<Page> → <Layout> → <Card>`
- Use the Prisma client from:  
  `app/lib/prisma.server.ts`
- Use the Prisma schema from:  
  `prisma/schema.prisma`
- Default dev database is SQLite (file-based)
- Guard browser-only logic with:
  ```ts
  if (typeof window !== "undefined") {
    // browser-safe logic here
  }
  ```
- Use `layout.tsx` only in route folders that require nested layout behavior.  
  Prefer shared layouts in `/app/components/layout/` and inject via `root.tsx`.
- All route folders **must** contain an `index.tsx` for default path exposure
- Use `pnpm` for all commands instead of `npm`/`npx` to stay consistent with workspace setup.
- Run Shopify CLI commands via `pnpm dlx @shopify/cli@latest app dev` or `app deploy` (Next-Gen) instead of older `shopify app dev`.
- Document monorepo awareness: main app is in `apps/reserva-ui/`; supporting packages and extensions live under `packages/` and `extensions/`.
- Always export `ErrorBoundary` and `CatchBoundary` in route files to handle Remix errors gracefully.

---

## 🚫 Don’t

- ❌ Don’t use Tailwind, Bootstrap, or raw HTML unless explicitly requested
- ❌ Don’t use SSR-only packages like `react-dom/server` (Shopify Admin breaks)
- ❌ Don’t access `window` or `document` in `loader()` or `action()` functions

---

## 🧠 Prompt Examples for Codex/Copilot

- ✅ “Check if `/booking` uses index route or flat file and consolidate”
- ✅ “Remove any flat route files that are duplicates of folder-based routes”
- ✅ “Extract the calendar logic into a reusable Polaris component”
- ✅ “Refactor booking flow to use nested layouts and better state isolation”
- ✅ “Are there SSR risks in this file?”
- ✅ “Show me all Prisma queries touching the `Appointment` model”
- ✅ “Check for layout.tsx shadowing root layout”
- ✅ “Collapse any folders that contain only `index.tsx`”
- ✅ “Audit SSR safety across all route loader() functions”

---

## 📡 Codex Watches These Files:

- `AGENTS.md`
- `TODO.md`
- `routes/` (structure and file names)
- `layout/` (shared layouts)
- `prisma/schema.prisma`

---

## 📌 If unsure...

Leave a `TODO:` comment in code  
_or_ add a line in `/app/TODO.md` — Codex will check it on the next run.