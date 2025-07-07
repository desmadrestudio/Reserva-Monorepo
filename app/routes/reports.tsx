import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => redirect("/dashboard/reports");

export default function ReportsRedirect() {
  return null;
}
