import { lazy } from "react";

const routes = [
  {
    path: "dashboard",
    component: lazy(() => import("../../pages/dashboard/dashboard")),
  },
];

export default routes;
