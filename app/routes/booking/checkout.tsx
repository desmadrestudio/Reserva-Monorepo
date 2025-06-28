import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useNavigation, useSearchParams, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { useBookingCart } from "~/components/BookingCartProvider";
import { shopifyFetch } from "~/lib/shopify.server";
import { prisma } from "~/lib/prisma.server";

const { Page, Layout, Card, Text, Button } = Polaris;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const bookingsString = formData.get("bookings");
  const firstName = formData.get("firstName")?.toString() ?? "";
  const lastName = formData.get("lastName")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const phone = formData.get("phone")?.toString() ?? "";
  const bookings = bookingsString ? JSON.parse(String(bookingsString)) : [];

  const lineItems = (
    await Promise.all(
      bookings.map(async (b: any) => {
        const service = await prisma.service.findUnique({
          where: { id: String(b.serviceId) },
          select: { variantId: true },
        });
        if (!service?.variantId) return null;
        return { variantId: service.variantId, quantity: 1 };
      })
    )
  ).filter(Boolean);

  const variables = {
    input: {
      lineItems,
      note: `${firstName} ${lastName} ${email} ${phone}`.trim(),
    },
  };

  const data = await shopifyFetch({
    query: `#graphql
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout { webUrl }
        }
      }
    `,
    variables,
  });

  const webUrl = data.checkoutCreate.checkout.webUrl;
  return redirect(webUrl);
};

export default function BookingCheckout() {
  const { bookings } = useBookingCart();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const firstName = searchParams.get("firstName") ?? "";
  const lastName = searchParams.get("lastName") ?? "";
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";

  return (
    <Page title="Checkout">
      <Form method="post">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              {bookings.length === 0 ? (
                <Text>No bookings in cart</Text>
              ) : (
                bookings.map((b) => (
                  <Text key={b.id}>{b.title} - {b.date} {b.time}</Text>
                ))
              )}
              <input type="hidden" name="bookings" value={JSON.stringify(bookings)} />
              <input type="hidden" name="firstName" value={firstName} />
              <input type="hidden" name="lastName" value={lastName} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="phone" value={phone} />
              <Button primary submit loading={navigation.state === "submitting"}>
                Checkout
              </Button>
            </Card>
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
