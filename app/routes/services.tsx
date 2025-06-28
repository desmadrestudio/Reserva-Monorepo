import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { Link } from "@remix-run/react";

const SERVICES = [
  { id: "svc1", name: "Service A1" },
  { id: "svc2", name: "Service A2" },
  { id: "svc3", name: "Service B1" },
  { id: "svc4", name: "Service B2" },
];

export default function Services() {
  return (
    <Page title="Services">
      <Layout>
        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {SERVICES.map((svc) => (
              <Card key={svc.id} sectioned>
                <Text variant="headingSm" as="h3">
                  {svc.name}
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <Link to={`/booking?serviceId=${svc.id}`} prefetch="intent">
                    <Button primary fullWidth>Book Service</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  return (
    <Page title="Error">
      <Card sectioned>Something went wrong.</Card>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Error">
      <Card sectioned>Something went wrong.</Card>
    </Page>
  );
}
