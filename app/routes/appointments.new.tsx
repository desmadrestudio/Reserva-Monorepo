import { json, redirect, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useRouteError,
  useActionData,
} from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import { getProviders } from "~/utils/provider.server";
import { createAppointment } from "~/services/appointment.server";

const {
  Page,
  Button,
  TextField,
  Select,
  DatePicker,
  BlockStack,
  InlineStack,
  Checkbox,
  Box,
  Text,
  Divider,
  Icon,
  InlineError,
  Card,
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

type ActionData = {
  errors?: {
    customer?: string;
    date?: string;
    time?: string;
    providerId?: string;
    duration?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const customer = formData.get("customer");
  const date = formData.get("date");
  const time = formData.get("time");
  const providerId = formData.get("providerId");
  const duration = formData.get("duration");
  const notes = formData.get("notes");
  const allDay = formData.get("allDay");

  const errors: ActionData["errors"] = {};
  if (!customer) errors.customer = "Customer is required";
  if (!date) errors.date = "Date is required";
  if (!allDay && !time) errors.time = "Time is required";
  if (!providerId) errors.providerId = "Provider is required";
  if (!duration) errors.duration = "Service is required";
  if (Object.keys(errors).length) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  const parsedDate = new Date(String(date));
  if (isNaN(parsedDate.getTime())) {
    return json<ActionData>({ errors: { date: "Invalid date" } }, { status: 400 });
  }

  await createAppointment({
    date: parsedDate,
    time: allDay ? "all-day" : String(time),
    customer: String(customer),
    providerId: String(providerId),
    service: String(duration),
    notes: notes ? String(notes) : undefined,
  });

  return redirect("/dashboard/calendar");
};

export default function NewAppointment() {
  const { providers } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [providerId, setProviderId] = useState<string>("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [showCustomerInput, setShowCustomerInput] = useState(false);
  const [showServiceInput, setShowServiceInput] = useState(false);

  const formsDisabled = !customer || !duration;

  return (
    <Page fullWidth>
      <Form method="post">
        <Box padding="400" paddingBlockEnd="200">
          <InlineStack align="space-between" blockAlign="center">
            <Button url="/dashboard/calendar" variant="plain">
              <Icon source={XIcon} accessibilityLabel="Cancel" />
            </Button>
            <Text variant="headingMd" as="h1">New Appointment</Text>
            <Button primary submit loading={navigation.state === "submitting"}>Save</Button>
          </InlineStack>
        </Box>
        <Divider />
        <BlockStack gap="400" padding="400">
          <Text variant="headingSm" fontWeight="bold" as="h2">CUSTOMER</Text>
          {showCustomerInput ? (
            <TextField
              label="Customer"
              name="customer"
              value={customer}
              onChange={setCustomer}
              requiredIndicator
            />
          ) : (
            <Button fullWidth onClick={() => setShowCustomerInput(true)}>
              Add Customer
            </Button>
          )}
          {actionData?.errors?.customer && (
            <InlineError message={actionData.errors.customer} fieldID="customer" />
          )}
        </BlockStack>
        <Divider />
        <BlockStack gap="400" padding="400">
          <Text variant="headingSm" fontWeight="bold" as="h2">DATE & TIME</Text>
          <Checkbox label="All-Day" checked={allDay} name="allDay" onChange={setAllDay} />
          <DatePicker
            month={selectedDate.getMonth()}
            year={selectedDate.getFullYear()}
            onChange={(range) => {
              if (range?.start) setSelectedDate(range.start);
            }}
            selected={{ start: selectedDate, end: selectedDate }}
          />
          <input type="hidden" name="date" value={selectedDate.toISOString()} />
          <TextField
            label="Time"
            name="time"
            value={time}
            onChange={setTime}
            disabled={allDay}
            requiredIndicator={!allDay}
          />
          {actionData?.errors?.time && (
            <InlineError message={actionData.errors.time} fieldID="time" />
          )}
          <Checkbox label="Recurring" checked={recurring} name="recurring" onChange={setRecurring} />
        </BlockStack>
        <Divider />
        <BlockStack gap="400" padding="400">
          <Text variant="headingSm" fontWeight="bold" as="h2">SERVICES & ITEMS</Text>
          {showServiceInput ? (
            <BlockStack gap="200">
              <Select
                label="Select therapist"
                name="providerId"
                options={providers}
                value={providerId}
                onChange={setProviderId}
              />
              {actionData?.errors?.providerId && (
                <InlineError message={actionData.errors.providerId} fieldID="providerId" />
              )}
              <Select
                label="Duration"
                name="duration"
                options={DURATIONS}
                value={duration}
                onChange={setDuration}
              />
              {actionData?.errors?.duration && (
                <InlineError message={actionData.errors.duration} fieldID="duration" />
              )}
            </BlockStack>
          ) : (
            <Button fullWidth onClick={() => setShowServiceInput(true)}>
              Add Service
            </Button>
          )}
        </BlockStack>
        <Divider />
        <BlockStack gap="400" padding="400">
          <Text variant="headingSm" fontWeight="bold" as="h2">FORMS TO SEND</Text>
          {formsDisabled ? (
            <Text color="subdued">Select a customer and service to enable forms.</Text>
          ) : (
            <Checkbox label="Send confirmation" name="sendForm" />
          )}
        </BlockStack>
        <Divider />
        <BlockStack gap="400" padding="400">
          <Text variant="headingSm" fontWeight="bold" as="h2">APPOINTMENT NOTES</Text>
          <TextField label="Notes" name="notes" value={notes} onChange={setNotes} multiline />
        </BlockStack>
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
