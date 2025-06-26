import * as Polaris from "@shopify/polaris";

export type Appointment = {
  id: string;
  time: string;
  customer: string;
  notes?: string;
};

interface Props {
  grouped: Record<string, Appointment[]>;
  emptyMessage?: string;
}

export default function UpcomingAppointmentsCard({
  grouped,
  emptyMessage = "No bookings yet this month.",
}: Props) {
  const { Card, Text, Stack } = Polaris;
  return (
    <Card sectioned title="Upcoming Appointments">
      {Object.keys(grouped).length === 0 ? (
        <Text>{emptyMessage}</Text>
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
              {appts.map((appt) => (
                <Card key={appt.id} sectioned>
                  <Text>
                    🕒 {appt.time} — 👤 {appt.customer}
                    {appt.notes && (
                      <>
                        <br />📝 {appt.notes}
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
  );
}
