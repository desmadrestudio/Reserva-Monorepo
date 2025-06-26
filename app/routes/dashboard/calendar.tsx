import {
    json,
    type LoaderFunction,
    type ActionFunction,
} from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import {
    Page,
    Layout,
    Card,
    Button,
    DatePicker,
    TextField,
    Stack,
    Text,
} from "@shopify/polaris";
import { useState } from "react";
import { getAppointments, createAppointment } from "../../services/appointment.server";

type Appointment = {
    id: string;
    shop: string;
    date: string;
    time: string;
    customer: string;
    notes?: string;
};

type LoaderData = {
    appointments: Appointment[];
};

export const loader: LoaderFunction = async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const appointments = await getAppointments({ start, end });

    return json<LoaderData>({ appointments });
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const date = new Date(formData.get("date") as string);
    const time = formData.get("time") as string;
    const customer = formData.get("customer") as string;
    const notes = formData.get("notes") as string;

    if (!date || !time || !customer) {
        return json({ error: "Missing required fields" }, { status: 400 });
    }

    await createAppointment({ date, time, customer, notes });

    return json({ success: true });
};

const groupAppointmentsByDate = (appointments: Appointment[]) => {
    return appointments.reduce((acc, appt) => {
        const dayKey = new Date(appt.date).toISOString().split("T")[0];
        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(appt);
        return acc;
    }, {} as Record<string, Appointment[]>);
};

export default function CalendarPage() {
    const { appointments } = useLoaderData<LoaderData>();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [time, setTime] = useState("");
    const [customer, setCustomer] = useState("");
    const [notes, setNotes] = useState("");

    const grouped = groupAppointmentsByDate(appointments);

    return (
        <Page title="Calendar & Manual Booking">
            <Layout>
                {/* 📅 Date Picker */}
                <Layout.Section>
                    <Card sectioned>
                        <Text variant="headingMd">Select a Date</Text>
                        <DatePicker
                            month={selectedDate.getMonth()}
                            year={selectedDate.getFullYear()}
                            onChange={(range) => {
                                if (range?.start) setSelectedDate(range.start);
                            }}
                            selected={[{ start: selectedDate, end: selectedDate }]}
                            disableDatesBefore={new Date()}
                            onMonthChange={() => { }}
                        />
                    </Card>
                </Layout.Section>

                {/* 📝 Manual Booking Form */}
                <Layout.Section>
                    <Card sectioned title="Book New Appointment">
                        <Form method="post" action="/frontend/dashboard/calendar">
                            <input
                                type="hidden"
                                name="date"
                                value={selectedDate.toISOString()}
                            />
                            <Stack vertical spacing="tight">
                                <TextField
                                    label="Customer Name"
                                    name="customer"
                                    value={customer}
                                    onChange={setCustomer}
                                    requiredIndicator
                                />
                                <TextField
                                    label="Time"
                                    name="time"
                                    value={time}
                                    onChange={setTime}
                                    helpText="Example: 2:00 PM"
                                    requiredIndicator
                                />
                                <TextField
                                    label="Notes (optional)"
                                    name="notes"
                                    value={notes}
                                    onChange={setNotes}
                                    multiline
                                />
                            </Stack>
                            <div style={{ marginTop: "1.5rem" }}>
                                <Button submit primary fullWidth>
                                    Confirm Booking
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Layout.Section>

                {/* 📖 Upcoming Appointments */}
                <Layout.Section>
                    <Card sectioned title="Upcoming Appointments">
                        {Object.keys(grouped).length === 0 ? (
                            <Text>No bookings yet this month.</Text>
                        ) : (
                            Object.entries(grouped).map(([dateStr, appts]) => (
                                <div key={dateStr} style={{ marginBottom: "1.5rem" }}>
                                    <Text variant="headingSm">
                                        {new Date(dateStr).toLocaleDateString(undefined, {
                                            weekday: "long",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Text>
                                    <Stack vertical spacing="tight">
                                        {appt.map((appt) => (
                                            <Card key={appt.id} sectioned>
                                                <Text>
                                                    🕒 {appt.time} — 👤 {appt.customer}
                                                    {appt.notes && (
                                                        <>
                                                            <br />
                                                            📝 {appt.notes}
                                                        </>
                                                    )}
                                                </Text>
                                            </Card>
                                        ))}
                                    </Stack>
                                </div>
                            ))
                        )}
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}