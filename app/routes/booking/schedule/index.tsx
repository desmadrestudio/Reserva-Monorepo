import * as Polaris from "@shopify/polaris";
import { useNavigate, useSearchParams, useNavigation, useRouteError } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
import { useState, useEffect } from "react";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

const {
    Page,
    Layout,
    LegacyCard,
    DatePicker,
    Text,
    Button,
    LegacyStack,
} = Polaris;
  
  const TIME_SLOTS = [
    "10:00 AM",
    "11:30 AM",
    "1:00 PM",
    "2:30 PM",
    "4:00 PM",
    "5:30 PM",
  ];
  
  export default function SchedulePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
    const currentStep = "datetime";
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const service = searchParams.get("service");
    const duration = searchParams.get("duration");
    const addons = searchParams.getAll("addons");
    const staff = searchParams.get("staff");
    const gender = searchParams.get("gender");
  
    useEffect(() => {
      if (!isStepEnabled(currentStep)) {
        const next = getNextStep(currentStep);
        if (next) {
          navigate(getAppUrl(`/booking/${next}?${searchParams.toString()}`));
        }
      }
    }, []);
  
  const handleContinue = () => {
    const next = getNextStep(currentStep);
      if (!next || !selectedDate || !selectedTime) return;
  
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (category) params.append("category", category);
      if (service) params.append("service", service);
      if (duration) params.append("duration", duration);
      if (staff) params.append("staff", staff);
      if (gender) params.append("gender", gender);
      addons.forEach((a) => params.append("addons", a));
      params.append("date", selectedDate.toISOString());
      params.append("time", selectedTime);
  
    navigate(getAppUrl(`/booking/review?${params.toString()}`));
  };

    if (navigation.state === "loading") {
      return (
        <Page>
          <LegacyCard sectioned>Loading...</LegacyCard>
        </Page>
      );
    }
  
  return (
    <Page title="Select Date & Time">
      <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <Text variant="headingMd" as="h2">
                Pick a Date
              </Text>
              <DatePicker
                month={selectedDate.getMonth()}
                year={selectedDate.getFullYear()}
                onChange={(range) => {
                  if (range?.start) setSelectedDate(range.start);
                }}
                selected={{ start: selectedDate, end: selectedDate }}
                disableDatesBefore={new Date()}
                onMonthChange={() => {}}
              />
            </LegacyCard>
          </Layout.Section>
  
          <Layout.Section>
            <LegacyCard sectioned>
              <Text variant="headingMd" as="h2">
                Pick a Time
              </Text>
              <LegacyStack wrap spacing="tight">
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={slot}
                    outline={selectedTime !== slot}
                    primary={selectedTime === slot}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </LegacyStack>
            </LegacyCard>
          </Layout.Section>
  
          <Layout.Section>
            <Button
              primary
              fullWidth
              disabled={!selectedTime}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Layout.Section>
        </Layout>
    </Page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Page title="Error">
      <LegacyCard sectioned>{error ? String(error) : "Unknown error"}</LegacyCard>
    </Page>
  );
}

export function CatchBoundary() {
  return (
    <Page title="Error">
      <LegacyCard sectioned>Something went wrong.</LegacyCard>
    </Page>
  );
}
