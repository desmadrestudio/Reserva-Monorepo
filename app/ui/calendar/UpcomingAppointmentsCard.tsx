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
  const { LegacyCard, Text, LegacyStack } = Polaris;
  return (
    <LegacyCard sectioned title="Upcoming Appointments">
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
            <LegacyStack vertical spacing="tight">
              {appts.map((appt) => (
                <LegacyCard key={appt.id} sectioned>
                  <Text>
                    🕒 {appt.time} — 👤 {appt.customer}
                    {appt.notes && (
                      <>
                        <br />📝 {appt.notes}
                      </>
                    )}
                  </Text>
                </LegacyCard>
              ))}
            </LegacyStack>
          </div>
        ))
      )}
    </LegacyCard>
  );
}
