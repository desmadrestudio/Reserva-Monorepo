import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useSearchParams, useNavigate, useNavigation, useRouteError, useLoaderData } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
import { useState, useEffect } from "react";
import { prisma } from "~/lib/prisma.server";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

export const loader = async (_args: LoaderFunctionArgs) => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  return json({ categories });
};

export default function ChooseCategoryPage() {
  const { categories } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const location = searchParams.get("location");
  const serviceId = searchParams.get("serviceId");
  const currentStep = "category";

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        const params = new URLSearchParams();
        if (location) params.append("location", location);
        if (serviceId) params.append("serviceId", serviceId);
        navigate(getAppUrl(`/booking/${next}?${params.toString()}`));
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (location && selectedCategory && next) {
      const params = new URLSearchParams();
      params.append("location", location);
      params.append("category", selectedCategory);
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
    <Page title="Choose Category">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Choose a Service Category</Text>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  outline={selectedCategory !== cat.id}
                  primary={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            {selectedCategory && (
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