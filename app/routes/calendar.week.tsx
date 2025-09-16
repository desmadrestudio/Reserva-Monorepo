import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Page, Layout, Card, Text, InlineStack, Button } from "@shopify/polaris";
import { addDays, buildMonthGrid } from "~/utils/calendar";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const base = dateParam ? new Date(dateParam) : new Date();
  base.setHours(0, 0, 0, 0);
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() - weekStart.getDay());
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  return json({ base: base.toISOString(), days: days.map((d) => d.toISOString()) });
}

export default function CalendarWeekPage() {
  const { base, days } = useLoaderData<typeof loader>();
  const start = new Date(days[0]);
  const end = new Date(days[6]);
  const title = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  return (
    <Page title="Calendar (Week)" subtitle={title}>
      <Layout>
        <Layout.Section>
          <Card>
            <InlineStack gap="200">
              <Button url="/calendar">Month</Button>
              <Button url="/calendar/day">Day</Button>
              <Button url="/calendar/list">List</Button>
            </InlineStack>
            <div style={{ padding: 12 }}>
              <Text as="p" tone="subdued">Week view is coming soon. Select a day to view its schedule.</Text>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

