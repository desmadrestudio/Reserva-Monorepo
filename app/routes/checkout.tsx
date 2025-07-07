import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/checkout");

export default function CheckoutRedirect() {
  return null;
}
