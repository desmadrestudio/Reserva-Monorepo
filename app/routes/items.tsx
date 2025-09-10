import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function ItemsPage() {
  return (
    <Page title="Items">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Items page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}