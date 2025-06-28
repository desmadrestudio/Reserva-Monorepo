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
    prisma.service.findMany({
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        category: true,
      },
    }),
    id
      ? prisma.service.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            category: true,
            notes: true,
          },
        })
      : Promise.resolve(null),
  ]);
  return json({ services, service });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent")?.toString();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const durationRaw = formData.get("duration")?.toString();
  const priceRaw = formData.get("price")?.toString();
  const category = formData.get("category")?.toString().trim();

  if (intent === "delete" && id) {
    await prisma.service.delete({ where: { id } });
    return json({ success: true });
  }

  if (!name || !durationRaw) {
    return json({ error: "Name and duration are required" }, { status: 400 });
  }

  const duration = Number(durationRaw);
  const price = priceRaw ? Number(priceRaw) : null;

  if (id) {
    await prisma.service.update({
      where: { id },
      data: { name, duration, price, category, notes: description },
    });
  } else {
    await prisma.service.create({
      data: { name, duration, price, category, notes: description },
    });
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
                label="Description"
                name="description"
                defaultValue={service?.notes ?? ''}
                multiline
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                prefix="$"
                defaultValue={service?.price?.toString() ?? ''}
              />
              <TextField
                label="Duration (mins)"
                name="duration"
                type="number"
                defaultValue={service?.duration?.toString()}
                required
              />
              <TextField
                label="Category"
                name="category"
                defaultValue={service?.category ?? ''}
              />
              <Button submit primary loading={navigation.state === "submitting"}>
                Save
              </Button>
            </Form>
          </Card>
          <Card sectioned title="Services">
            {services.length === 0 ? (
              <Text>No services found.</Text>
            ) : (
              <Polaris.IndexTable
                resourceName={{ singular: "service", plural: "services" }}
                itemCount={services.length}
                headings={[
                  { title: "Name" },
                  { title: "Duration" },
                  { title: "Price" },
                  { title: "Category" },
                  { title: "Actions" },
                ]}
              >
                {services.map((svc, index) => (
                  <Polaris.IndexTable.Row
                    id={svc.id}
                    key={svc.id}
                    position={index}
                  >
                    <Polaris.IndexTable.Cell>{svc.name}</Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      {svc.duration} mins
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      {svc.price ? `$${svc.price.toFixed(2)}` : "$0.00"}
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      {svc.category ?? "Uncategorized"}
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      <Polaris.InlineStack gap="2">
                        <Button url={`?id=${svc.id}`} size="slim">
                          Edit
                        </Button>
                        <Form method="post">
                          <input type="hidden" name="id" value={svc.id} />
                          <input type="hidden" name="intent" value="delete" />
                          <Button submit destructive size="slim">
                            Delete
                          </Button>
                        </Form>
                      </Polaris.InlineStack>
                    </Polaris.IndexTable.Cell>
                  </Polaris.IndexTable.Row>
                ))}
              </Polaris.IndexTable>
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
