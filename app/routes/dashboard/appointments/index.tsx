// This route was migrated from a dot-route to a folder-based structure for better scalability.
import { Page, Layout, Card, Text } from "@shopify/polaris";
import { useNavigation, useRouteError } from "@remix-run/react";

type Appointment = {
    id: string;
    customerName: string;
    date: string;
    time: string;
};

const dummyAppointments: Appointment[] = [
    { id: "1", customerName: "Jane Doe", date: "2025-06-26", time: "10:00 AM" },
    { id: "2", customerName: "John Smith", date: "2025-06-27", time: "2:30 PM" },
];

export default function AppointmentsPage() {
    const navigation = useNavigation();

    if (navigation.state === "loading") {
        return (
            <Page>
                <Card sectioned>Loading...</Card>
            </Page>
        );
    }

    return (
        <Page title="All Appointments">
            <Layout>
                <Layout.Section>
                    {dummyAppointments.map((appt) => (
                        <Card key={appt.id} sectioned>
                            <Text as="h3" variant="headingSm">
                                {appt.customerName}
                            </Text>
                            <Text tone="subdued">
                                {appt.date} at {appt.time}
                            </Text>
                        </Card>
                    ))}
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