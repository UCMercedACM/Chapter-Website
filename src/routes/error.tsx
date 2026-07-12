import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import axios from "axios";

import { ORY_URL } from "@/lib/ory";

export const Route = createFileRoute("/error")({
  validateSearch: (search: Record<string, unknown>) => ({ id: search.id as string | undefined }),
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: async ({ deps }) => {
    const response = await axios.get<SelfServiceError>(`${ORY_URL}/self-service/errors`, {
      headers: { Accept: "application/json" },
      params: { id: deps.id },
      validateStatus: () => true,
    });

    if (response.status !== 200) redirect({ to: "/", throw: true });
    return response.data;
  },
  component: Error,
});

/// Types and Interfaces

interface SelfServiceError {
  error?: { code?: number; message?: string; reason?: string; status?: string };
}

/// Route

function Error() {
  const { error } = Route.useLoaderData();

  return (
    <div className="mx-auto min-h-[calc(100svh-8.75rem)] w-full max-w-lg px-4 pt-24 text-center md:min-h-[calc(100svh-10.25rem)] md:pt-32">
      {error?.code !== undefined && (
        <span className="text-[11.5px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
          Error {error.code}
        </span>
      )}
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
        {error?.status ?? "Something went wrong"}
      </h1>
      <p className="mt-4 text-sm/relaxed text-brand-text-sub">
        {error?.message ?? "An unexpected error occurred while signing you in."}
      </p>
      {error?.reason && <p className="mt-2 text-sm text-muted-foreground">{error.reason}</p>}
      <Link to="/login" className="mt-6 inline-block text-sm font-semibold underline">
        Back to sign in
      </Link>
    </div>
  );
}
