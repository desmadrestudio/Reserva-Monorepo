import {
  Link,
  Outlet,
  useLoaderData,
  useRouteError,
  type LoaderFunctionArgs,
  type HeadersFunction,
  type LinksFunction,
} from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "~/shopify.server";

// ✅ CSS Link Loader
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: polarisStyles },
];

// ✅ Auth + API key
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
  };
};

// ✅ Component
export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// ✅ Remix Error Boundary
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

// ✅ Remix Headers Pass-through
export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};