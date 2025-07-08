import { useNavigate, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { useBookingCart } from "~/ui/BookingCartProvider"; // 🔄 updated path after ui refactor

const { Page, Layout, Card, Button, Text, Stack } = Polaris;

export default function BookingCartPage() {
  const { bookings, removeBooking } = useBookingCart();
  const navigate = useNavigate();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  const handleContinue = () => {
    navigate("booking/contact");
  };

  return (
    <Page title="Your Booking Cart">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {bookings.length === 0 ? (
              <Text>No bookings in cart.</Text>
            ) : (
              <Stack vertical spacing="tight">
                {bookings.map((booking) => (
                  <Stack alignment="center" key={booking.id} spacing="tight">
                    <Stack.Item fill>
                      <Text>
                        {booking.title} - {booking.date} {booking.time}
                      </Text>
                    </Stack.Item>
                    <Button destructive onClick={() => removeBooking(booking.id)}>
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
          {bookings.length > 0 && (
            <Card sectioned>
              <Button primary fullWidth onClick={handleContinue}>
                Continue to Contact Info
              </Button>
            </Card>
          )}
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
