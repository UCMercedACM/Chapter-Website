import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  validateSearch: (search: Record<string, unknown>): { flow?: string } => ({
    flow: search.flow as string | undefined,
  }),
  beforeLoad: ({ search }) => {
    // For some reason Kratos sends a new recovery link to this route. There is literally
    // no way to fix it. So we have to just quickly redirect them to the correct location
    if (search.flow !== undefined) {
      redirect({ to: "/recovery", search: { settings: search.flow }, replace: true, throw: true });
    }
    redirect({
      to: "/dashboard",
      search: { settings: "profile" },
      mask: { to: "/dashboard/settings" },
      throw: true,
    });
  },
});
