import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Reserva Home" }];
};

export const loader: LoaderFunction = async () => {
  return json({ userName: "Johnny" });
};

export default function Home() {
  const data = useLoaderData<{ userName: string }>();

  return (
    <Page title="Reserva Home">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              Welcome back{data.userName ? `, ${data.userName}` : ""}!
            </Text>

            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Button url="/dashboard" primary>
                Go to Dashboard
              </Button>
              <Button url="/appointments/new">Book New Appointment</Button>
              <Button url="/dashboard/appointments" plain>
                View All Appointments
              </Button>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}