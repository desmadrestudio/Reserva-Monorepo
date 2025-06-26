import { Page, Layout, Card, Button, Text } from "@shopify/polaris";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

const CATEGORIES = [
  { id: "cat1", name: "Category 1" },
  { id: "cat2", name: "Category 2" },
  { id: "cat3", name: "Category 3" },
];

export default function ChooseCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const location = searchParams.get("location");
  const currentStep = "category";

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(`/booking/${next}?location=${location}`);
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (location && selectedCategory && next) {
      navigate(`/booking/${next}?location=${location}&category=${selectedCategory}`);
    }
  };

  return (
    <Page title="Choose Category">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Choose a Service Category</Text>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {CATEGORIES.map((cat) => (
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