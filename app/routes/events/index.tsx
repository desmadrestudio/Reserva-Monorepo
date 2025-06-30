import * as Polaris from "@shopify/polaris";

const { Page, Layout, Card } = Polaris;

export default function EventsIndexPage() {
  return (
    <Page title="Events">
      <Layout>
        <Card sectioned>Select an option from the menu.</Card>
      </Layout>
    </Page>
  );
}
