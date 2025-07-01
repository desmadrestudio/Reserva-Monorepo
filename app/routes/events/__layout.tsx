import { Outlet } from "@remix-run/react";
import { Page, Layout } from "@shopify/polaris";

export default function RouteLayout() {
  return (
    <Page>
      <Layout>
        <Outlet />
      </Layout>
    </Page>
  );
}
