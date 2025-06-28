import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/lib/prisma.server";

const { Page, Layout, Card, Text } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const discounts = await prisma.discount.findMany({ select: { id: true, name: true } });
  return json({ discounts });
};

export default function DiscountsPage() {
  const { discounts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Discounts">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Discounts">
            {discounts.map((d) => (
              <Text key={d.id}>{d.name}</Text>
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
