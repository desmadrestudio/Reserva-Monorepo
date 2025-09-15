export type AdminClient = {
  graphql: (query: string, opts?: { variables?: any }) => Promise<{ json: () => Promise<any> }>;
};

export async function getProduct(admin: AdminClient, id: string) {
  const gql = `#graphql
    query Node($id: ID!) {
      node(id: $id) {
        ... on Product {
          id
          title
          productType
          status
          images(first: 1) { edges { node { url } } }
          priceRangeV2 { minVariantPrice { amount currencyCode } }
          variants(first: 100) { edges { node { id title price } } }
        }
      }
    }
  `;
  const res = await admin.graphql(gql, { variables: { id } });
  const data = await res.json();
  const node = data?.data?.node;
  if (!node) return null;
  const variants = (node.variants?.edges || []).map((e: any) => ({ id: e.node.id, title: e.node.title, price: Number(e.node.price) }));
  const image = node.images?.edges?.[0]?.node?.url ?? null;
  return {
    id: node.id as string,
    title: node.title as string,
    productType: node.productType as string | null,
    status: node.status as string,
    image,
    minPrice: Number(node.priceRangeV2?.minVariantPrice?.amount ?? 0),
    variants,
  };
}

export async function listBookableProducts(admin: AdminClient, { tag = "bookable", q = "", productType = "", first = 50 }: { tag?: string; q?: string; productType?: string; first?: number }) {
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
            variants(first: 50) { edges { node { id title price } } }
          }
        }
      }
    }
  `;
  const res = await admin.graphql(gql, { variables: { query, first } });
  const data = await res.json();
  const edges = data?.data?.products?.edges || [];
  return edges.map((e: any) => {
    const n = e.node;
    const variants = (n.variants?.edges || []).map((v: any) => ({ id: v.node.id, title: v.node.title, price: Number(v.node.price) }));
    const image = n.images?.edges?.[0]?.node?.url ?? null;
    return {
      id: n.id as string,
      title: n.title as string,
      productType: n.productType as string | null,
      status: n.status as string,
      image,
      minPrice: Number(n.priceRangeV2?.minVariantPrice?.amount ?? 0),
      variants,
    };
  });
}

