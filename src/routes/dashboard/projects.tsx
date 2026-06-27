import { createFileRoute } from "@tanstack/react-router";
import { Folder } from "lucide-react";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
  staticData: {
    area: "Member",
    title: "Projects",
    sub: "Browse, join, and manage chapter projects",
  },
});

function ProjectsPage() {
  return (
    <div className="rounded-[20px] border border-border bg-card px-6 py-16 text-center shadow-[0px_4px_14px_rgba(112,144,176,0.14)] dark:shadow-[0px_4px_14px_rgba(0,0,0,0.4)]">
      <div className="mx-auto mb-4 inline-flex rounded-2xl bg-brand-teal/12 p-4 text-brand-teal">
        <Folder className="size-7" />
      </div>
      <h2 className="text-lg font-extrabold text-foreground">Projects are coming soon</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-brand-text-sub">
        The chapter projects experience for the member portal is still being built.
      </p>
    </div>
  );
}
