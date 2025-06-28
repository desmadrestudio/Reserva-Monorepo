import { useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { useCart } from "~/components/CartProvider";

const { Page, Layout, Card, Button } = Polaris;

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const handleConfirm = () => {
    addToCart({
      id: "mock-variant",
      title: "Sample Service",
      price: 100,
      quantity: 1,
      variantId: "gid://shopify/ProductVariant/123",
    });
    navigate("/dashboard/checkout");
  };

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Confirm Booking">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Button primary fullWidth onClick={handleConfirm}>
              Confirm and Checkout
            </Button>
          </Card>
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
