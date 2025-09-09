# 🛀 Reserva – Shopify Booking App (Polaris + Remix)

Reserva is a full-stack Shopify booking app using **Remix**, **Shopify Polaris**, and **Prisma ORM**. It supports calendar-based bookings, session management, and Shopify OAuth. Built for scalability, developer speed, and AI-powered automation.

---

## 🧱 Tech Stack

| Layer        | Tool/Framework                   |
|--------------|----------------------------------|
| Frontend     | Remix v2 + Vite                  |
| UI           | Shopify Polaris (No Tailwind)    |
| Backend      | Node.js + Prisma ORM             |
| Database     | SQLite (Dev) / PostgreSQL (Prod) |
| Auth         | Shopify OAuth + Sessions         |
| Deployment   | Render / Local                   |
| Dev Tools    | ESLint, Prettier, Codex/Copilot  |

---

## 📂 Project Layout

```
/
├── apps/
│   └── reserva-ui/
│       ├── app/
│       │   ├── lib/
│       │   ├── ui/
│       │   │   ├── dashboard/
│       │   │   ├── booking/
│       │   │   └── shared/
│       │   ├── components/
│       │   ├── routes/
│       │   └── styles/
│       ├── prisma/
│       └── public/
├── extensions/
├── packages/
├── AGENTS.md
├── .env
└── README.md
```

---

## ⚙️ Setup Instructions

```bash
cd apps/reserva-ui
pnpm install
pnpm dlx prisma generate
pnpm dlx prisma migrate dev --name init
pnpm dev
```

Then visit: `http://localhost:3000`

---

## 🔐 .env Variables

```env
SHOPIFY_API_KEY=your-key
SHOPIFY_API_SECRET=your-secret
SHOPIFY_APP_URL=http://localhost:3000
SESSION_SECRET=some-32-char-unpredictable-string
DATABASE_URL="file:./dev.sqlite"
```

---

## 📁 Route & Layout Best Practices

- ✅ Use nested folders for domain-specific flows (e.g., `/dashboard/`, `/booking/`)
- ✅ Every folder must include `index.tsx` to expose the path
- ✅ Shared layouts live in `/app/components/layout/` and are injected via `root.tsx`
- ❌ Avoid mixing flat `.tsx` routes at the root — place them under meaningful folders
- ❗ Dynamic segments use `$param.tsx` and require proper parent route file

---

## 🔒 Environment Security Checklist

- `SESSION_SECRET` must be **32+ characters**, unpredictable, and not committed
- Validate `.env` values using:

```ts
if (!process.env.SESSION_SECRET) throw new Error("Missing SESSION_SECRET");
```

- Avoid `window`/`document` inside `loader()` or `action()` — use `typeof window !== "undefined"`

---

## 🧩 Polaris & App Bridge Tips

- Wrap UI in:

```tsx
<AppProvider>
  <LayoutComponent>
    <Outlet />
  </LayoutComponent>
</AppProvider>
```

- Use `@shopify/app-bridge-react` to ensure embedded navigation works consistently

---

## 🌐 Declarative App Configuration

Shopify Declarative App Capabilities (`DAC`) are defined in:

```toml
# shopify.app.toml
[access_scopes]
scopes = "read_products,write_products"

[[extensions]]
type = "admin_link"
title = "Dashboard"
url = "/dashboard"

[[extensions]]
type = "admin_link"
title = "Book Appointment"
url = "/appointments/new"
```

Push updates with:

```bash
pnpm dlx @shopify/cli@latest app config push
```

---

## 💄 Polaris UI Example

```tsx
import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function Dashboard() {
  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="bodyMd">
              Welcome to your embedded booking dashboard.
            </Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
```

---

## 📅 Booking Flow (MVP Goals)

- [x] Polaris + Prisma stack initialized
- [x] OAuth setup with embedded admin
- [ ] Month calendar with booking count
- [ ] View bookings by day
- [ ] Create appointment via modal
- [ ] Filter/search by customer
- [ ] Confirm flow for staff assignment

---

## 🧠 AI Automation Rules (Codex/Copilot)

- ✅ Use **Polaris only** for UI (no Tailwind)
- 📁 All UI goes into `/app/ui/`
- 📚 Access DB via `lib/prisma.server.ts`
- 🔬 Schema is in `/prisma/schema.prisma`
- 🔒 SSR-safe: Guard browser logic with `typeof window !== "undefined"`
- ⚠️ Avoid SSR-only packages
- 🧩 Follow Remix's loader/action + file-based routing
- 📎 If unsure, leave a TODO or write to `app/TODO.md`

---

## 🧪 Local Dev Commands

```bash
pnpm dev                    # Start dev server
pnpm test                   # Run unit tests
pnpm dlx prisma generate    # Generate Prisma client
pnpm dlx prisma migrate dev # Run migrations
pnpm dlx prisma studio      # DB browser
```

---

## 🆕 Shopify CLI (Next-Gen)

Shopify apps now require the Next-Gen CLI for deploying and running dev environments.

```bash
# one-time setup for mapping extensions
pnpm dlx @shopify/cli@latest app deploy

# start your local dev environment
pnpm dlx @shopify/cli@latest app dev
```

---

## 🛡 License

© 2025 Desmadre Studio. All rights reserved.  
Unauthorized reproduction or distribution is prohibited.