import { Outlet } from "@remix-run/react";
import * as Polaris from "@shopify/polaris";

const { Page, Layout } = Polaris;

export default function AuthLayout() {
  return (
    <Page>
      <Layout>
        <Outlet />
      </Layout>
    </Page>
  );
}
