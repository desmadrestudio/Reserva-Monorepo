import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card, Text } = Polaris;

const dummyUnits = [
  { id: "u1", name: "Piece" },
  { id: "u2", name: "Hour" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json({ units: dummyUnits });
};

export default function UnitsPage() {
  const { units } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Units">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Units">
            {units.map((u) => (
              <Text key={u.id}>{u.name}</Text>
            ))}
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
