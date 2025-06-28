import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card, List, Text } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json({ shopName: "Marbella's Massage" });
};

export default function SettingsPage() {
  const { shopName } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
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
                  <Polaris.Link url="/dashboard/services">
                    Items & Services
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/memberships">
                    Memberships & Rewards
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/online-booking">
                    Online Booking
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/marketplace">Marketplace</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/waitlist">Waitlist</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/notifications">Notifications</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/invoices">Invoices</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/transactions">Transactions</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/orders">Orders</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/reports">Reports</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/banking">Banking</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url="/dashboard/addons">Add-ons</Polaris.Link>
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
