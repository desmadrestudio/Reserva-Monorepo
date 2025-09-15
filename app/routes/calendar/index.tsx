import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useRouteError } from "@remix-run/react";
import { Page, Layout, Card, Text, Button, InlineStack, BlockStack, ButtonGroup, Badge } from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";

type Provider = { id: string; name: string };
type CalendarEvent = {
  id: string;
  providerId: string;
  customer: string;
  serviceName: string;
  startMinutes: number; // minutes from midnight
  durationMinutes: number;
  color: string;
};

type LoaderData = {
  dateISO: string;
  readable: string;
  providers: Provider[];
  events: CalendarEvent[];
};

function parseDateParam(dateStr?: string | null): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

function toISODate(d: Date): string {
  const z = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return z.toISOString().slice(0, 10);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

// "2:30 PM" -> minutes since midnight
function parseTimeToMinutes(t: string): number {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)$/i);
  if (!m) return 0;
  let hr = parseInt(m[1], 10);
  const min = parseInt(m[2] || "0", 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && hr < 12) hr += 12;
  if (ap === "AM" && hr === 12) hr = 0;
  return hr * 60 + min;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const date = parseDateParam(url.searchParams.get("date"));
  const dateISO = toISODate(date);
  const start = startOfDay(date);
  const end = endOfDay(date);

  const providers = await prisma.provider.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  const appts = await prisma.appointment.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
    include: {
      service: { select: { name: true, baseMinutes: true, processingMinutes: true, blockExtraMinutes: true } },
      addons: { include: { addOn: { select: { minutes: true } } } },
    },
  });

  const colors = ["#36B3A8", "#E37329", "#8A63D2", "#5C6AC4", "#47C1BF", "#DE3618"]; // simple palette
  const events: CalendarEvent[] = appts.map((a, i) => {
    const startMinutes = parseTimeToMinutes(a.time || "12:00 PM");
    const base = a.service?.baseMinutes ?? 60;
    const addOnMinutes = (a.addons || []).reduce((sum, it) => sum + (it.addOn?.minutes ?? 0), 0);
    const processing = a.service?.processingMinutes ?? 0;
    const blockExtra = a.service?.blockExtraMinutes ?? 0;
    const durationMinutes = base + addOnMinutes + processing + blockExtra;
    return {
      id: a.id,
      providerId: a.providerId,
      customer: a.customer,
      serviceName: a.service?.name ?? "Service",
      startMinutes,
      durationMinutes,
      color: colors[i % colors.length],
    };
  });

  const readable = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return json<LoaderData>({ dateISO, readable, providers, events });
}

export default function CalendarPage() {
  const { dateISO, readable, providers, events } = useLoaderData<LoaderData>();

  const startHour = 8; // 8 AM
  const endHour = 21; // 9 PM
  const totalMinutes = (endHour - startHour) * 60;
  const pxPerMinute = 1; // 1px per minute

  // Helpers
  const prevDate = (() => {
    const d = new Date(dateISO);
    d.setDate(d.getDate() - 1);
    return toISODate(d);
  })();
  const nextDate = (() => {
    const d = new Date(dateISO);
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  })();

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <Page title="Calendar" subtitle={readable} primaryAction={{ content: "Today", url: `/calendar?date=${toISODate(new Date())}` }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <ButtonGroup>
                  <Button url={`/calendar?date=${prevDate}`}>&larr; Prev</Button>
                  <Button url={`/calendar?date=${nextDate}`}>Next &rarr;</Button>
                </ButtonGroup>
                <Text as="p" tone="subdued">{providers.length} team member{providers.length === 1 ? "" : "s"}</Text>
              </InlineStack>

              {/* Empty state */}
              {providers.length === 0 ? (
                <Card>
                  <BlockStack gap="200">
                    <Text as="p">No providers yet. Add team members to view columns in the calendar.</Text>
                  </BlockStack>
                </Card>
              ) : null}

              {/* Providers header */}
              <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${providers.length}, minmax(200px, 1fr))`, gap: 1, alignItems: "center" }}>
                <div />
                {providers.map((p) => (
                  <div key={p.id} style={{ padding: "8px 12px", borderBottom: "1px solid #E1E3E5" }}>
                    <Text as="span" variant="bodyMd" fontWeight="medium">{p.name}</Text>
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${providers.length}, minmax(200px, 1fr))`, gap: 1 }}>
                {/* Time gutter */}
                <div style={{ position: "relative", height: totalMinutes * pxPerMinute }}>
                  {hours.map((h) => (
                    <div key={h} style={{ position: "absolute", top: (h - startHour) * 60 * pxPerMinute - 8, left: 0, width: "100%", paddingRight: 8, textAlign: "right" }}>
                      <Text as="span" tone="subdued">{formatHour(h)}</Text>
                    </div>
                  ))}
                </div>

                {/* Provider columns */}
                {providers.map((p) => (
                  <div key={p.id} style={{ position: "relative", borderLeft: "1px solid #E1E3E5", borderRight: "1px solid #E1E3E5", height: totalMinutes * pxPerMinute, backgroundSize: `100% ${60 * pxPerMinute}px`, backgroundImage: `linear-gradient(transparent ${60 * pxPerMinute - 1}px, #F2F3F5 1px)` }}>
                    {events.filter((e) => e.providerId === p.id).map((e) => {
                      const top = (e.startMinutes - startHour * 60) * pxPerMinute;
                      const height = Math.max(20, e.durationMinutes * pxPerMinute);
                      return (
                        <div key={e.id} style={{ position: "absolute", top, left: 6, right: 6, height, borderRadius: 6, background: e.color, color: "white", padding: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.15)", overflow: "hidden" }}>
                          <BlockStack gap="050">
                            <InlineStack align="space-between">
                              <Text as="span" variant="bodyMd" fontWeight="bold" color="text-inverse">{shortCustomer(e.customer)}</Text>
                              <Badge tone="success">✓</Badge>
                            </InlineStack>
                            <Text as="span" variant="bodySm" color="text-inverse">{e.serviceName}</Text>
                          </BlockStack>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function shortCustomer(name?: string) {
  if (!name) return "Customer";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  return `${parts[0]} ${parts[1][0]}.`;
}

function formatHour(h24: number) {
  const ampm = h24 >= 12 ? "PM" : "AM";
  let h = h24 % 12;
  if (h === 0) h = 12;
  return `${h} ${ampm}`;
}

export function ErrorBoundary() {
  const err = useRouteError() as any;
  const message = (typeof err === "string" && err) || err?.message || "Something went wrong.";
  return (
    <Page title="Calendar">
      <Card>
        <Text as="p">{message}</Text>
        <RemixLink to="/calendar">Back</RemixLink>
      </Card>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Not found">
      <Card>
        <Text as="p">Page not found.</Text>
        <RemixLink to="/">Home</RemixLink>
      </Card>
    </Page>
  );
}
