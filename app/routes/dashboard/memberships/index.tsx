// This route was migrated from a dot-route to a folder-based structure for better scalability.
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json(null);
};

import type { V2_MetaFunction } from "@remix-run/node";
export const meta: V2_MetaFunction = () => [{ title: "Memberships & Rewards • Dashboard" }];

export default function MembershipsPage() {
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
    <Page title="Memberships & Rewards">
      <Layout>
        <Layout.Section>
          <Card sectioned>Memberships &amp; Rewards</Card>
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
