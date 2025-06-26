import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useSearchParams, useNavigate } from "@remix-run/react";
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

  const currentStep = "duration";
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const service = searchParams.get("service");

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(`/booking/${next}?location=${location}&category=${category}&service=${service}`);
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (next && selectedDuration && location && category && service) {
      navigate(
        `/booking/${next}?location=${location}&category=${category}&service=${service}&duration=${selectedDuration}`
      );
    }
  };

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