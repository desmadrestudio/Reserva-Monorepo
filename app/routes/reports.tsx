import { redirect, type LoaderFunction } from "@remix-run/node";
import { getAppUrl } from "~/utils/url";

export const loader: LoaderFunction = async () => redirect(getAppUrl("/dashboard/reports"));

export default function ReportsRedirect() {
  return null;
}
