import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function PaymentsPage() {
  return (
    <Page title="Payments &amp; Invoices">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Payments &amp; Invoices page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}