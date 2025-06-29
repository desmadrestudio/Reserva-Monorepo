# 🛀 Reserva – Shopify Booking App (Polaris + Remix)

Reserva is a full-stack Shopify booking app using **Remix**, **Shopify Polaris**, and **Prisma ORM**. It supports calendar-based bookings, session management, and Shopify OAuth. Built with scalability, agent automation, and a clean monorepo layout.

---

## 🧱 Tech Stack

| Layer       | Tool/Framework                   |
|-------------|----------------------------------|
| Frontend    | Remix v2 + Vite                  |
| UI          | Shopify Polaris (No Tailwind)    |
| Backend     | Node.js + Prisma ORM             |
| DB          | SQLite (Dev) / PostgreSQL (Prod) |
| Auth        | Shopify OAuth + Sessions         |
| Deployment  | Local / Render (recommended)     |

---

## 📂 Project Layout

```
/
├── apps/
│   └── reserva-ui/
│       ├── app/                  # Remix app logic
│       │   ├── lib/              # prisma.server.ts, shopify.server.ts
│       │   ├── components/       # Polaris components
│       │   ├── routes/           # Route handlers
│       │   └── styles/           # App CSS (if needed)
│       ├── prisma/               # Prisma schema + migrations
│       └── public/               # Static assets
├── extensions/                   # Future Shopify app extensions (POS, checkout, etc.)
├── packages/                     # Shared UI/components (optional)
├── .env                          # Environment config
├── README.md
└── ...
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

Then visit `http://localhost:3000`

---

## 🔐 .env Variables

Create `.env` file in `apps/reserva-ui` with:

```env
SHOPIFY_API_KEY=your-key
SHOPIFY_API_SECRET=your-secret
SHOPIFY_APP_URL=http://localhost:3000
SESSION_SECRET=some-random-string
DATABASE_URL="file:./dev.sqlite"
```

---

## 🧠 AI Automation Rules (Codex/Copilot)

- ✅ Use **Polaris only** for all UI. No Tailwind.
- 🔁 Keep everything scoped to `/apps/reserva-ui`
- 📚 Use `/app/lib/prisma.server.ts` for accessing Prisma Client
- 🧬 Prisma schema lives in `/apps/reserva-ui/prisma/schema.prisma`
- 🔒 Don’t delete or overwrite files unless told
- 🧩 Reuse existing patterns and follow `/app/components/` layout
- ⚠️ SSR safety: Use `typeof window !== "undefined"` for client-only logic
- ❗ Avoid SSR-only packages like `react-dom/server` in embedded Shopify Admin
- 📋 If unsure, leave a `TODO:` and log it in `TODO.md`

---

## 📌 Prisma Schema

Located in: `apps/reserva-ui/prisma/schema.prisma`

```prisma
model Appointment {
  id        String   @id @default(cuid())
  shop      String
  date      DateTime
  time      String
  customer  String
  notes     String?
  createdAt DateTime @default(now())
}

model Session {
  id            String    @id
  shop          String
  state         String
  isOnline      Boolean   @default(false)
  scope         String?
  expires       DateTime?
  accessToken   String
  userId        BigInt?
  firstName     String?
  lastName      String?
  email         String?
  accountOwner  Boolean   @default(false)
  locale        String?
  collaborator  Boolean?  @default(false)
  emailVerified Boolean?  @default(false)
}
```

---

## 🧪 Local Development Commands

```bash
npm run dev                   # Start local server
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Run migrations
npx prisma studio             # Visual DB browser
```

## 🌐 Declarative App Configuration

This app uses Shopify's Declarative App Capabilities. Update `shopify.app.toml`
to change OAuth scopes or add Admin UI links. Push config changes with
`npx shopify app config push`.

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

- [x] Prisma + Polaris stack working
- [ ] Month calendar with booking count
- [ ] View daily bookings on click
- [ ] Create new booking with modal
- [ ] Search/filter by customer
- [ ] Show upcoming bookings below calendar

---

## 🧠 Tips for Agents (Codex/Copilot)

- All Polaris UI code lives in `/app/components/`
- Data fetching uses `lib/prisma.server.ts`
- Follow Remix loader/action conventions
- Never assume Tailwind is available
- Bookings are always scoped by `shop`

---
## 🛡 License

© 2025 Desmadre Studio. All rights reserved.  
Unauthorized reproduction or distribution is prohibited.
