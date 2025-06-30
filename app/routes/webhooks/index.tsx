import * as Polaris from "@shopify/polaris";

const { Page, Layout, Card } = Polaris;

export default function WebhooksIndexPage() {
  return (
    <Page title="Webhooks">
      <Layout>
        <Card sectioned>Select an option from the menu.</Card>
      </Layout>
    </Page>
  );
}
