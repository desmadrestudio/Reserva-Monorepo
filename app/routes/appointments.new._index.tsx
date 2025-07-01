// This route was migrated from a dot-route to a folder-based structure for better scalability.
import { json, redirect, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { useState } from "react";
import { getProviders } from "~/utils/provider.server";
import { createAppointment } from "~/services/appointment.server";

const {
  Page,
  Layout,
  Card,
  Button,
  TextField,
  Select,
  DatePicker,
  BlockStack,
  InlineStack,
  Checkbox,
} = Polaris;

const DURATIONS = [
  { label: "15 minutes", value: "15" },
  { label: "30 minutes", value: "30" },
  { label: "60 minutes", value: "60" },
];

export const loader: LoaderFunction = async () => {
  const providers = await getProviders();
  return json({ providers });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const customer = formData.get("customer");
  const date = formData.get("date");
  const time = formData.get("time");
  const providerId = formData.get("providerId");
  const duration = formData.get("duration");
  const notes = formData.get("notes");

  if (!customer || !date || !time || !providerId || !duration) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsedDate = new Date(String(date));
  if (isNaN(parsedDate.getTime())) {
    return json({ error: "Invalid date" }, { status: 400 });
  }

  await createAppointment({
    date: parsedDate,
    time: String(time),
    customer: String(customer),
    providerId: String(providerId),
    service: String(duration),
    notes: notes ? String(notes) : undefined,
  });

  return redirect("/dashboard/calendar");
};

export default function NewAppointment() {
  const { providers } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [providerId, setProviderId] = useState<string>("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [recurring, setRecurring] = useState(false);

  return (
    <Page title="New Appointment">
      <Form method="post">
        <InlineStack align="end" gap="200">
          <Button url="/dashboard/calendar">Cancel</Button>
          <Button primary submit loading={navigation.state === "submitting"}>Save</Button>
        </InlineStack>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <BlockStack gap="400">
                <TextField label="Add customer" name="customer" value={customer} onChange={setCustomer} requiredIndicator />
                <DatePicker
                  month={selectedDate.getMonth()}
                  year={selectedDate.getFullYear()}
                  onChange={(range) => { if (range?.start) setSelectedDate(range.start); }}
                  selected={{ start: selectedDate, end: selectedDate }}
                />
                <input type="hidden" name="date" value={selectedDate.toISOString()} />
                <TextField label="Time" name="time" value={time} onChange={setTime} requiredIndicator />
                <Select label="Select therapist" name="providerId" options={providers} value={providerId} onChange={setProviderId} requiredIndicator />
                <Select label="Duration" name="duration" options={DURATIONS} value={duration} onChange={setDuration} requiredIndicator />
                <TextField label="Notes" name="notes" value={notes} onChange={setNotes} multiline />
                <Checkbox label="Recurring" checked={recurring} name="recurring" onChange={setRecurring} />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Form>
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
