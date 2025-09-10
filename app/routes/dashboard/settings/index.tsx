// This route was migrated from a dot-route to a folder-based structure for better scalability.
import { json, type LoaderFunctionArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card, List, Text } = Polaris;

export const meta: V2_MetaFunction = () => [
  { title: "Settings • Dashboard" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json({ shopName: "Marbella's Massage" });
};

export default function SettingsPage() {
  const { shopName } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoading = navigation.state !== "idle";
  if (isLoading) {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              {shopName}
            </Text>
          </Card>
          <Card>
            <Card.Section>
              <List>
                <List.Item>
                  <Polaris.Link url="/services">
                    Services
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/memberships">
                    Memberships & Rewards
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/booking">
                    Online Booking
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Marketplace (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Waitlist (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Notifications (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Invoices (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Transactions (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Orders (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/reports">Reports</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Banking (coming soon)</Polaris.Text>
                </List.Item>
                <List.Item>
                  <Polaris.Text as="span" tone="subdued">Add-ons (coming soon)</Polaris.Text>
                </List.Item>
              </List>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Page title="Error">
      <Card sectioned>{error ? String(error) : "Unknown error"}</Card>
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
