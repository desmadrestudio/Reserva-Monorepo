import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { getAppUrl } from "~/utils/url";
import { Form, useNavigation, useRouteError } from "@remix-run/react";
import { useState } from "react";
import * as Polaris from "@shopify/polaris";

const { Page, Layout, Card, TextField, Button } = Polaris;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName")?.toString() ?? "";
  const lastName = formData.get("lastName")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";

  const params = new URLSearchParams({ firstName, lastName, email, phone });
  return redirect(getAppUrl(`/booking/checkout?${params.toString()}`));
};

export default function BookingContact() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <Page title="Contact Information">
      <Form method="post">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <TextField label="First Name" name="firstName" value={firstName} onChange={setFirstName} requiredIndicator autoComplete="given-name" />
              <TextField label="Last Name" name="lastName" value={lastName} onChange={setLastName} requiredIndicator autoComplete="family-name" />
              <TextField label="Email" type="email" name="email" value={email} onChange={setEmail} requiredIndicator autoComplete="email" />
              <TextField label="Phone Number" type="tel" name="phone" value={phone} onChange={setPhone} requiredIndicator autoComplete="tel" />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Button primary fullWidth submit loading={navigation.state === "submitting"}>
              Continue to Checkout
            </Button>
          </Layout.Section>
        </Layout>
      </Form>
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
