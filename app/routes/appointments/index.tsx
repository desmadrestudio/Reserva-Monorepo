import * as Polaris from "@shopify/polaris";

const { Page, Layout, Card } = Polaris;

export default function AppointmentsIndexPage() {
  return (
    <Page title="Appointments">
      <Layout>
        <Card sectioned>Select an option from the menu.</Card>
      </Layout>
    </Page>
  );
}
