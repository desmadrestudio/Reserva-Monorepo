import { Page, Layout } from "@shopify/polaris";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";
import AddOnsCard, { AddOn } from "~/components/booking/AddOnsCard";

// 🧪 Mock Add-ons
const ADDONS = [
  { id: "aroma", label: "Aromatherapy" },
  { id: "hot_stone", label: "Hot Stone Upgrade" },
  { id: "scalp", label: "Scalp Massage" },
  { id: "premium_oil", label: "Premium Oils" },
  { id: "priority", label: "Priority Booking" },
];

export default function AddOnsPage() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentStep = "addons";
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const service = searchParams.get("service");
  const duration = searchParams.get("duration");

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        navigate(
          `/booking/${next}?location=${location}&category=${category}&service=${service}&duration=${duration}`
        );
      }
    }
  }, []);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (next) {
      const addonParams = selectedAddons.map((a) => `addons=${a}`).join("&");

      const queryString = [
        `location=${location}`,
        `category=${category}`,
        `service=${service}`,
        `duration=${duration}`,
        addonParams,
      ]
        .filter(Boolean)
        .join("&");

      navigate(`/booking/${next}?${queryString}`);
    }
  };

  return (
    <Page title="Add-on Options">
      <Layout>
        <Layout.Section>
          <AddOnsCard
            addons={ADDONS}
            selected={selectedAddons}
            onToggle={toggleAddon}
            onContinue={handleContinue}
          />
        </Layout.Section>

        <Layout.Section>
          <div style={{ height: "70px" }} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}