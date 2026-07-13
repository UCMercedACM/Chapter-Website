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

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { flow?: string; return_to?: string } => ({
    flow: search.flow as string | undefined,
    return_to: search.return_to as string | undefined,
  }),
  loaderDeps: ({ search }) => ({ flowId: search.flow, returnTo: search.return_to }),
  loader: ({ deps }) => oryInit("login", deps),
  component: Login,
});

/// Constants

type LoginFormValues = z.infer<typeof loginSchema>;
const BLANK_LOGIN_FORM: LoginFormValues = {
  email: "",
  password: "",
};

const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const INPUT_CLASS = "h-11 border-muted-foreground/45";

/// Zod schema

const loginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

/// Route

function Login() {
  const navigate = useNavigate();
  const loaderFlow = Route.useLoaderData();

  const [flow, setFlow] = useState(loaderFlow);
  const [loadedId, setLoadedId] = useState(loaderFlow.id);
  if (loadedId !== loaderFlow.id) {
    setLoadedId(loaderFlow.id);
    setFlow(loaderFlow);
  }

  const form = useForm({
    defaultValues: BLANK_LOGIN_FORM,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      const response = await orySubmit(flow.ui.action, {
        method: "password",
        csrf_token: csrfToken(flow),
        identifier: value.email,
        password: value.password,
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
      await navigate({ to: "/login", search: {} });
    },
  });

  const handleText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      form.setFieldValue(name as "email" | "password", value);
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
          <CardTitle className="text-3xl font-extrabold">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue.
          </CardDescription>
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
                    autoComplete="username"
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

            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      className="h-auto px-0 font-semibold"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
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
                  {state.isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>

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
            New to the portal?{" "}
            <Link to="/register" className="font-semibold text-foreground underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
