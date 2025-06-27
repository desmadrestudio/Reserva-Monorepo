import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import * as Polaris from "@shopify/polaris";
import { Link } from "@remix-run/react";
import "@shopify/polaris/build/esm/styles.css";

import styles from "./styles/global.css";
import MobileTabBar from "./components/MobileTabBar";
import { desktopNavigation } from "./config/navigation";

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
const CustomLink = ({ url, external, ...rest }: Polaris.LinkLikeComponentProps) => {
  if (external) return <a href={url} {...rest} />;
  return <Link to={url} {...rest} />;
};

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
        <Polaris.AppProvider i18n={i18n} linkComponent={CustomLink}>
          <Polaris.Frame
            navigation={
              <Polaris.Navigation location="/">
                <Polaris.Navigation.Section
                  items={desktopNavigation}
                />
              </Polaris.Navigation>
            }
          >
            <Outlet />
            <MobileTabBar />
          </Polaris.Frame>
        </Polaris.AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
