import * as Polaris from "@shopify/polaris";

export interface Appointment {
  id: string;
  time: string;
  customer: string;
  notes?: string;
}

interface Props {
  date: Date;
  appointments: Appointment[];
}

function parseMinutes(time: string) {
  const [t, meridian] = time.split(" ");
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  if (meridian === "PM" && h !== 12) h += 12;
  if (meridian === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function formatHour(h: number) {
  const d = new Date();
  d.setHours(h, 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric" });
}

export default function DayTimeline({ date, appointments }: Props) {
  const { Box, Text, Card } = Polaris;
  const hours = Array.from({ length: 16 }, (_, i) => 7 + i);
  const slotHeight = 60; // px
  const today = new Date();
  const isToday = today.toDateString() === date.toDateString();
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const nowOffset = ((nowMinutes - 7 * 60) / 60) * slotHeight;

  return (
    <Box position="relative" style={{ height: `${hours.length * slotHeight}px` }}>
      {hours.map((hour, idx) => (
        <Box
          key={hour}
          position="absolute"
          style={{
            top: `${idx * slotHeight}px`,
            left: 0,
            right: 0,
            borderBottom: "1px solid #dfe3e8",
            paddingLeft: "4rem",
            height: `${slotHeight}px`,
          }}
        >
          <Text as="span" variant="bodySm" tone="subdued" style={{ position: "absolute", left: 0 }}>
            {formatHour(hour)}
          </Text>
        </Box>
      ))}
      {appointments.map((appt) => {
        const mins = parseMinutes(appt.time);
        const offset = ((mins - 7 * 60) / 60) * slotHeight;
        return (
          <Card
            key={appt.id}
            sectioned
            style={{
              position: "absolute",
              top: `${offset}px`,
              left: "4rem",
              right: "0.5rem",
            }}
          >
            <Text variant="bodySm" as="span">
              {appt.time} – {appt.customer}
            </Text>
            {appt.notes && (
              <Text variant="bodySm" as="p">
                {appt.notes}
              </Text>
            )}
          </Card>
        );
      })}
      {isToday && nowOffset >= 0 && nowOffset <= hours.length * slotHeight && (
        <Box
          position="absolute"
          style={{
            top: `${nowOffset}px`,
            left: 0,
            right: 0,
            height: "0",
            borderTop: "2px solid red",
          }}
        />
      )}
    </Box>
  );
}
