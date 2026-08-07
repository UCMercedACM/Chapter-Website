import { useForm } from "@tanstack/react-form";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { Eye, EyeOff, KeyRound, MailCheck } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type Flow,
  type SubmitBody,
  ACCEPT_JSON,
  ORY_URL,
  csrfToken,
  oryInit,
  orySubmit,
} from "@/lib/ory";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recovery")({
  validateSearch: (search: Record<string, unknown>): { flow?: string; settings?: string } => ({
    flow: search.flow as string | undefined,
    settings: search.settings as string | undefined,
  }),
  loaderDeps: ({ search }) => ({ flowId: search.flow, settingsFlowId: search.settings }),
  loader: async ({ context: { queryClient }, deps }) => {
    if (deps.settingsFlowId !== undefined) {
      const { status, data } = await axios.get<Flow & SubmitBody>(
        `${ORY_URL}/self-service/settings/flows`,
        { ...ACCEPT_JSON, params: { id: deps.settingsFlowId }, validateStatus: () => true },
      );

      if (status === 200) {
        queryClient.setQueryData(settingsFlowQueryOptions(deps.settingsFlowId).queryKey, data);
        return;
      }

      const stepUp = data.error?.details?.redirect_browser_to;
      if (stepUp === undefined) return redirect({ to: "/login", search: {} });

      const returnTo = new URL("/recovery", globalThis.location.origin);
      returnTo.searchParams.set("settings", deps.settingsFlowId);

      const challenge = new URL(stepUp);
      challenge.searchParams.set("return_to", returnTo.href);
      return redirect({ href: challenge.href });
    }

    if (deps.flowId === undefined) {
      const fresh = await axios.get<Flow>(`${ORY_URL}/self-service/recovery/browser`, {
        ...ACCEPT_JSON,
        validateStatus: () => true,
      });
      if (fresh.status !== 200)
        return redirect({ to: "/dashboard", search: { settings: "profile" } });
      return redirect({ to: "/recovery", search: { flow: fresh.data.id } });
    }

    const { status, data } = await axios.get<Flow>(`${ORY_URL}/self-service/recovery/flows`, {
      ...ACCEPT_JSON,
      params: { id: deps.flowId },
      validateStatus: () => true,
    });
    if (status !== 200) return redirect({ to: "/recovery", search: {} });
    queryClient.setQueryData(recoveryFlowQueryOptions(deps.flowId).queryKey, data);
  },
  component: Recovery,
});

/// Types and Interfaces

interface RequestLinkInput {
  flow: Flow;
  email: string;
}

interface ChangePasswordInput {
  flow: Flow;
  password: string;
}

/// Constants - stable/empty data

type EmailFormValues = z.infer<typeof emailSchema>;
const BLANK_EMAIL_FORM: EmailFormValues = {
  email: "",
};

type PasswordFormValues = z.infer<typeof passwordSchema>;
const BLANK_PASSWORD_FORM: PasswordFormValues = {
  password: "",
  confirmPassword: "",
};

const BLANK_LOGIN_SEARCH = {};

/// Constants - regular

const FIELD_ERROR_CLASS = "text-[12px] font-semibold text-[#e13737] dark:text-[#ff6b6b]";
const INPUT_CLASS = "h-11 border-muted-foreground/45";
const PASSWORD_INPUT_CLASS = "h-11 border-muted-foreground/45 pr-11";
const REVEAL_BUTTON_CLASS =
  "absolute top-0 right-0 size-11 text-muted-foreground hover:bg-transparent hover:text-foreground";
const MESSAGE_BOX_CLASS = "flex flex-col gap-1 rounded-lg px-3 py-2";

/// Zod schemas

const emailSchema = z.object({
  email: z.email("Enter a valid email."),
});

