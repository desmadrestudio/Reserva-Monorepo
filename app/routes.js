import { flatRoutes } from "@remix-run/fs-routes";
import { setRouteConfigAppDirectory } from "@remix-run/dev/dist/config/routes.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

setRouteConfigAppDirectory(resolve(dirname(fileURLToPath(import.meta.url))));

export default function getRoutes() {
  return flatRoutes({ layoutFileNames: ["__layout"] });
}
