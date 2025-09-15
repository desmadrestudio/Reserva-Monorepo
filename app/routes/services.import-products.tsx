import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { Page, Layout, Card, BlockStack, InlineStack, Text, TextField, Select, Button, IndexTable, Badge } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { prisma } from "~/lib/prisma.server";
import { dollarsToCents } from "~/utils/money";

type ProductRow = {
  id: string;
  title: string;
  productType: string | null;
  status: string;
  image?: string | null;
  minPrice: number; // dollars
  variants: Array<{ id: string; title: string; price: number }>; // price dollars
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag") || "bookable";
  const q = url.searchParams.get("q") || "";
  const productType = url.searchParams.get("productType") || "";

  const parts: string[] = [];
  if (tag) parts.push(`tag:${tag}`);
  if (productType) parts.push(`product_type:${productType}`);
  if (q) parts.push(q);
  const query = parts.join(" AND ");

  const gql = `#graphql
    query Products($query: String, $first: Int!) {
      products(query: $query, first: $first, sortKey: TITLE) {
        edges {
          node {
            id
            title
            productType
            status
            images(first: 1) { edges { node { url } } }
            priceRangeV2 { minVariantPrice { amount currencyCode } }
            variants(first: 50) {
              edges { node { id title price } }
            }
          }
        }
      }
    }
  `;
  const res = await admin.graphql(gql, { variables: { query, first: 50 } });
  const data = await res.json();
  const edges = data?.data?.products?.edges || [];
  const products: ProductRow[] = edges.map((e: any) => {
    const n = e.node;
    const min = Number(n.priceRangeV2?.minVariantPrice?.amount ?? 0);
    const variants = (n.variants?.edges || []).map((v: any) => ({ id: v.node.id, title: v.node.title, price: Number(v.node.price) }));
    const image = n.images?.edges?.[0]?.node?.url ?? null;
    return { id: n.id, title: n.title, productType: n.productType ?? null, status: n.status, image, minPrice: min, variants };
  });
  return json({ products, tag, q, productType });
}

export async function action({ request }: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const fd = await request.formData();
  const ids = fd.getAll("ids").map((v) => String(v));
  if (ids.length === 0) return redirect("/services?ok=imported&added=0&skipped=0");

  // Fetch selected products via nodes query
  const gql = `#graphql
    query Nodes($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          productType
          status
          priceRangeV2 { minVariantPrice { amount currencyCode } }
          variants(first: 50) { edges { node { id title price } } }
        }
      }
    }
  `;
  const res = await admin.graphql(gql, { variables: { ids } });
  const data = await res.json();
  const nodes = data?.data?.nodes || [];

  let added = 0;
  let skipped = 0;
  for (const n of nodes) {
    if (!n || !n.id) continue;
    const exists = await prisma.service.findFirst({ where: { productId: n.id } });
    if (exists) {
      skipped++;
      continue;
    }
    const minDollars = Number(n.priceRangeV2?.minVariantPrice?.amount ?? 0);
    const basePrice = dollarsToCents(minDollars);
    const svc = await prisma.service.create({
      data: {
        name: n.title,
        category: n.productType || null,
        basePrice,
        baseMinutes: 60,
        productId: n.id,
        active: String(n.status).toLowerCase() === "active",
      },
      select: { id: true },
    });
    added++;

    const variants = (n.variants?.edges || []).map((v: any) => v.node);
    for (const v of variants) {
      const m = /([0-9]+)\s*min/i.exec(v.title || "");
      if (!m) continue;
      const minutes = Number(m[1]);
      const varDollars = Number(v.price ?? 0);
      const priceDelta = dollarsToCents(varDollars) - basePrice;
      await prisma.serviceDuration.create({
        data: {
          serviceId: svc.id,
          minutes,
          label: v.title || null,
          priceDelta,
          variantId: v.id,
        },
      });
    }
  }

  return redirect(`/services?ok=imported&added=${added}&skipped=${skipped}`);
}

export default function ImportProductsPage() {
  const { products, tag, q, productType } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const loading = nav.state === "submitting";
  const processing = loading;
  return (
    <Page title="Import Bookable Products" backAction={{ url: "/services" }}>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Filters</Text>
              <Form method="get" replace>
                <InlineStack gap="200" align="start">
                  <TextField label="Tag" name="tag" defaultValue={tag || "bookable"} autoComplete="off" />
                  <TextField label="Search" name="q" defaultValue={q || ""} autoComplete="off" />
                  <TextField label="Product type" name="productType" defaultValue={productType || ""} autoComplete="off" />
                  <Button submit>Apply</Button>
                </InlineStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">Results</Text>
              <Form method="post">
                <IndexTable
                  resourceName={{ singular: "product", plural: "products" }}
                  itemCount={products.length}
                  selectable={false}
                  condensed
                  headings={[{ title: "Select" }, { title: "Title" }, { title: "Type" }, { title: "Price" }, { title: "Status" }, { title: "Variants" }]}
                >
                  {products.map((p, i) => (
                    <IndexTable.Row id={p.id} key={p.id} position={i}>
                      <IndexTable.Cell>
                        <input type="checkbox" name="ids" value={p.id} />
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <InlineStack gap="200" align="start">
                          {p.image && <img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />}
                          <Text as="span">{p.title}</Text>
                        </InlineStack>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" tone="subdued">{p.productType || "—"}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span">${p.minPrice.toFixed(2)}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone={String(p.status).toLowerCase() === "active" ? "success" : "critical"}>{p.status}</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Text as="span" tone="subdued">{p.variants.length}</Text>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
                </IndexTable>
                <InlineStack align="end" gap="200">
                  <Button submit loading={processing}>Import selected</Button>
                </InlineStack>
              </Form>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

