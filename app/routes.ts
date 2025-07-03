import fs from "fs/promises";
import path, { dirname, resolve } from "path";
import { flatRoutesUniversal } from "@remix-run/dev/dist/config/flat-routes.js";
import {
  routeManifestToRouteConfig,
  setRouteConfigAppDirectory,
} from "@remix-run/dev/dist/config/routes.js";
import { fileURLToPath } from "url";

setRouteConfigAppDirectory(resolve(dirname(fileURLToPath(import.meta.url))));

const ROUTE_EXTS = [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"];

async function collectFiles(dir: string): Promise<string[]> {
  let entries = await fs.readdir(dir, { withFileTypes: true });
  let files: string[] = [];
  for (let entry of entries) {
    if (entry.name.startsWith(".")) continue;
    let full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)));
    } else if (ROUTE_EXTS.some(ext => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const routesPromise = (async () => {
  const appDir = resolve(dirname(fileURLToPath(import.meta.url)));
  const routesDir = path.join(appDir, "routes");
  const files = await collectFiles(routesDir);
  const manifest = flatRoutesUniversal(appDir, files, "routes");
  return routeManifestToRouteConfig(manifest);
})();

export default routesPromise;
