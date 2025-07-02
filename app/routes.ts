import { dirname, resolve, join } from "path";
import { readdirSync } from "fs";
import {
  flatRoutesUniversal,
} from "@remix-run/dev/dist/config/flat-routes.js";
import {
  routeManifestToRouteConfig,
  setRouteConfigAppDirectory,
} from "@remix-run/dev/dist/config/routes.js";
import { fileURLToPath } from "url";

setRouteConfigAppDirectory(resolve(dirname(fileURLToPath(import.meta.url))));

function gatherFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...gatherFiles(full));
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      files.push(full);
    }
  }
  return files;
}

const routesPromise = (async () => {
  const appDir = resolve(dirname(fileURLToPath(import.meta.url)));
  const routeFiles = gatherFiles(join(appDir, "routes"));
  const manifest = flatRoutesUniversal(appDir, routeFiles, "routes");
  return routeManifestToRouteConfig(manifest);
})();

export default routesPromise;
