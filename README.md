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
│       ├── app/                  # Remix app logic
│       │   ├── lib/              # prisma.server.ts, shopify.server.ts
│       │   ├── ui/               # All UI components (was 'components')
│       │   │   ├── dashboard.ui/
│       │   │   └── shared/
│       │   ├── routes/           # File-based routes
│       │   └── styles/           # Global CSS
│       ├── prisma/               # Prisma schema & migrations
│       └── public/               # Static assets
├── extensions/                   # Future Shopify app extensions
├── packages/                     # Shared libraries (optional)
├── AGENTS.md                     # AI agent conventions
├── .env                          # Environment variables
└── README.md
```

---

## ⚙️ Setup Instructions

```bash
cd apps/reserva-ui

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run DB migration
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

Then visit: `http://localhost:3000`

---

## 🔐 .env Variables

```env
SHOPIFY_API_KEY=your-key
SHOPIFY_API_SECRET=your-secret
SHOPIFY_APP_URL=http://localhost:3000
SESSION_SECRET=some-random-string
DATABASE_URL="file:./dev.sqlite"
```

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
npx shopify app config push
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

## 🧪 Local Dev Commands

```bash
npm run dev                 # Start dev server
npx prisma generate         # Generate Prisma client
npx prisma migrate dev      # Run migrations
npx prisma studio           # DB browser
```

---

## 🛡 License

© 2025 Desmadre Studio. All rights reserved.  
Unauthorized reproduction or distribution is prohibited.
