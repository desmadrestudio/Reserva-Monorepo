// Helper to fetch from Shopify Storefront API
export async function shopifyFetch({ query, variables }: { query: string; variables?: Record<string, any>; }) {
  const domain = process.env.SHOPIFY_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables");
  }

  const response = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    throw json.errors;
  }

  return json.data;
}
