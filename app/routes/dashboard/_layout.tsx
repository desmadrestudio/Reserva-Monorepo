import { Outlet, useRouteError } from "@remix-run/react";
import { Page, Layout, Card } from "@shopify/polaris";

export default function DashboardLayout() {
  return (
    <Page title="Dashboard">
      <Layout>
        <Card sectioned>
          <Outlet />
        </Card>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Page title="Error">
      <Card sectioned>{error ? String(error) : "Unknown error"}</Card>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Error">
      <Card sectioned>Something went wrong.</Card>
    </Page>
  );
}
