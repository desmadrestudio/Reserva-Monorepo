// This route was migrated from a dot-route to a folder-based structure for better scalability.
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { useCallback } from "react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/lib/prisma.server";

const {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Banner,
  Text,
  Stack,
  DropZone,
  Select,
  Checkbox,
} = Polaris;

const CATEGORIES = [
  { label: "General", value: "general" },
  { label: "Hair", value: "hair" },
  { label: "Nails", value: "nails" },
];

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
  const priceRaw = formData.get("price")?.toString();
  const duration = formData.get("duration")?.toString();
  const notes = formData.get("notes")?.toString();
  const variantId = formData.get("variantId")?.toString() || undefined;

  if (!name || !duration) {
    return json({ error: "Name and duration are required" }, { status: 400 });
  }

  await prisma.service.create({
    data: {
      name,
      duration: Number(duration),
      price: priceRaw ? Number(priceRaw.replace(/[^0-9.]/g, "")) : undefined,
      variantId,
      notes,
    },
  });

  return json({ success: true });
};

export default function DashboardServices() {
  const { services } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const handleDrop = useCallback(() => {}, []);

  return (
    <Page title="Manage Services">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Add Service">
            <Form method="post" encType="multipart/form-data">
              <Stack vertical spacing="tight">
                {actionData?.error && (
                  <Banner status="critical">{actionData.error}</Banner>
                )}
                {actionData?.success && (
                  <Banner status="success">Service added.</Banner>
                )}
                <DropZone label="Service image" onDrop={handleDrop}>
                  <DropZone.FileUpload />
                </DropZone>
                <TextField label="Name" name="name" required />
                <Select
                  label="Category"
                  name="category"
                  options={CATEGORIES}
                  defaultValue="general"
                />
                <TextField label="Price" name="price" prefix="$" type="text" />
                <Select
                  label="Duration"
                  name="duration"
                  options={[
                    { label: "15 min", value: "15" },
                    { label: "30 min", value: "30" },
                    { label: "45 min", value: "45" },
                    { label: "60 min", value: "60" },
                  ]}
                />
                <Checkbox label="Add Processing Time" name="processingTime" />
                <Checkbox label="Block Extra Time" name="blockExtraTime" />
                <Checkbox label="Requires Resource" name="requiresResource" />
                <TextField label="Variant ID" name="variantId" />
                <TextField label="Notes" name="notes" multiline />
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
