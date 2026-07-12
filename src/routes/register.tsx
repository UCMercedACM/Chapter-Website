import { SiGoogle } from "@icons-pack/react-simple-icons";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useCallback, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { csrfToken, oryInit, orySubmit } from "@/lib/ory";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): { flow?: string; return_to?: string } => ({
    flow: search.flow as string | undefined,
    return_to: search.return_to as string | undefined,
  }),
  loaderDeps: ({ search }) => ({ flowId: search.flow, returnTo: search.return_to }),
  loader: ({ deps }) => oryInit("registration", deps),
  component: Register,
});

/// Types and Interfaces

type RegisterField = "display_name" | "email" | "name" | "password";

/// Constants

type RegisterFormValues = z.infer<typeof registerSchema>;
const BLANK_REGISTER_FORM: RegisterFormValues = {
  email: "",
  name: "",
  display_name: "",
  password: "",
};

const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const INPUT_CLASS = "h-11 border-muted-foreground/45";

/// Zod schema

const registerSchema = z.object({
  email: z.email("Enter a valid email."),
  name: z.string().trim().min(1, "Enter your name."),
  display_name: z.string(),
  password: z.string().min(12, "Use at least 12 characters."),
});

/// Route

function Register() {
  const navigate = useNavigate();
  const loaderFlow = Route.useLoaderData();

  const [flow, setFlow] = useState(loaderFlow);
  const [loadedId, setLoadedId] = useState(loaderFlow.id);
  if (loadedId !== loaderFlow.id) {
    setLoadedId(loaderFlow.id);
    setFlow(loaderFlow);
  }

  const form = useForm({
    defaultValues: BLANK_REGISTER_FORM,
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      const response = await orySubmit(flow.ui.action, {
        method: "password",
        csrf_token: csrfToken(flow),
        password: value.password,
        traits: {
          email: value.email,
          name: value.name,
          display_name: value.display_name || undefined,
        },
      });

      if (response.kind === "validation") {
        setFlow(response.flow);
        return;
      }
      if (response.kind === "success") {
        await (flow.return_to
          ? navigate({ href: flow.return_to })
          : navigate({ to: "/dashboard" }));
        return;
      }
      if (response.kind === "redirect") {
        await navigate({ href: response.url });
        return;
      }
      await navigate({ to: "/register", search: {} });
    },
  });

  const handleText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      form.setFieldValue(name as RegisterField, value);
    },
    [form],
  );
  const handleSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      void form.handleSubmit();
    },
    [form],
  );

  const serverErrors = flow.ui.messages?.filter((message) => message.type === "error") ?? [];

  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-lg items-center justify-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold">Create account</CardTitle>
          <CardDescription className="text-base">Join the ACM member portal.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {serverErrors.length > 0 && (
              <div className="flex flex-col gap-1 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2">
                {serverErrors.map((message) => (
                  <p key={message.id} className={FIELD_ERROR_CLASS}>
                    {message.text}
                  </p>
                ))}
              </div>
            )}

            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className={INPUT_CLASS}
                    value={field.state.value}
                    onChange={handleText}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <span className={FIELD_ERROR_CLASS}>{field.state.meta.errors[0]?.message}</span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    className={INPUT_CLASS}
                    value={field.state.value}
                    onChange={handleText}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <span className={FIELD_ERROR_CLASS}>{field.state.meta.errors[0]?.message}</span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="display_name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="display_name">Display name (optional)</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    autoComplete="nickname"
                    className={INPUT_CLASS}
                    value={field.state.value}
                    onChange={handleText}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={INPUT_CLASS}
                    value={field.state.value}
                    onChange={handleText}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <span className={FIELD_ERROR_CLASS}>{field.state.meta.errors[0]?.message}</span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold"
                  disabled={!state.canSubmit || state.isSubmitting}
                >
                  {state.isSubmitting ? "Creating account…" : "Create account"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* TODO: Wire up Google Oauth2 and SSO (if needed)*/}
          <div className="flex flex-col gap-3">
            <Button type="button" variant="outline" size="lg" className="w-full font-semibold">
              <SiGoogle />
              Continue with Google
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full font-semibold">
              <Building2 />
              Continue with SSO
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-foreground underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
