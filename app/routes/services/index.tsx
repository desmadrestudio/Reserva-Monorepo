// app/routes/services/index.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError, Link as RemixLink, Outlet } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";

type LoaderData = {
  services: Array<{
    id: string;
    name: string;
    category: string | null;
    basePrice: number; // cents
    baseMinutes: number | null;
    updatedAt: Date | null;
  }>;
};

export const loader = async (_: LoaderFunctionArgs) => {
  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      basePrice: true,
      baseMinutes: true,
      updatedAt: true,
    },
  });
  return json<LoaderData>({ services });
};

export default function ServicesIndex() {
  const { services } = useLoaderData<LoaderData>();

  return (
    <Polaris.Page title="Services" primaryAction={{ content: "Create service", url: "/services/new" }}>
      <Polaris.Layout>
        <Polaris.Layout.Section>
          {services.length === 0 ? (
            <Polaris.Card>
              <Polaris.BlockStack gap="300" padding="400">
                <Polaris.Text variant="headingMd">No services yet</Polaris.Text>
                <Polaris.Text tone="subdued">
                  Create your first service to start taking bookings.
                </Polaris.Text>
                <Polaris.Button primary url="/services/new">Create service</Polaris.Button>
              </Polaris.BlockStack>
            </Polaris.Card>
          ) : (
            <Polaris.Card>
              <Polaris.IndexTable
                resourceName={{ singular: "service", plural: "services" }}
                itemCount={services.length}
                selectable={false}
                headings={[
                  { title: "Name" },
                  { title: "Category" },
                  { title: "Base price" },
                  { title: "Default minutes" },
                  { title: "Updated" },
                ]}
              >
                {services.map((svc, idx) => (
                  <Polaris.IndexTable.Row id={svc.id} key={svc.id} position={idx}>
                    <Polaris.IndexTable.Cell>
                      <RemixLink to={`/services/${svc.id}`} style={{ textDecoration: "none" }}>
                        <Polaris.Text as="span" variant="bodyMd" fontWeight="medium">
                          {svc.name}
                        </Polaris.Text>
                      </RemixLink>
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>{svc.category ?? "—"}</Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format((svc.basePrice ?? 0) / 100)}
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>{svc.baseMinutes ?? "—"}</Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      {svc.updatedAt ? new Date(svc.updatedAt).toLocaleString() : "—"}
                    </Polaris.IndexTable.Cell>
                  </Polaris.IndexTable.Row>
                ))}
              </Polaris.IndexTable>
            </Polaris.Card>
          )}
        </Polaris.Layout.Section>
      </Polaris.Layout>
          {/* Child routes (e.g., /services/new) render here */
      <Outlet />
    </Polaris.Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as any;
  const message =
    (typeof error === "string" && error) ||
    error?.message ||
    "Something went wrong.";
  return (
    <Polaris.Page title="Services">
      <Polaris.Card sectioned>
        <Polaris.Text variant="headingMd">Route error</Polaris.Text>
        <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>
      </Polaris.Card>
          {/* Child routes (e.g., /services/new) render here */
      <Outlet />
    </Polaris.Page>
  );
}

export function CatchBoundary() {
  return (
    <Polaris.Page title="Not found">
      <Polaris.Card sectioned>Page not found.</Polaris.Card>
          {/* Child routes (e.g., /services/new) render here */
      <Outlet />
    </Polaris.Page>
  );
}
