import * as Polaris from "@shopify/polaris";

const { Page, Layout, Card } = Polaris;

export default function ClassesIndexPage() {
  return (
    <Page title="Classes">
      <Layout>
        <Card sectioned>Select an option from the menu.</Card>
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
