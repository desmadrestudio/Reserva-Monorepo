import { Page, Layout, Card, Text } from "@shopify/polaris";

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