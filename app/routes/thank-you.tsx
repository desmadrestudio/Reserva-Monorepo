// /app/routes/thank-you.tsx
import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function ThankYouPage() {
  return (
    <Page title="Thank You!">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd">🎉 Booking Confirmed!</Text>
            <Text>Your appointment has been saved. You’ll receive a confirmation soon.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}