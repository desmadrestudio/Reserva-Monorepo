import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, ResourceList, ResourceItem, Badge, InlineStack, Button } from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";

function toISODate(d: Date) { return d.toISOString().slice(0,10); }

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const startParam = url.searchParams.get("start");
  const days = Math.max(1, Math.min(31, Number(url.searchParams.get("days") ?? 14)));
  const base = startParam ? new Date(startParam) : new Date();
  base.setHours(0,0,0,0);
  const end = new Date(base);
  end.setDate(base.getDate() + days);
  const rows = await prisma.appointment.findMany({
    where: { date: { gte: base, lt: end } },
    orderBy: [{ date: 'asc' }],
    include: { service: { select: { name: true } }, provider: { select: { name: true } } },
  });
  return json({
    startISO: base.toISOString(),
    days,
    items: rows.map(r => ({
      id: r.id,
      dateISO: r.date.toISOString(),
      time: r.time,
      serviceName: r.service?.name ?? '',
      providerName: r.provider?.name ?? '',
      customer: r.customer,
    })),
  });
}

export default function CalendarListPage() {
  const { startISO, days, items } = useLoaderData<typeof loader>();
  const start = new Date(startISO);
  const end = new Date(start); end.setDate(start.getDate() + days - 1);
  const title = `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  return (
    <Page title="Calendar (List)" subtitle={title}>
      <Layout>
        <Layout.Section>
          <Card>
            <InlineStack gap="200">
              <Button url="/calendar">Month</Button>
              <Button url="/calendar/week">Week</Button>
              <Button url="/calendar/day">Day</Button>
            </InlineStack>
            <ResourceList
              resourceName={{ singular: 'appointment', plural: 'appointments' }}
              items={items}
              renderItem={(item) => {
                const day = new Date(item.dateISO).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                return (
                  <ResourceItem id={item.id} accessibilityLabel={`View ${item.serviceName}`}>
                    <InlineStack align="space-between">
                      <Text as="span">{day} • {item.time}</Text>
                      <Badge>{item.providerName || 'Unassigned'}</Badge>
                    </InlineStack>
                    <Text as="p" tone="subdued">{item.serviceName} — {item.customer}</Text>
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

