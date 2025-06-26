import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useSearchParams, useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

const SERVICES = {
  cat1: [
    { id: "svc1", name: "Service A1" },
    { id: "svc2", name: "Service A2" },
  ],
  cat2: [
    { id: "svc3", name: "Service B1" },
    { id: "svc4", name: "Service B2" },
  ],
  cat3: [
    { id: "svc5", name: "Service C1" },
    { id: "svc6", name: "Service C2" },
  ],
};

export default function ChooseServicePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const currentStep = "service";
  const location = searchParams.get("location");
  const category = searchParams.get("category");

  const availableServices = SERVICES[category as keyof typeof SERVICES] || [];

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(`/booking/${next}?location=${location}&category=${category}`);
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (location && category && selectedService && next) {
      navigate(
        `/booking/${next}?location=${location}&category=${category}&service=${selectedService}`
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
    <Page title="Choose Service">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Choose a Service</Text>

            {availableServices.length === 0 ? (
              <Text as="p" tone="subdued">No services found for this category.</Text>
            ) : (
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
                {availableServices.map((svc) => (
                  <Button
                    key={svc.id}
                    outline={selectedService !== svc.id}
                    primary={selectedService === svc.id}
                    onClick={() => setSelectedService(svc.id)}
                  >
                    {svc.name}
                  </Button>
                ))}
              </div>
            )}

            {selectedService && (
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