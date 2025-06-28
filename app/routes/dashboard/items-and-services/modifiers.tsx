import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card, Text } = Polaris;

const dummyModifiers = [
  { id: "m1", name: "Modifier A" },
  { id: "m2", name: "Modifier B" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json({ modifiers: dummyModifiers });
};

export default function ModifiersPage() {
  const { modifiers } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Modifiers">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Modifiers">
            {modifiers.map((mod) => (
              <Text key={mod.id}>{mod.name}</Text>
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
