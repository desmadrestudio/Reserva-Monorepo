import { Page, Layout, Card } from "@shopify/polaris";

export default function AppointmentsIndex() {
  return (
    <Page title="Appointments">
      <Layout>
        <Card sectioned>
          <p>
            This is the Appointments landing page. Use the sidebar to navigate
            further.
          </p>
        </Card>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Page title="Error">
      <Layout>
        <Card sectioned>{error.message}</Card>
      </Layout>
    </Page>
  );
}