const passwordSchema = z
  .object({
    password: z.string().min(12, "Use at least 12 characters."),
    confirmPassword: z.string().min(1, "Re-enter your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Both passwords must match.",
    path: ["confirmPassword"],
  });

/// Tanstack Query options

const recoveryFlowQueryOptions = (flowId: string | undefined) =>
  queryOptions({
    queryKey: ["ory", "recovery", flowId],
    queryFn: () => oryInit("recovery", { flowId }),
    enabled: flowId !== undefined,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

const settingsFlowQueryOptions = (flowId: string | undefined) =>
  queryOptions({
    queryKey: ["ory", "settings", flowId],
    queryFn: () => oryInit("settings", { flowId }),
    enabled: flowId !== undefined,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

/// Route

function Recovery() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { flow: flowId, settings: settingsFlowId } = Route.useSearch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: recoveryFlow } = useQuery(recoveryFlowQueryOptions(flowId));
  const settingsQuery = useQuery(settingsFlowQueryOptions(settingsFlowId));
  const settingsFlow = settingsQuery.data;

  const { mutate: requestLink, isPending: sendingLink } = useMutation({
    mutationFn: async ({ flow, email }: RequestLinkInput) =>
      await orySubmit(flow.ui.action, {
        method: "link",
        email,
        csrf_token: csrfToken(flow),
      }),
    onSuccess: async (result) => {
      if ((result.kind === "success" || result.kind === "validation") && result.flow) {
        queryClient.setQueryData(recoveryFlowQueryOptions(flowId).queryKey, result.flow);
        return;
      }

      if (result.kind === "expired" && result.reason === "session_already_available") {
        toast.info("You're already signed in — change your password from account settings.");
        await navigate({ to: "/dashboard", search: { settings: "profile" } });
        return;
      }
      toast.error("That reset request expired. Please try again.");
    },
    onError: () => toast.error("Couldn't send the reset link. Please try again."),
  });

  const emailForm = useForm({
    defaultValues: BLANK_EMAIL_FORM,
    validators: { onChange: emailSchema },
    onSubmit: ({ value }) => {
      if (recoveryFlow) requestLink({ flow: recoveryFlow, email: value.email });
    },
  });

  const { mutate: changePassword, isPending: savingPassword } = useMutation({
    mutationFn: async ({ flow, password }: ChangePasswordInput) =>
      await orySubmit(flow.ui.action, {
        method: "password",
        password,
        csrf_token: csrfToken(flow),
      }),
    onSuccess: async (result) => {
      if (result.kind === "success") {
        toast.success("Password updated");
        await navigate({ to: "/dashboard" });
        return;
      }
      if (result.kind === "validation") {
        queryClient.setQueryData(settingsFlowQueryOptions(settingsFlowId).queryKey, result.flow);
        return;
      }
      toast.error("That reset link expired. Request a new one to set a password.");
      await navigate({ to: "/recovery", search: {} });
    },
    onError: () => toast.error("Couldn't update your password. Please try again."),
  });

  const passwordForm = useForm({
    defaultValues: BLANK_PASSWORD_FORM,
    validators: { onChange: passwordSchema },
    onSubmit: ({ value }) => {
      if (settingsFlow) changePassword({ flow: settingsFlow, password: value.password });
    },
  });

  const handleEmailText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      emailForm.setFieldValue("email", event.target.value);
    },
    [emailForm],
  );
  const handleEmailSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      void emailForm.handleSubmit();
    },
    [emailForm],
  );
  const handlePasswordText = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      passwordForm.setFieldValue(name as "confirmPassword" | "password", value);
    },
    [passwordForm],
  );
  const handlePasswordSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      void passwordForm.handleSubmit();
    },
    [passwordForm],
  );
  const toggleShowPassword = useCallback(() => {
    setShowPassword((previous) => !previous);
  }, []);
  const toggleShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((previous) => !previous);
  }, []);

  const onPasswordStep = settingsFlowId !== undefined;
  const linkErrors = recoveryFlow?.ui.messages?.filter((message) => message.type === "error") ?? [];
  const linkNotices =
    recoveryFlow?.ui.messages?.filter((message) => message.type !== "error") ?? [];
  const passwordErrors =
    settingsFlow?.ui.nodes
      .filter((node) => node.attributes.name === "password")
      .flatMap((node) => node.messages)
      .filter((message) => message.type === "error") ?? [];

  return (
    <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-lg items-center justify-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted">
            {onPasswordStep ? (
              <KeyRound className="size-6 text-brand-sky-text" />
            ) : (
              <MailCheck className="size-6 text-brand-sky-text" />
            )}
          </div>
          <CardTitle className="text-3xl font-extrabold">
            {onPasswordStep ? "Set a new password" : "Reset your password"}
          </CardTitle>
          <CardDescription className="text-base">
            {onPasswordStep
              ? "Pick something you haven't used here before."
              : "We'll email you a link to set a new one. It expires in 60 minutes."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!onPasswordStep && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
              {linkErrors.length > 0 && (
                <div
                  className={cn(
                    MESSAGE_BOX_CLASS,
                    "border border-destructive/40 bg-destructive/10",
                  )}
                >
                  {linkErrors.map((message) => (
                    <p key={message.id} className={FIELD_ERROR_CLASS}>
                      {message.text}
                    </p>
                  ))}
                </div>
              )}

              {linkNotices.length > 0 && (
                <div className={cn(MESSAGE_BOX_CLASS, "border border-border bg-muted")}>
                  {linkNotices.map((message) => (
                    <p key={message.id} className="text-[12px] font-semibold text-muted-foreground">
                      {message.text}
                    </p>
                  ))}
                </div>
              )}

              <emailForm.Field name="email">
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
                      onChange={handleEmailText}
                    />
                    {field.state.meta.isTouched && !field.state.meta.isValid && (
                      <span className={FIELD_ERROR_CLASS}>
                        {field.state.meta.errors[0]?.message}
                      </span>
                    )}
                  </div>
                )}
              </emailForm.Field>

              <emailForm.Subscribe>
                {(state) => (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold"
                    disabled={!state.canSubmit || sendingLink}
                  >
                    {sendingLink ? "Sending…" : "Email me a reset link"}
                  </Button>
                )}
              </emailForm.Subscribe>
            </form>
          )}

          {onPasswordStep && settingsQuery.isError && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2">
                <p className={FIELD_ERROR_CLASS}>
                  That reset link is no longer valid. Request a new one to continue.
                </p>
              </div>
              <Button
                size="lg"
                variant="outline"
                className="w-full font-semibold"
                render={<Link to="/recovery" search={BLANK_LOGIN_SEARCH} />}
              >
                Start over
              </Button>
            </div>
          )}

          {onPasswordStep && !settingsQuery.isError && !settingsFlow && (
            <div className="flex flex-col gap-5">
              {Array.from({ length: 2 }, (_, index) => (
                <Skeleton key={index} className="h-11 w-full rounded-md" />
              ))}
            </div>
          )}

          {onPasswordStep && settingsFlow && (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
              {passwordErrors.length > 0 && (
                <div
                  className={cn(
                    MESSAGE_BOX_CLASS,
                    "border border-destructive/40 bg-destructive/10",
                  )}
                >
                  {passwordErrors.map((message) => (
                    <p key={message.id} className={FIELD_ERROR_CLASS}>
                      {message.text}
                    </p>
                  ))}
                </div>
              )}

              <passwordForm.Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">New password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={PASSWORD_INPUT_CLASS}
                        value={field.state.value}
                        onChange={handlePasswordText}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={REVEAL_BUTTON_CLASS}
                        aria-label={showPassword ? "Hide new password" : "Show new password"}
                        aria-pressed={showPassword}
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {field.state.meta.isTouched && !field.state.meta.isValid && (
                      <span className={FIELD_ERROR_CLASS}>
                        {field.state.meta.errors[0]?.message}
                      </span>
                    )}
                  </div>
                )}
              </passwordForm.Field>

              <passwordForm.Field name="confirmPassword">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={PASSWORD_INPUT_CLASS}
                        value={field.state.value}
                        onChange={handlePasswordText}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={REVEAL_BUTTON_CLASS}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password confirmation"
                            : "Show password confirmation"
                        }
                        aria-pressed={showConfirmPassword}
                        onClick={toggleShowConfirmPassword}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {field.state.meta.isTouched && !field.state.meta.isValid && (
                      <span className={FIELD_ERROR_CLASS}>
                        {field.state.meta.errors[0]?.message}
                      </span>
                    )}
                  </div>
                )}
              </passwordForm.Field>

              <passwordForm.Subscribe>
                {(state) => (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold"
                    disabled={!state.canSubmit || savingPassword}
                  >
                    {savingPassword ? "Saving…" : "Save new password"}
                  </Button>
                )}
              </passwordForm.Subscribe>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link
              to="/login"
              search={BLANK_LOGIN_SEARCH}
              className="font-semibold text-foreground underline"
            >
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
