import "./../index.css";

import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet, useRouterState } from "@tanstack/react-router";

import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navigation-bar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  const isDashboard = useRouterState({
    select: (state) => state.location.pathname.startsWith("/dashboard"),
  });

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-theme">
      <Navbar />
      {/* This only exists to prevent overflow issues on mobile */}
      <div className="overflow-x-hidden">
        <main className="flex-1">
          <Outlet />
        </main>
        {!isDashboard && <Footer />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
