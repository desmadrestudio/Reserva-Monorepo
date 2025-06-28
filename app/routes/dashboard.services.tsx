import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/lib/prisma.server";

const { Page, Layout, Card, TextField, Button, Banner, Text, Stack } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const services = await prisma.service.findMany();
  return json({ services });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name")?.toString().trim();
  const price = formData.get("price")?.toString();
  const duration = formData.get("duration")?.toString();
  const variantId = formData.get("variantId")?.toString() || undefined;

  if (!name || !duration) {
    return json({ error: "Name and duration are required" }, { status: 400 });
  }

  await prisma.service.create({
    data: {
      name,
      duration: Number(duration),
      price: price ? Number(price) : undefined,
      variantId,
    },
  });

  return json({ success: true });
};

export default function DashboardServices() {
  const { services } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <Page title="Manage Services">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Add Service">
            <Form method="post">
              <Stack vertical spacing="tight">
                {actionData?.error && (
                  <Banner status="critical">{actionData.error}</Banner>
                )}
                {actionData?.success && (
                  <Banner status="success">Service added.</Banner>
                )}
                <TextField label="Name" name="name" required />
                <TextField label="Price" name="price" type="number" />
                <TextField label="Duration (mins)" name="duration" type="number" required />
                <TextField label="Variant ID" name="variantId" />
                <Button submit primary loading={navigation.state === "submitting"}>
                  Save
                </Button>
              </Stack>
            </Form>
          </Card>
          <Card sectioned title="Existing Services">
            {services.length === 0 ? (
              <Text>No services found.</Text>
            ) : (
              <Stack vertical spacing="tight">
                {services.map((svc) => (
                  <Text key={svc.id}>{svc.name} - {svc.duration} mins</Text>
                ))}
              </Stack>
            )}
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
