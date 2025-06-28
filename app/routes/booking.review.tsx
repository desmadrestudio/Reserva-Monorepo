import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Stack,
} from "@shopify/polaris";
import {
  useSearchParams,
  useNavigation,
  useRouteError,
  useNavigate,
} from "@remix-run/react";
import { useBookingCart } from "~/components/BookingCartProvider";
  
  
export default function ReviewBooking() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { addBooking } = useBookingCart();

  const service = searchParams.get("service");
  const duration = searchParams.get("duration");
  const staff = searchParams.get("staff");
  const gender = searchParams.get("gender");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const addons = searchParams.getAll("addons");

  const handleAddBooking = () => {
    addBooking({
      id: Date.now(),
      serviceId: service ?? "",
      title: service ?? "",
      size: duration ?? "",
      staff: staff ?? "",
      gender: gender ?? "",
      addons,
      time: time ?? "",
      date: date ?? "",
    });
    navigate("/booking/cart");
  };

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "Not selected";

    if (navigation.state === "loading") {
      return (
        <Page>
          <Card sectioned>Loading...</Card>
        </Page>
      );
    }
  
  return (
    <Page title="Review Booking">
      <Layout>
          <Layout.Section>
            <Card sectioned title="You're Booking:">
              <Stack vertical spacing="tight">
                <Text>
                  <strong>Service:</strong> {service ?? "Not selected"}
                </Text>
                <Text>
                  <strong>Duration:</strong> {duration ?? "Not selected"} mins
                </Text>
                <Text>
                  <strong>Date:</strong> {formattedDate}
                </Text>
                <Text>
                  <strong>Time:</strong> {time ?? "Not selected"}
                </Text>
                {staff && (
                  <Text>
                    <strong>Staff:</strong> {staff}
                  </Text>
                )}
                {gender && gender !== "none" && (
                  <Text>
                    <strong>Gender Pref:</strong> {gender}
                  </Text>
                )}
                {addons.length > 0 && (
                  <Text>
                    <strong>Add-ons:</strong> {addons.join(", ")}
                  </Text>
                )}
              </Stack>
            </Card>
          </Layout.Section>
  
          <Layout.Section>
            <Card sectioned>
              <Button primary fullWidth onClick={handleAddBooking}>
                Add to Booking
              </Button>
            </Card>
            <Card sectioned>
              <Stack vertical spacing="tight">
                <Button url="/booking/location">✅ Book Another Service</Button>
                <Button primary url="/booking/cart">📦 View Cart</Button>
              </Stack>
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
