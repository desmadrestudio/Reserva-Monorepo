import { dirname, resolve } from "path";
import { flatRoutes } from "@remix-run/dev/dist/config/flat-routes.js";
import {
  routeManifestToRouteConfig,
  setRouteConfigAppDirectory,
} from "@remix-run/dev/dist/config/routes.js";
import { fileURLToPath } from "url";

setRouteConfigAppDirectory(resolve(dirname(fileURLToPath(import.meta.url))));

const routesPromise = (async () => {
  const appDir = resolve(dirname(fileURLToPath(import.meta.url)));
  const manifest = flatRoutes(appDir);
  return routeManifestToRouteConfig(manifest);
})();

export default routesPromise;
