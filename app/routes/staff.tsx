import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function StaffPage() {
  return (
    <Page title="Staff">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Staff page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}