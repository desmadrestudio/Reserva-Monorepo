import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, InlineStack, Text, Button, Badge } from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { getSlots } from "~/lib/availability.server";
import { addDays, formatYYYYMM } from "~/utils/calendar";

function parseDateParam(v: string | null): Date {
  if (!v) return new Date();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return new Date();
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (Number.isNaN(dt.getTime())) return new Date();
  return dt;
}

function formatYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const day = parseDateParam(dateParam);
  day.setHours(0, 0, 0, 0);

  const staff = await prisma.staff.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" }, take: 3, select: { id: true, name: true } });
  const serviceId = services[0]?.id;

  const slotsByStaff: Record<string, { start: string; end: string }[]> = {};
  if (serviceId) {
    for (const s of staff) {
      const slots = await getSlots({ serviceId, staffId: s.id, startDate: day, days: 1, stepMinutes: 60 });
      slotsByStaff[s.id] = slots.map((sl) => ({ start: sl.start.toISOString(), end: sl.end.toISOString() }));
    }
  }

  return json({
    dateISO: day.toISOString(),
    monthParam: formatYYYYMM(day),
    staff: staff.map((s) => ({ id: s.id, name: s.name })),
    services,
    slotsByStaff,
  });
}

export default function CalendarDayPage() {
  const { dateISO, monthParam, staff, services, slotsByStaff } = useLoaderData<typeof loader>();
  const day = new Date(dateISO);
  const title = day.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const prev = addDays(day, -1);
  const next = addDays(day, 1);

  const hours = Array.from({ length: 12 }).map((_, i) => i + 8); // 8..19

  return (
    <Page title={title}>
      <Layout>
        <Layout.Section>
          <InlineStack align="space-between">
            <InlineStack gap="200">
              <Link to={`/calendar?month=${monthParam}`}><Button>Back to Month</Button></Link>
            </InlineStack>
            <InlineStack gap="200">
              <Link to={`/calendar/day?date=${formatYYYYMMDD(prev)}`}><Button>Prev</Button></Link>
              <Link to={`/calendar/day?date=${formatYYYYMMDD(next)}`}><Button>Next</Button></Link>
            </InlineStack>
          </InlineStack>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" align="start">
                <div style={{ width: 100 }} />
                {staff.map((s) => (
                  <div key={s.id} style={{ flex: 1, fontWeight: 600 }}>{s.name}</div>
                ))}
              </InlineStack>
              {hours.map((h) => (
                <InlineStack key={h} gap="200" align="start">
                  <div style={{ width: 100 }}>
                    <Text as="span" tone="subdued">{new Date(0, 0, 0, h).toLocaleTimeString([], { hour: 'numeric' })}</Text>
                  </div>
                  {staff.map((s) => {
                    const slots = slotsByStaff[s.id] || [];
                    const withinHour = slots.filter((sl) => {
                      const st = new Date(sl.start);
                      return st.getHours() === h;
                    });
                    return (
                      <div key={s.id + h} style={{ flex: 1, minHeight: 40 }}>
                        <InlineStack gap="100" align="start">
                          {withinHour.map((sl, idx) => (
                            <Badge key={idx}>{new Date(sl.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Badge>
                          ))}
                        </InlineStack>
                      </div>
                    );
                  })}
                </InlineStack>
              ))}
              {!services.length && (
                <Text as="p" tone="subdued">No services available — showing hours only.</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

