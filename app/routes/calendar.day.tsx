import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, InlineStack, Text, Button, Box } from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { addDays, formatYYYYMM } from "~/utils/calendar";
import { listBookings } from "~/lib/bookings.server";

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
  const start = new Date(day);
  const end = addDays(day, 1);
  const bookings = await listBookings({ start, end });

  return json({
    dateISO: day.toISOString(),
    monthParam: formatYYYYMM(day),
    staff: staff.map((s) => ({ id: s.id, name: s.name })),
    bookings: bookings.map((b) => ({
      id: b.id,
      staffId: b.staffId,
      serviceName: b.service?.name ?? "",
      customerName: b.customerName,
      start: b.start.toISOString(),
      end: b.end.toISOString(),
    })),
  });
}

export default function CalendarDayPage() {
  const { dateISO, monthParam, staff, bookings } = useLoaderData<typeof loader>();
  const day = new Date(dateISO);
  const title = day.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Build 7-day strip centered on selected date
  const stripDays = Array.from({ length: 7 }, (_, i) => addDays(day, i - 3));
  const prevStrip = addDays(day, -7);
  const nextStrip = addDays(day, 7);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isSameDay = (a: Date, b: Date) => (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
  
  // Schedule grid config
  const startHour = 8; // 8 AM
  const endHour = 20;  // 8 PM
  const hourHeight = 48; // px per hour
  const totalHours = endHour - startHour;
  const gridHeight = totalHours * hourHeight;
  const hours = Array.from({ length: totalHours }).map((_, i) => i + startHour);
  const hoursColWidth = 56; // px
  const slotMinutes = 15;
  const slotHeight = hourHeight * (slotMinutes / 60);
  const headerRowHeight = 40; // px

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const minutesFromStart = (d: Date) => d.getHours() * 60 + d.getMinutes() - startHour * 60;
  const colorForIndex = (i: number) => {
    const palette = [
      '#5C6AC4', // indigo
      '#47C1BF', // teal
      '#108043', // green
      '#F49342', // orange
      '#DE3618', // red
      '#9966CC', // amethyst
    ];
    return palette[i % palette.length];
  };

  return (
    <Page title={title}>
      <Layout>
        <Layout.Section>
          <Box position="sticky" top={0} zIndex="1" background="bg"
               paddingBlockStart="200" paddingBlockEnd="200" paddingInlineStart="200" paddingInlineEnd="200"
               borderBlockEndWidth="025">
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Link to={`/calendar?month=${monthParam}`}>
                  <Button>Back to Month</Button>
                </Link>
                <Text as="span" variant="headingMd">{title}</Text>
              </InlineStack>
              <InlineStack gap="200" align="center" blockAlign="center">
                <Link to={`/calendar/day?date=${formatYYYYMMDD(prevStrip)}`}>
                  <Button accessibilityLabel="Previous 7 days">‹</Button>
                </Link>
                <InlineStack gap="100" blockAlign="center">
                  {stripDays.map((d) => {
                    const weekdayLetter = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1);
                    const isToday = isSameDay(d, today);
                    const isSelected = isSameDay(d, day);
                    return (
                      <Link key={formatYYYYMMDD(d)} to={`/calendar/day?date=${formatYYYYMMDD(d)}`} prefetch="intent">
                        <Button
                          size="slim"
                          variant={isToday ? 'primary' : isSelected ? 'secondary' : undefined}
                          accessibilityLabel={`${d.toLocaleDateString(undefined, { weekday: 'long' })} ${d.getDate()}`}
                        >
                          {weekdayLetter} {d.getDate()}
                        </Button>
                      </Link>
                    );
                  })}
                </InlineStack>
                <Link to={`/calendar/day?date=${formatYYYYMMDD(nextStrip)}`}>
                  <Button accessibilityLabel="Next 7 days">›</Button>
                </Link>
              </InlineStack>
            </InlineStack>
          </Box>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <InlineStack align="start" gap="0">
                {/* Left sticky hours column with header spacer */}
                <Box
                  style={{ width: `${hoursColWidth}px`, position: 'sticky', left: 0, zIndex: 1, background: 'var(--p-color-bg, #fff)' }}
                >
                  <Box height={`${headerRowHeight}px`} />
                  {hours.map((h) => (
                    <Box key={h} height={`${hourHeight}px`} paddingInlineStart="100" paddingBlockStart="050">
                      <Text as="span" tone="subdued">
                        {new Date(0, 0, 0, h).toLocaleTimeString([], { hour: 'numeric' })}
                      </Text>
                    </Box>
                  ))}
                </Box>

                {/* Shared horizontal scroller for header and grid */}
                <Box overflowX="auto" width="fill">
                  <BlockStack gap="0">
                    {/* Staff header row inside scroller */}
                    <InlineStack gap="200" align="start">
                      {staff.map((s, idx) => (
                        <Box key={s.id} minWidth="220" padding="200" style={{ height: `${headerRowHeight}px` }} borderInlineStartWidth={idx === 0 ? undefined : '025'}>
                          <Text as="span" variant="headingSm">{s.name}</Text>
                        </Box>
                      ))}
                    </InlineStack>

                    {/* Columns grid with bookings */}
                    <InlineStack gap="200" align="start">
                      {staff.map((s, sIdx) => {
                        const staffBookings = (bookings || []).filter((b: any) => b.staffId === s.id).map((b: any) => ({
                          ...b,
                          start: new Date(b.start),
                          end: new Date(b.end),
                        }));
                        return (
                          <Box key={s.id} minWidth="220" style={{ position: 'relative', height: `${gridHeight}px` }} borderInlineStartWidth={sIdx === 0 ? undefined : '025'}>
                            {hours.map((_, i) => {
                              const top = i * hourHeight;
                              return (
                                <Box key={`h-${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${top}px`, height: '1px', background: 'var(--p-color-border, #E3E3E3)' }} />
                              );
                            })}
                            {hours.map((_, i) => {
                              const base = i * hourHeight;
                              return [1, 2, 3].map((q) => (
                                <Box key={`q-${i}-${q}`} style={{ position: 'absolute', left: 0, right: 0, top: `${base + (q * hourHeight) / 4}px`, height: '1px', background: 'var(--p-color-border-subdued, #F0F0F0)' }} />
                              ));
                            })}
                            {staffBookings.map((bk, idx) => {
                              const minsStart = clamp(minutesFromStart(bk.start), 0, totalHours * 60);
                              const minsEnd = clamp(minutesFromStart(bk.end), 0, totalHours * 60);
                              if (minsEnd <= minsStart) return null;
                              // snap to 15-min rows
                              const startSlots = Math.floor(minsStart / slotMinutes);
                              const endSlots = Math.ceil(minsEnd / slotMinutes);
                              const top = startSlots * slotHeight;
                              const height = Math.max(slotHeight, (endSlots - startSlots) * slotHeight);
                              const bg = colorForIndex(sIdx);
                              const text = `${bk.serviceName} • ${bk.customerName}`;
                              return (
                                <Box
                                  key={bk.id || idx}
                                  padding="150"
                                  style={{
                                    position: 'absolute',
                                    left: 8,
                                    right: 8,
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    background: bg,
                                    color: '#fff',
                                    borderRadius: 8,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                    fontSize: 12,
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                  }}
                                  title={text}
                                >
                                  {text}
                                </Box>
                              );
                            })}
                          </Box>
                        );
                      })}
                    </InlineStack>
                  </BlockStack>
                </Box>
              </InlineStack>

              {(bookings.length === 0) && (
                <Text as="p" tone="subdued">No bookings for this day.</Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
        <Box style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 2 }}>
          <Link to={`/booking/new?date=${formatYYYYMMDD(day)}&staffId=`} prefetch="intent">
            <Button variant="primary" accessibilityLabel="Create appointment">+
            </Button>
          </Link>
        </Box>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  return (
    <Page title="Error">
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="p">Something went wrong rendering the day view.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Page Error">
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="p">The requested day could not be loaded.</Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
