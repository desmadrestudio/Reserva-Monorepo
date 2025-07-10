import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { useNavigate, useNavigation, useRouteError, useSearchParams } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

const LOCATIONS = [
  { id: "loc1", name: "Location 1" },
  { id: "loc2", name: "Location 2" },
  { id: "loc3", name: "Location 3" },
];

export default function ChooseLocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const currentStep = "location";
  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(getAppUrl(`/booking/${next}`));
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (selectedLocation && next) {
      const params = new URLSearchParams();
      params.append("location", selectedLocation);
      if (serviceId) params.append("serviceId", serviceId);
      navigate(getAppUrl(`/booking/${next}?${params.toString()}`));
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
    <Page title="Start Your Booking">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Choose a Location</Text>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {LOCATIONS.map((loc) => (
                <Button
                  key={loc.id}
                  outline={selectedLocation !== loc.id}
                  primary={selectedLocation === loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                >
                  {loc.name}
                </Button>
              ))}
            </div>
            {selectedLocation && (
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
