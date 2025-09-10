import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function MembershipsPage() {
  return (
    <Page title="Memberships &amp; Rewards">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Memberships &amp; Rewards page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}