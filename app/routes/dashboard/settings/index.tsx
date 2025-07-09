// This route was migrated from a dot-route to a folder-based structure for better scalability.
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
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
                  <Polaris.Link url={getAppUrl("/dashboard/services")}>
                    Services
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/memberships")}>
                    Memberships & Rewards
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/online-booking")}>
                    Online Booking
                  </Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/marketplace")}>Marketplace</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/waitlist")}>Waitlist</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/notifications")}>Notifications</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/invoices")}>Invoices</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/transactions")}>Transactions</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/orders")}>Orders</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/reports")}>Reports</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/banking")}>Banking</Polaris.Link>
                </List.Item>
                <List.Item>
                  <Polaris.Link url={getAppUrl("/dashboard/addons")}>Add-ons</Polaris.Link>
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
