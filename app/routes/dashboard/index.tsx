import { Outlet, useNavigation, useRouteError } from "@remix-run/react";
import { Page, Layout, Card } from "@shopify/polaris";

export default function DashboardIndex() {
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Page>
        <Layout>
          <Card sectioned>Loading...</Card>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Dashboard Home">
      <Layout>
        <Card sectioned>Welcome to Dashboard</Card>
        <Outlet />
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Page title="Error">
      <Layout>
        <Card sectioned>{error ? String(error) : "Unknown error"}</Card>
      </Layout>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Error">
      <Layout>
        <Card sectioned>Something went wrong.</Card>
      </Layout>
    </Page>
  );
}