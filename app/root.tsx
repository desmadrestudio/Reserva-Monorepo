import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import * as Polaris from "@shopify/polaris";
import { HomeIcon } from "@shopify/polaris-icons";
import { Link } from "@remix-run/react";
import "@shopify/polaris/build/esm/styles.css";

import styles from "./styles/global.css";
import MobileTabBar from "./ui/MobileTabBar"; // 🔄 updated path after ui refactor
import { CartProvider } from "./ui/CartProvider"; // 🔄 updated path after ui refactor
import { BookingCartProvider } from "./ui/BookingCartProvider"; // 🔄 updated path after ui refactor

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

const i18n = {
  Polaris: {
    Avatar: {
      label: "Avatar",
      labelWithInitials: "Avatar with initials {initials}",
    },
    Frame: {
      skipToContent: "Skip to content",
    },
  },
};

// ✅ Custom link component to integrate Remix with Polaris
const CustomLink = ({ url, external, ...rest }: any) => {
  if (external) return <a href={url} {...rest} />;
  return <Link to={url} {...rest} />;
};

function SidebarNav() {
  const { pathname } = useLocation();
  const items = [
    { label: "Home", to: "/" },
    { label: "Calendar", to: "/calendar" },
    { label: "Checkout", to: "/checkout" },
    { label: "Services", to: "/services" },
    { label: "Memberships & Rewards", to: "/memberships" },
    { label: "Payments & Invoices", to: "/payments" },
    { label: "Customers", to: "/customers" },
    { label: "Reports", to: "/reports" },
    { label: "Staff", to: "/staff" },
    { label: "Settings", to: "/settings" },
  ];
  const sectionItems = items.map((it) => ({
    label: it.label,
    url: it.to,
    selected: it.to === "/" ? pathname === "/" : pathname.startsWith(it.to),
  }));
  return (
    <Polaris.Navigation location={pathname}>
      <Polaris.Navigation.Section items={sectionItems} />
    </Polaris.Navigation>
  );
}

function GlobalHomeButton() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "76px", // keep above MobileTabBar
        right: "16px",
        zIndex: 500,
      }}
    >
      <Polaris.Tooltip content="Home">
        <Polaris.Button icon={HomeIcon} accessibilityLabel="Go to home" url="/" />
      </Polaris.Tooltip>
    </div>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {/* ✅ Now Polaris will use Remix's Link for client-side nav */}
        <BookingCartProvider>
          <CartProvider>
            <Polaris.AppProvider i18n={i18n} linkComponent={CustomLink}>
              <Polaris.Frame navigation={<SidebarNav />}>
                <GlobalHomeButton />
                <Outlet />
                <MobileTabBar />
              </Polaris.Frame>
            </Polaris.AppProvider>
          </CartProvider>
        </BookingCartProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
