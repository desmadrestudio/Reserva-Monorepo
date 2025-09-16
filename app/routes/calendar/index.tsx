import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useRouteError } from "@remix-run/react";
import { Page, Layout, Card, Text, Button, InlineStack, BlockStack, ButtonGroup, Badge } from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { buildMonthGrid, addDays as addDaysUtil, addMonths as addMonthsUtil } from "~/utils/calendar";

type LoaderData = {
  dateISO: string;
  readable: string;
  countsByDay: Record<string, number>;
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
  // Remove day-grid specific queries; month view uses counts only

  const readable = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Compute month grid range and fetch booking counts (resilient if Booking model missing)
  let countsByDay: Record<string, number> = {};
  try {
    const grid = buildMonthGrid(date);
    const monthStart = grid[0];
    const lastCell = grid[grid.length - 1];
    const monthEndExclusive = addDaysUtil(lastCell, 1);
    const rows = await (prisma as any).booking?.findMany({
      where: {
        start: { gte: monthStart, lt: monthEndExclusive },
      },
      select: { start: true },
    });
    if (Array.isArray(rows)) {
      const acc: Record<string, number> = {};
      for (const r of rows) {
        const d = new Date(r.start);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
        acc[key] = (acc[key] ?? 0) + 1;
      }
      countsByDay = acc;
    }
  } catch (e) {
    countsByDay = {};
  }

  return json<LoaderData>({ dateISO, readable, countsByDay });
}

export default function CalendarPage() {
  const { dateISO, readable, countsByDay } = useLoaderData<LoaderData>();
  const base = new Date(dateISO);
  const monthLabel = base.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const grid = buildMonthGrid(base);
  const prevMonth = toISODate(addMonthsUtil(base, -1));
  const nextMonth = toISODate(addMonthsUtil(base, 1));
  const todayISO = toISODate(new Date());

  // View toggles navigate to other routes
  const weekUrl = `/calendar/week`;
  const dayUrl = `/calendar/day`;
  const listUrl = `/calendar/list`;

  return (
    <Page title="Calendar" subtitle={monthLabel} primaryAction={{ content: "Today", url: `/calendar?date=${toISODate(new Date())}` }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <InlineStack gap="200">
                  <ButtonGroup>
                    <Button url={`/calendar?date=${prevMonth}`}>&larr; Prev</Button>
                    <Button url={`/calendar?date=${nextMonth}`}>Next &rarr;</Button>
                  </ButtonGroup>
                  <InlineStack gap='200'>
                    <Button url='/calendar' variant='primary'>Month</Button>
                    <Button url={weekUrl}>Week</Button>
                    <Button url={dayUrl}>Day</Button>
                    <Button url={listUrl}>List</Button>
                  </InlineStack>
                </InlineStack>
              </InlineStack>

              <style>
                {`
                  .month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
                  .cell{position:relative;min-height:92px;border:1px solid var(--p-color-border-subdued,#E3E3E3);border-radius:8px;padding:8px;background:var(--p-color-bg,#fff)}
                  .cell.out{opacity:0.6}
                  .dateNum{position:absolute;top:6px;right:8px;font-size:12px;color:var(--p-color-text-subdued)}
                  .badge{position:absolute;right:6px;bottom:6px;min-width:18px;height:18px;padding:0 6px;border-radius:9999px;background:var(--p-color-bg-fill-brand,#5C6AC4);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;line-height:1}
                  .today{outline:2px solid var(--p-color-bg-fill-brand,#5C6AC4)}
                  .weekday{font-size:12px;color:var(--p-color-text-subdued);text-align:center;margin-bottom:6px}
                `}
              </style>

              {/* Weekday headers */}
              <div className="month-grid" style={{ marginTop: 4 }}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((w) => (
                  <div key={w} className="weekday">{w}</div>
                ))}
              </div>

              {/* Month grid */}
              <div className="month-grid">
                {grid.map((d) => {
                  const iso = toISODate(d);
                  const isOut = d.getMonth() !== base.getMonth();
                  const isToday = iso === todayISO;
                  const count = countsByDay[iso] || 0;
                  return (
                    <RemixLink key={iso} to={`/calendar/day?date=${iso}`} prefetch="intent" className={`cell ${isOut ? 'out' : ''} ${isToday ? 'today' : ''}`}>
                      <span className="dateNum">{d.getDate()}</span>
                      {count > 0 && <span className="badge">{count}</span>}
                    </RemixLink>
                  );
                })}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// helpers removed; month view does not use shortCustomer/formatHour

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
