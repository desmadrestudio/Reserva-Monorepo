import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function ReportsPage() {
  return (
    <Page title="Reports">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Reports page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}