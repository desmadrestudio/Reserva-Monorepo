import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation, useRouteError, useSearchParams } from "@remix-run/react";
import { getAppUrl } from "~/utils/url";
import * as Polaris from "@shopify/polaris";
import { prisma } from "~/lib/prisma.server";
import { useBookingCart } from "~/ui/BookingCartProvider"; // 🔄 updated path after ui refactor

const { Page, Layout, Card, Button, Text, Stack } = Polaris;

export const loader = async (_args: LoaderFunctionArgs) => {
  const services = await prisma.service.findMany({
    select: { id: true, name: true, price: true, duration: true },
  });
  return json({ services });
};

export default function ServicePicker() {
  const { services } = useLoaderData<typeof loader>();
  const { addBooking } = useBookingCart();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  function handleAdd(service: (typeof services)[number]) {
    addBooking({
      id: Date.now(),
      serviceId: service.id,
      title: service.name,
      size: String(service.duration),
      staff: "",
      gender: "",
      addons: [],
      time: "",
      date: "",
    });
    const multi = searchParams.get("multi");
    navigate(multi === "true" ? getAppUrl("/booking/cart") : getAppUrl("/booking/review"));
  }

  if (navigation.state === "loading") {
    return (
      <Page>
        <Card sectioned>Loading...</Card>
      </Page>
    );
  }

  return (
    <Page title="Choose a Service">
      <Layout>
        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {services.map((svc) => (
              <Card key={svc.id} sectioned>
                <Stack vertical spacing="tight">
                  <Text variant="headingSm" as="h3">
                    {svc.name}
                  </Text>
                  <Text>{svc.price ? `$${svc.price.toFixed(2)}` : "$0.00"}</Text>
                  <Text>{svc.duration} mins</Text>
                  <Button primary onClick={() => handleAdd(svc)}>
                    Add to Booking
                  </Button>
                </Stack>
              </Card>
            ))}
          </div>
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
