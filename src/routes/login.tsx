import { SiGoogle } from "@icons-pack/react-simple-icons";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Building2, ShieldCheck } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useCallback, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { type Flow, type SubmitResponse, ORY_URL, csrfToken, oryInit, orySubmit } from "@/lib/ory";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { flow?: string; return_to?: string } => ({
    flow: search.flow as string | undefined,
    return_to: search.return_to as string | undefined,
  }),
  loaderDeps: ({ search }) => ({ flowId: search.flow, returnTo: search.return_to }),
  loader: ({ deps }) => oryInit("login", deps),
  component: Login,
});

/// Constants - stable/empty data

type LoginFormValues = z.infer<typeof loginSchema>;
const BLANK_LOGIN_FORM: LoginFormValues = {
  email: "",
  password: "",
};

type SecondFactorFormValues = z.infer<typeof secondFactorSchema>;
const BLANK_SECOND_FACTOR_FORM: SecondFactorFormValues = {
  code: "",
};

const BLANK_LOGIN_SEARCH = {};

/// Constants - regular

const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const INPUT_CLASS = "h-11 border-muted-foreground/45";
const BACKUP_INPUT_CLASS = "h-11 border-muted-foreground/45 text-center tracking-[0.3em]";
const OTP_SLOT_CLASS = "size-12 rounded-md border-l border-border bg-background text-lg";

/// Zod schema

const loginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

const secondFactorSchema = z.object({
  code: z.string().trim().min(6, "Enter the 6-digit code, or one of your backup codes."),
});

/// Route

function Login() {
  const navigate = useNavigate();
  const loaderFlow = Route.useLoaderData();

  const [flow, setFlow] = useState(loaderFlow);
  const [loadedId, setLoadedId] = useState(loaderFlow.id);
  const [usingBackup, setUsingBackup] = useState(false);
  if (loadedId !== loaderFlow.id) {
    setLoadedId(loaderFlow.id);
    setFlow(loaderFlow);
  }

  const finishLogin = useCallback(
    async (response: SubmitResponse) => {
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
      if (response.kind === "redirect" || response.kind === "refresh") {
        if (!response.url.startsWith(ORY_URL)) {
          await navigate({ href: response.url });
          return;
        }

        const { data } = await axios.get<Flow>(response.url, {
          headers: { Accept: "application/json" },
        });
        await navigate({ to: "/login", search: { flow: data.id }, replace: true });
        return;
      }
      await navigate({ to: "/login", search: {} });
    },
    [flow.return_to, navigate],
  );

  const form = useForm({
    defaultValues: BLANK_LOGIN_FORM,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      await finishLogin(
        await orySubmit(flow.ui.action, {
          method: "password",
          csrf_token: csrfToken(flow),
          identifier: value.email,
          password: value.password,
        }),
      );
    },
  });

  const secondFactorForm = useForm({
    defaultValues: BLANK_SECOND_FACTOR_FORM,
    validators: { onChange: secondFactorSchema },
    onSubmit: async ({ value, formApi }) => {
      const response = await orySubmit(
        flow.ui.action,
        usingBackup
          ? { method: "lookup_secret", lookup_secret: value.code, csrf_token: csrfToken(flow) }
          : { method: "totp", totp_code: value.code, csrf_token: csrfToken(flow) },
      );
      if (response.kind === "validation") formApi.reset();
      await finishLogin(response);
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
  const handleCode = useCallback(
    (value: string) => {
      secondFactorForm.setFieldValue("code", value);
      if (value.length === 6) void secondFactorForm.handleSubmit();
    },
    [secondFactorForm],
  );
  const handleBackupText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      secondFactorForm.setFieldValue("code", event.target.value);
    },
    [secondFactorForm],
  );
  const handleSecondFactorSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      void secondFactorForm.handleSubmit();
    },
    [secondFactorForm],
  );
  const toggleBackup = useCallback(() => {
    setUsingBackup((previous) => !previous);
    secondFactorForm.reset();
  }, [secondFactorForm]);

  const serverErrors = flow.ui.messages?.filter((message) => message.type === "error") ?? [];
  const needsSecondFactor = flow.ui.nodes.some((node) => node.attributes.name === "totp_code");
  const hasBackupCodes = flow.ui.nodes.some((node) => node.attributes.name === "lookup_secret");
  const challengeHint = usingBackup
    ? "Enter one of the backup codes you saved. Each one works a single time."
    : "Enter the 6-digit code from your authenticator app.";

  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-lg items-center justify-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          {needsSecondFactor && (
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted">
              <ShieldCheck className="size-6 text-brand-sky-text" />
            </div>
          )}
          <CardTitle className="text-3xl font-extrabold">
            {needsSecondFactor ? "Two-factor authentication" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-base">
            {needsSecondFactor ? challengeHint : "Sign in to your account to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {serverErrors.length > 0 && (
            <div className="flex flex-col gap-1 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2">
              {serverErrors.map((message) => (
                <p key={message.id} className={FIELD_ERROR_CLASS}>
                  {message.text}
                </p>
              ))}
            </div>
          )}

          {needsSecondFactor ? (
            <form onSubmit={handleSecondFactorSubmit} className="flex flex-col gap-5">
              <secondFactorForm.Field name="code">
                {(field) => (
                  <div className="flex flex-col items-center gap-2 py-4">
                    {usingBackup ? (
                      <div className="flex w-full flex-col gap-1.5">
                        <Label htmlFor="backup-code">Backup code</Label>
                        <Input
                          id="backup-code"
                          name="code"
                          autoComplete="one-time-code"
                          autoCapitalize="none"
                          spellCheck={false}
                          className={BACKUP_INPUT_CLASS}
                          value={field.state.value}
                          onChange={handleBackupText}
                        />
                      </div>
                    ) : (
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={field.state.value}
                        onChange={handleCode}
                        containerClassName="justify-center"
                      >
                        <InputOTPGroup className="gap-2">
                          {Array.from({ length: 6 }, (_, index) => (
                            <InputOTPSlot key={index} index={index} className={OTP_SLOT_CLASS} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                    {field.state.meta.isTouched && !field.state.meta.isValid && (
                      <span className={FIELD_ERROR_CLASS}>
                        {field.state.meta.errors[0]?.message}
                      </span>
                    )}
                  </div>
                )}
              </secondFactorForm.Field>

              <secondFactorForm.Subscribe>
                {(state) => (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold"
                    disabled={!state.canSubmit || state.isSubmitting}
                  >
                    {state.isSubmitting ? "Verifying…" : "Verify"}
                  </Button>
                )}
              </secondFactorForm.Subscribe>

              {hasBackupCodes && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mx-auto h-auto font-semibold"
                  onClick={toggleBackup}
                >
                  {usingBackup ? "Use your authenticator app" : "Use a backup code instead"}
                </Button>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Lost your device?{" "}
                <Link
                  to="/login"
                  search={BLANK_LOGIN_SEARCH}
                  className="font-semibold text-foreground underline"
                >
                  Start over
                </Link>
              </p>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                        <span className={FIELD_ERROR_CLASS}>
                          {field.state.meta.errors[0]?.message}
                        </span>
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
                        <span className={FIELD_ERROR_CLASS}>
                          {field.state.meta.errors[0]?.message}
                        </span>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
