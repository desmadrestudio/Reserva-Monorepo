import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/customers");

export default function CustomersRedirect() {
  return null;
}
