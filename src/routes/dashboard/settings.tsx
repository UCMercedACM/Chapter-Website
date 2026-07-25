import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  beforeLoad: () => {
    redirect({
      to: "/dashboard",
      search: { settings: "profile" },
      mask: { to: "/dashboard/settings" },
      throw: true,
    });
  },
});
