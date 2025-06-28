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
  const [modifiers, modifier] = await Promise.all([
    prisma.modifier.findMany({ select: { id: true, name: true } }),
    id ? prisma.modifier.findUnique({ where: { id } }) : Promise.resolve(null),
  ]);
  return json({ modifiers, modifier });
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
    await prisma.modifier.update({ where: { id }, data: { name } });
  } else {
    await prisma.modifier.create({ data: { name } });
  }

  return json({ success: true });
};

export default function ModifiersPage() {
  const { modifiers, modifier } = useLoaderData<typeof loader>();
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
    <Page title="Modifiers">
      <Layout>
        <Layout.Section>
          <Card sectioned title={modifier ? "Edit Modifier" : "Add Modifier"}>
            <Form method="post">
              {actionData?.error && (
                <Banner status="critical">{actionData.error}</Banner>
              )}
              {actionData?.success && (
                <Banner status="success">Saved.</Banner>
              )}
              <input type="hidden" name="id" value={modifier?.id ?? ""} />
              <TextField label="Name" name="name" defaultValue={modifier?.name} required />
              <Button submit primary loading={navigation.state === "submitting"}>Save</Button>
            </Form>
          </Card>
          <Card sectioned title="Modifiers">
            {modifiers.map((mod) => (
              <Text key={mod.id} as="span">
                {mod.name}{" "}
                <Button url={`?id=${mod.id}`} size="slim">
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
