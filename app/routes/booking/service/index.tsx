import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useSearchParams, useNavigate, useNavigation, useRouteError, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { prisma } from "~/lib/prisma.server";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const services = await prisma.service.findMany({
    where: category ? { category } : undefined,
    select: { id: true, name: true },
  });
  return json({ services });
};

export default function ChooseServicePage() {
  const { services } = useLoaderData<typeof loader>();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const currentStep = "service";
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const preselectId = searchParams.get("serviceId");

  const availableServices = services;

  useEffect(() => {
    if (preselectId) {
      setSelectedService(preselectId);
    }
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(`/booking/${next}?location=${location}&category=${category}`);
      }
    }
  }, [preselectId]);

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
            <div style={{ marginTop: "1rem" }}>
              <Button url="/booking/service-picker?multi=true" fullWidth>
                Browse All Services
              </Button>
            </div>
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