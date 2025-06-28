import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/lib/prisma.server";

const { Page, Layout, Card, TextField, Button, Banner, Text } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const url = new URL(request.url);
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
          <Card sectioned title={unit ? "Edit Unit" : "Add Unit"}>
            <Form method="post">
              {actionData?.error && (
                <Banner status="critical">{actionData.error}</Banner>
              )}
              {actionData?.success && (
                <Banner status="success">Saved.</Banner>
              )}
              <input type="hidden" name="id" value={unit?.id ?? ""} />
              <TextField label="Name" name="name" defaultValue={unit?.name} required />
              <Button submit primary loading={navigation.state === "submitting"}>Save</Button>
            </Form>
          </Card>
          <Card sectioned title="Units">
            {units.map((u) => (
              <Text key={u.id} as="span">
                {u.name}{" "}
                <Button url={`?id=${u.id}`} size="slim">
                  Edit
                </Button>
              </Text>
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
