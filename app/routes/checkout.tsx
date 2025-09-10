import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function CheckoutPage() {
  return (
    <Page title="Checkout">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Checkout page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}