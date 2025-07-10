import { redirect, type LoaderFunction } from "@remix-run/node";
import { getAppUrl } from "~/utils/url";

export const loader: LoaderFunction = async () => redirect(getAppUrl("/dashboard/customers"));

export default function CustomersRedirect() {
  return null;
}
