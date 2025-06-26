import {
    json,
    type LoaderFunction,
    type ActionFunction,
} from "@remix-run/node";
import { useLoaderData, Form, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { useState } from "react";
import { getAppointments, createAppointment } from "../../services/appointment.server";
import UpcomingAppointmentsCard from "../../components/dashboard/UpcomingAppointmentsCard";

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
    const dateString = formData.get("date");
    const time = formData.get("time") as string | null;
    const customer = formData.get("customer") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!dateString || !time || !customer) {
        return json({ error: "Missing required fields" }, { status: 400 });
    }

    const date = new Date(String(dateString));
    if (isNaN(date.getTime())) {
        return json({ error: "Invalid date" }, { status: 400 });
    }

    await createAppointment({ date, time, customer, notes: notes ?? undefined });

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
    const { Page, Layout, Card, Button, DatePicker, TextField, Stack, Text } = Polaris;
    const { appointments } = useLoaderData<LoaderData>();
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [time, setTime] = useState("");
    const [customer, setCustomer] = useState("");
    const [notes, setNotes] = useState("");

    if (navigation.state === "loading") {
        return (
            <Page>
                <Card sectioned>Loading...</Card>
            </Page>
        );
    }

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
                        <Form method="post" action="/dashboard/calendar">
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
                    <UpcomingAppointmentsCard grouped={grouped} />
                </Layout.Section>
            </Layout>
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
