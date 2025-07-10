import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  ChoiceList,
} from "@shopify/polaris";
import { useSearchParams, useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
import { useState, useEffect } from "react";
import { getNextStep, isStepEnabled } from "~/utils/bookingFlow";

// 🧪 Mock Staff
const STAFF_MEMBERS = [
  { id: "staff1", name: "Alex J." },
  { id: "staff2", name: "Morgan T." },
  { id: "staff3", name: "Taylor R." },
  { id: "no_pref", name: "No Preference" },
];

const GENDER_CHOICES = [
  { label: "No preference", value: "none" },
  { label: "Male provider", value: "male" },
  { label: "Female provider", value: "female" },
];

export default function ChooseStaffPage() {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [genderPref, setGenderPref] = useState<string>("none");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const currentStep = "therapist"; // still using therapist key in config
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const service = searchParams.get("service");
  const duration = searchParams.get("duration");
  const addons = searchParams.getAll("addons"); // multiple possible

  useEffect(() => {
    if (!isStepEnabled(currentStep)) {
      const next = getNextStep(currentStep);
      if (next) {
        const params = new URLSearchParams();
        if (location) params.append("location", location);
        if (category) params.append("category", category);
        if (service) params.append("service", service);
        if (duration) params.append("duration", duration);
        addons.forEach((a) => params.append("addons", a));
        navigate(getAppUrl(`/booking/${next}?${params.toString()}`));
      }
    }
  }, []);

  const handleContinue = () => {
    const next = getNextStep(currentStep);
    if (!next) return;

    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (category) params.append("category", category);
    if (service) params.append("service", service);
    if (duration) params.append("duration", duration);
    addons.forEach((a) => params.append("addons", a));
    if (selectedStaff) params.append("staff", selectedStaff);
    if (genderPref && genderPref !== "none") {
      params.append("gender", genderPref);
    }

    navigate(getAppUrl(`/booking/${next}?${params.toString()}`));
  };

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Staff or Provider Preference">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">Choose Staff Member (Optional)</Text>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {STAFF_MEMBERS.map((staff) => (
                <Button
                  key={staff.id}
                  outline={selectedStaff !== staff.id}
                  primary={selectedStaff === staff.id}
                  onClick={() => setSelectedStaff(staff.id)}
                >
                  {staff.name}
                </Button>
              ))}
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned title="Gender Preference (Optional)">
            <ChoiceList
              title="Preferred Provider Gender"
              choices={GENDER_CHOICES}
              selected={[genderPref]}
              onChange={(value) => setGenderPref(value[0])}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <div style={{ marginTop: "1.5rem" }}>
            <Button primary fullWidth onClick={handleContinue}>
              Continue
            </Button>
          </div>
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