import {
  Page,
  Layout,
  Card,
  Button,
  Text,
} from "@shopify/polaris";
import { json, type LoaderFunction, type LinksFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";
import { useState } from "react";
import Calendar from "react-calendar";
import calendarStyles from "react-calendar/dist/Calendar.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: calendarStyles },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "Reserva Home" }];
};

export const loader: LoaderFunction = async () => {
  return json({ userName: "Johnny" });
};

export default function Home() {
  const data = useLoaderData<{ userName: string }>();
  const [date, setDate] = useState<Date | Date[]>(new Date());

  return (
    <Page title="Reserva Home">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              Welcome back{data.userName ? `, ${data.userName}` : ""}!
            </Text>

            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link to="/dashboard">
                <Button primary>Go to Dashboard</Button>
              </Link>
              <Link to="/appointments/new">
                <Button>Book New Appointment</Button>
              </Link>
              <Link to="/appointments">
                <Button plain>View All Appointments</Button>
              </Link>
            </div>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <div style={{ overflowX: "auto" }}>
            <Card sectioned>
              {typeof window !== "undefined" && (
                <Calendar value={date} onChange={setDate} />
              )}
              <Text variant="bodySm" as="p">
                Selected date: {Array.isArray(date) ? date.join(" to ") : date.toDateString()}
              </Text>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Page title="Error">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              Something went wrong
            </Text>
            <pre>{error.message}</pre>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
