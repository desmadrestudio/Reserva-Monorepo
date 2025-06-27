import {
  json,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { useState } from "react";
import { getAppointments, createAppointment } from "~/services/appointment.server";
import UpcomingAppointmentsCard from "~/components/dashboard/UpcomingAppointmentsCard";

const {
  Page,
  Layout,
  Card,
  Button,
  DatePicker,
  TextField,
  Stack,
  Text,
} = Polaris;

// ---- BACKEND: Loader to fetch appointments for current month
export const loader: LoaderFunction = async () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const appointments = await getAppointments({ start, end });

  return json({ appointments });
};

// ---- BACKEND: Action to create a new appointment
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const date = new Date(formData.get("date") as string);
  const time = formData.get("time") as string;
  const customer = formData.get("customer") as string;

  if (!time || !customer || isNaN(date.getTime())) {
    return json({ error: "Invalid input" }, { status: 400 });
  }

  await createAppointment({ date, time, customer });

  return json({ success: true });
};

// ---- TYPE: Appointment
type Appointment = {
  id: string;
  date: string;
  time: string;
  customer: string;
};

// ---- HELPER: Group appointments by date
const groupAppointmentsByDate = (
  appointments: Appointment[]
) => {
  return appointments.reduce((acc, appt) => {
    const dayKey = new Date(appt.date).toISOString().split("T")[0];
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(appt);
    return acc;
  }, {} as Record<string, typeof appointments>);
};

// ---- FRONTEND COMPONENT ----
export default function CalendarPage() {
  const { appointments } = useLoaderData<typeof loader>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState("");

  const grouped = groupAppointmentsByDate(appointments);

  const handleMonthChange = () => {
    // Future enhancement: load more data per month
  };

  return (
    <Page title="Calendar Booking">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <DatePicker
              month={selectedDate.getMonth()}
              year={selectedDate.getFullYear()}
              onChange={(range) => {
                if (range?.start) setSelectedDate(range.start);
              }}
              onMonthChange={handleMonthChange}
              selected={{ start: selectedDate, end: selectedDate }}
              disableDatesBefore={new Date()}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned title="Book for Selected Date">
            <Form method="post">
              <input
                type="hidden"
                name="date"
                value={selectedDate.toISOString()}
              />
              <TextField
                label="Customer Name"
                name="customer"
                value={customer}
                onChange={setCustomer}
              />
              <TextField
                label="Time"
                name="time"
                value={time}
                onChange={setTime}
                helpText="e.g. 2:00 PM"
              />
              <Button submit primary>
                Book Appointment
              </Button>
            </Form>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <UpcomingAppointmentsCard grouped={grouped} emptyMessage="No bookings this month yet." />
        </Layout.Section>
      </Layout>
    </Page>
  );
}