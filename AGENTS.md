# AGENTS.md – Dev Conventions for AI Tools and Human Assistants

You are working inside a Shopify App using Remix, Polaris, and Prisma.

---

## ✳️ Do

- Use `@shopify/polaris` for all UI — import as:  
  `import * as Polaris from "@shopify/polaris"`
- Structure every page inside:  
  `<Page> → <Layout> → <Card>`
- Use Prisma client from:  
  `app/lib/prisma.server.ts`
 - Use Prisma schema from:
  `prisma/schema.prisma`
- Default DB is SQLite (file-based)
- Use `typeof window !== "undefined"` to guard browser-only logic
- For nested routes, use a parent `layout.tsx` file exporting `<Outlet />`
- Route folders must include an `index.tsx` for default path

---

## 🚫 Don’t

- ❌ Don’t use Tailwind, Bootstrap, or raw HTML unless explicitly requested
- ❌ Don’t use SSR-only packages like `react-dom/server` (Shopify Admin breaks)
- ❌ Don’t assume `window` or `document` is available on the server

---

## 🧠 Prompt Examples for Codex/Copilot

- ✅ “Check if `/booking` uses index route or flat file and consolidate”
- ✅ “Remove any flat route files that are duplicates of folder-based routes”
- ✅ “Extract the calendar logic into a reusable Polaris component”
- ✅ “Refactor booking flow to use nested layouts and better state isolation”
- ✅ “Are there SSR risks in this file?”
- ✅ “Show me all Prisma queries touching the `Appointment` model”

---

## 📌 If unsure...

Leave a `TODO:` comment or write to `/app/TODO.md`  
Codex will check it on the next run.
