import * as Polaris from "@shopify/polaris";

const { Page, Layout, Card } = Polaris;

export default function PublicIndexPage() {
  return (
    <Page title="Public">
      <Layout>
        <Card sectioned>Select an option from the menu.</Card>
      </Layout>
    </Page>
  );
}
