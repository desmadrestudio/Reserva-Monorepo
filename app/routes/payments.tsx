import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/payments");

export default function PaymentsRedirect() {
  return null;
}
