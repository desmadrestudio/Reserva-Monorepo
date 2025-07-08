import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card, Navigation } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json({});
};

export default function ItemsAndServicesIndex() {
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Items & Services">
      <Layout>
        <Layout.Section>
          <Navigation location="dashboard/items">
            <Navigation.Section
              items={[
                { url: "dashboard/items/all-items", label: "All Items" },
                { url: "dashboard/items/resources", label: "Resources" },
                { url: "dashboard/items/categories", label: "Categories" },
                { url: "dashboard/items/modifiers", label: "Modifiers" },
                { url: "dashboard/items/discounts", label: "Discounts" },
                { url: "dashboard/items/options", label: "Options" },
                { url: "dashboard/items/units", label: "Units" },
              ]}
            />
          </Navigation>
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
