import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError, Link as RemixLink, Outlet } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { centsToDollars } from "~/utils/money";

type ServiceListItem = {
  id: string;
  name: string;
  active: boolean;
  subline: string; // "Multiple Durations" | "<minutes> mins"
  priceCents: number | null; // null when multiple durations
};

type LoaderData = { services: ServiceListItem[] };

export const loader = async (_: LoaderFunctionArgs) => {
  const rows = await prisma.service.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      basePrice: true,
      baseMinutes: true,
      active: true,
      _count: { select: { durations: true } },
      durations: {
        orderBy: { minutes: "asc" },
        take: 1,
        select: { minutes: true, priceDelta: true },
      },
    },
  });

  const services: ServiceListItem[] = rows.map((s) => {
    const count = s._count.durations;
    if (count > 1) {
      return { id: s.id, name: s.name, active: s.active, subline: "Multiple Durations", priceCents: null };
    }
    if (count === 1) {
      const d = s.durations[0]!;
      const priceCents = (s.basePrice ?? 0) + (d?.priceDelta ?? 0);
      return { id: s.id, name: s.name, active: s.active, subline: `${d.minutes} mins`, priceCents };
    }
    // No extra durations: show base
    return {
      id: s.id,
      name: s.name,
      active: s.active,
      subline: `${s.baseMinutes ?? 0} mins`,
      priceCents: s.basePrice ?? 0,
    };
  });

  return json<LoaderData>({ services });
};

export default function ServicesIndex() {
  const { services } = useLoaderData<LoaderData>();

  return (
    <Polaris.Page title="Services" primaryAction={{ content: "Create Service", url: "/services/new" }}>
      <Polaris.Layout>
        <Polaris.Layout.Section>
          {services.length === 0 ? (
            <Polaris.Card>
              <Polaris.BlockStack gap="300">
                <Polaris.Text as="p" variant="headingMd">No services yet</Polaris.Text>
                <Polaris.Text as="p" tone="subdued">Create your first service to start taking bookings.</Polaris.Text>
                <Polaris.Button url="/services/new">Create Service</Polaris.Button>
              </Polaris.BlockStack>
            </Polaris.Card>
          ) : (
            <Polaris.Card>
              <Polaris.IndexTable
                resourceName={{ singular: "service", plural: "services" }}
                itemCount={services.length}
                selectable={false}
                condensed
                headings={[
                  { title: "Service" },
                  { title: "Price" },
                  { title: "Status" },
                  { title: "" },
                ]}
              >
                {services.map((svc, idx) => (
                  <Polaris.IndexTable.Row id={svc.id} key={svc.id} position={idx}>
                    <Polaris.IndexTable.Cell>
                      <Polaris.InlineStack align="start" gap="300">
                        <Polaris.BlockStack gap="050">
                          <RemixLink to={`/services/${svc.id}`} style={{ textDecoration: "none" }}>
                            <Polaris.Text as="span" variant="bodyMd" fontWeight="medium">
                              {svc.name}
                            </Polaris.Text>
                          </RemixLink>
                          <Polaris.Text as="span" tone="subdued" variant="bodySm">
                            {svc.subline}
                          </Polaris.Text>
                        </Polaris.BlockStack>
                      </Polaris.InlineStack>
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      {svc.priceCents == null ? (
                        <Polaris.Text as="span" tone="subdued">—</Polaris.Text>
                      ) : (
                        <Polaris.Text as="span">
                          {Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(centsToDollars(svc.priceCents ?? 0))}
                        </Polaris.Text>
                      )}
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      <Polaris.Badge tone={svc.active ? "success" : "critical"}>
                        {svc.active ? "Active" : "Inactive"}
                      </Polaris.Badge>
                    </Polaris.IndexTable.Cell>
                    <Polaris.IndexTable.Cell>
                      <Polaris.Button url={`/services/${svc.id}`} size="slim">
                        Edit
                      </Polaris.Button>
                    </Polaris.IndexTable.Cell>
                  </Polaris.IndexTable.Row>
                ))}
              </Polaris.IndexTable>
            </Polaris.Card>
          )}
        </Polaris.Layout.Section>
      </Polaris.Layout>

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
      <Polaris.Card>
        <Polaris.Text as="h2" variant="headingMd">Route error</Polaris.Text>
        <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>
      </Polaris.Card>
    </Polaris.Page>
  );
}

export function CatchBoundary() {
  return (
    <Polaris.Page title="Not found">
      <Polaris.Card>
        <Polaris.Text as="p">Page not found.</Polaris.Text>
      </Polaris.Card>
    </Polaris.Page>
  );
}
