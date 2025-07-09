import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useSearchParams, useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
import { useState, useEffect } from "react";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

// 🧪 Mock durations (could vary by service)
const DURATIONS = [
  { id: "30", label: "30 minutes" },
  { id: "60", label: "60 minutes" },
  { id: "90", label: "90 minutes" },
];

export default function ChooseDurationPage() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const currentStep = "duration";
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const service = searchParams.get("service");

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(getAppUrl(`/booking/${next}?location=${location}&category=${category}&service=${service}`));
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (next && selectedDuration && location && category && service) {
      navigate(
        getAppUrl(
          `/booking/${next}?location=${location}&category=${category}&service=${service}&duration=${selectedDuration}`
        )
      );
    }
  };

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Choose Duration">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Select Duration</Text>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {DURATIONS.map((dur) => (
                <Button
                  key={dur.id}
                  outline={selectedDuration !== dur.id}
                  primary={selectedDuration === dur.id}
                  onClick={() => setSelectedDuration(dur.id)}
                >
                  {dur.label}
                </Button>
              ))}
            </div>

            {selectedDuration && (
              <div style={{ marginTop: "2rem" }}>
                <Button primary fullWidth onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            )}
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ height: "70px" }} />
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