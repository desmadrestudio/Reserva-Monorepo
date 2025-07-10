import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import CrudFormCard from "~/ui/CrudFormCard";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/lib/prisma.server";
import { getRequestUrl } from "~/utils/url";

const { Page, Layout, Card } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const url = getRequestUrl(request);
  const id = url.searchParams.get("id") || undefined;
  const [units, unit] = await Promise.all([
    prisma.unit.findMany({ select: { id: true, name: true } }),
    id ? prisma.unit.findUnique({ where: { id } }) : Promise.resolve(null),
  ]);
  return json({ units, unit });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!name) {
    return json({ error: "Name is required" }, { status: 400 });
  }

  if (id) {
    await prisma.unit.update({ where: { id }, data: { name } });
  } else {
    await prisma.unit.create({ data: { name } });
  }

  return json({ success: true });
};

export default function UnitsPage() {
  const { units, unit } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
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
          <CrudFormCard
            items={units}
            item={unit}
            singular="Unit"
            plural="Units"
            fieldName="name"
            fieldLabel="Name"
            actionData={actionData}
            submitting={navigation.state === "submitting"}
          />
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
