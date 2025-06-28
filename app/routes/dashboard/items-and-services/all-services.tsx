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

const {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Banner,
  Text,
} = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || undefined;
  const [services, service] = await Promise.all([
    prisma.service.findMany({ select: { id: true, name: true, duration: true } }),
    id ? prisma.service.findUnique({ where: { id } }) : Promise.resolve(null),
  ]);
  return json({ services, service });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const durationRaw = formData.get("duration")?.toString();

  if (!name || !durationRaw) {
    return json({ error: "Name and duration are required" }, { status: 400 });
  }

  const duration = Number(durationRaw);

  if (id) {
    await prisma.service.update({ where: { id }, data: { name, duration } });
  } else {
    await prisma.service.create({ data: { name, duration } });
  }

  return json({ success: true });
};

export default function AllServicesPage() {
  const { services, service } = useLoaderData<typeof loader>();
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
    <Page title="All Services">
      <Layout>
        <Layout.Section>
          <Card sectioned title={service ? "Edit Service" : "Add Service"}>
            <Form method="post">
              {actionData?.error && (
                <Banner status="critical">{actionData.error}</Banner>
              )}
              {actionData?.success && (
                <Banner status="success">Saved.</Banner>
              )}
              <input type="hidden" name="id" value={service?.id ?? ""} />
              <TextField
                label="Name"
                name="name"
                defaultValue={service?.name}
                required
              />
              <TextField
                label="Duration (mins)"
                name="duration"
                type="number"
                defaultValue={service?.duration?.toString()}
                required
              />
              <Button submit primary loading={navigation.state === "submitting"}>
                Save
              </Button>
            </Form>
          </Card>
          <Card sectioned title="Services">
            {services.map((svc) => (
              <Text key={svc.id} as="span">
                {svc.name}{" "}
                <Button url={`?id=${svc.id}`} size="slim">
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
