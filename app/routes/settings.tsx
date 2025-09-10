import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function SettingsPage() {
  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text as="p">This is the Settings page.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}