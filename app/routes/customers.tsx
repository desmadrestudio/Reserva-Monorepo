import * as Polaris from "@shopify/polaris";

export default function CustomersPage() {
  return (
    <Polaris.Page title="Customers">
      <Polaris.Layout>
        <Polaris.Layout.Section>
          <Polaris.Card sectioned>
            <p>This is the Customers page.</p>
          </Polaris.Card>
        </Polaris.Layout.Section>
      </Polaris.Layout>
    </Polaris.Page>
  );
}
