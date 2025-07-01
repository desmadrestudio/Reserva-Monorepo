import { flatRoutes } from "@remix-run/fs-routes";

export default {
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_lazyRouteDiscovery: true,
    v3_singleFetch: false,
    v3_routeConfig: true,
  },
  routes: () => flatRoutes(),
};
