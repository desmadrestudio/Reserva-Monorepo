import { useEffect } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "~/shopify.server";


// Loader: Auth required
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

// Action: Create and update product with GraphQL
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];

  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    }
  );

  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;

  const variantResponse = await admin.graphql(
    `#graphql
      mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
            barcode
            createdAt
          }
        }
      }
    `,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    }
  );

  const variantResponseJson = await variantResponse.json();

  return json({
    product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  });
};

// Component
export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const productId = fetcher.data?.product?.id?.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);

  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar
        title="Remix app template"
        primaryAction={{
          content: "Generate a product",
          onAction: generateProduct,
          loading: isLoading,
        }}
      />

      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd">Congrats on creating a new Shopify app 🎉</Text>
                <Text variant="bodyMd">
                  This embedded app template uses{" "}
                  <Link
                    url="https://shopify.dev/docs/apps/tools/app-bridge"
                    target="_blank"
                    removeUnderline
                  >
                    App Bridge
                  </Link>{" "}
                  examples like an{" "}
                  <Link url="app/additional" removeUnderline>
                    additional page
                  </Link>{" "}
                  and an{" "}
                  <Link
                    url="https://shopify.dev/docs/api/admin-graphql"
                    target="_blank"
                    removeUnderline
                  >
                    Admin GraphQL
                  </Link>{" "}
                  mutation demo.
                </Text>

                <Text variant="headingMd">Get started with products</Text>
                <Text variant="bodyMd">
                  Generate a product with GraphQL and get the JSON output.
                </Text>

                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                  {fetcher.data?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </Button>
                  )}
                </InlineStack>

                {fetcher.data?.product && (
                  <>
                    <Text variant="headingMd">productCreate mutation</Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.product, null, 2)}</code>
                      </pre>
                    </Box>

                    <Text variant="headingMd">productVariantsBulkUpdate mutation</Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>{JSON.stringify(fetcher.data.variant, null, 2)}</code>
                      </pre>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <Text variant="headingMd">App template specs</Text>
                <InlineStack align="space-between">
                  <Text>Framework</Text>
                  <Link url="https://remix.run" target="_blank" removeUnderline>
                    Remix
                  </Link>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text>Database</Text>
                  <Link url="https://www.prisma.io/" target="_blank" removeUnderline>
                    Prisma
                  </Link>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text>Interface</Text>
                  <span>
                    <Link
                      url="https://polaris.shopify.com"
                      target="_blank"
                      removeUnderline
                    >
                      Polaris
                    </Link>
                    {", "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </Link>
                  </span>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text>API</Text>
                  <Link
                    url="https://shopify.dev/docs/api/admin-graphql"
                    target="_blank"
                    removeUnderline
                  >
                    GraphQL API
                  </Link>
                </InlineStack>
              </Card>

              <Card>
                <Text variant="headingMd">Next steps</Text>
                <List>
                  <List.Item>
                    Build an{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                      target="_blank"
                      removeUnderline
                    >
                      example app
                    </Link>
                  </List.Item>
                  <List.Item>
                    Explore Shopify’s API with{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                      target="_blank"
                      removeUnderline
                    >
                      GraphiQL
                    </Link>
                  </List.Item>
                </List>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}