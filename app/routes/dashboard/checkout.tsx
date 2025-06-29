import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useNavigation, useRouteError } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { useCart } from "~/ui/CartProvider"; // 🔄 updated path after ui refactor
import { requireUserId } from "~/utils/auth.server";

const { Page, Layout, Card, Text, Button } = Polaris;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  await requireUserId(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  await requireUserId(request);
  const formData = await request.formData();
  const cartString = formData.get("cart");
  const cart = cartString ? JSON.parse(String(cartString)) : [];

  const variables = {
    input: {
      lineItems: cart.map((item: any) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };

  const response = await admin.graphql(
    `#graphql
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout { webUrl }
        }
      }
    `,
    { variables }
  );

  const jsonResp = await response.json();
  const webUrl = jsonResp.data.checkoutCreate.checkout.webUrl;
  return redirect(webUrl);
};

export default function Checkout() {
  const navigation = useNavigation();
  const { cartItems } = useCart();

  return (
    <Page title="Checkout">
      <Form method="post">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Text variant="headingMd">Cart Items</Text>
              {cartItems.length === 0 ? (
                <Text>No items in cart</Text>
              ) : (
                cartItems.map((item, idx) => (
                  <Text key={idx}>{item.title} × {item.quantity}</Text>
                ))
              )}
              <input type="hidden" name="cart" value={JSON.stringify(cartItems)} />
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
