import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { KeyRound } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { type Flow, csrfToken, oryInit, orySubmit } from "@/lib/ory";

// This is meant to be a temp 2fa route - most likely will get removed later
export const Route = createFileRoute("/dashboard/settings/totp")({
  component: TotpSettings,
  staticData: { area: "Settings", title: "Enroll TOTP", sub: "Temporary 2FA setup" },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(totpSettingsQueryOptions);
  },
});

/// Tanstack Query options

export const totpSettingsQueryOptions = queryOptions({
  queryKey: ["ory", "settings", "totp"],
  queryFn: () => oryInit("settings", {}),
  staleTime: 60_000,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
});

/// Route

function TotpSettings() {
  const queryClient = useQueryClient();
  const { data: flowData } = useQuery(totpSettingsQueryOptions);

  const [flow, setFlow] = useState(flowData);
  const [flowId, setFlowId] = useState(flowData?.id);
  const [code, setCode] = useState("");
  if (flowData && flowData.id !== flowId) {
    setFlowId(flowData.id);
    setFlow(flowData);
  }

  const { mutate: enroll, isPending } = useMutation({
    mutationFn: (submitFlow: Flow) =>
      orySubmit(submitFlow.ui.action, {
        method: "totp",
        totp_code: code,
        csrf_token: csrfToken(submitFlow),
      }),
    onSuccess: (result) => {
      if (result.kind === "validation") {
        setFlow(result.flow);
        toast.error("Couldn't enroll TOTP. Check the code and try again.");
        return;
      }
      if (result.kind === "redirect") {
        toast.error(
          "Your session needs a refresh to change security settings — log out, log back in, then retry within 15 minutes.",
        );
        return;
      }
      if (result.kind !== "success") {
        toast.error("Couldn't enroll TOTP. Check the code and try again.");
        return;
      }
      setCode("");
      toast.success("TOTP enrolled — the sudo 2FA step will accept your codes now.");
      return queryClient.invalidateQueries({ queryKey: totpSettingsQueryOptions.queryKey });
    },
    onError: () => toast.error("Couldn't enroll TOTP. Check the code and try again."),
  });

  const submit = useCallback(() => {
    if (flow && code.length === 6) enroll(flow);
  }, [flow, code, enroll]);

  const secret = flow?.ui.nodes.find((node) => node.attributes.id === "totp_secret_key")?.attributes
    .text?.text;
  const enrolled = flow?.ui.nodes.some((node) => node.attributes.name === "totp_unlink") ?? false;

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-extrabold">
            <KeyRound className="size-4.5 text-brand-teal-alt" />
            TOTP enrollment (temporary dev tool)
          </CardTitle>
          <CardDescription>
            Enrolls a second factor on your account so the sudo step-up has something to verify.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!flow && (
            <p className="text-[13px]/relaxed text-brand-text-sub">
              Couldn't reach Kratos to start a settings flow. Check that it's running and reload.
            </p>
          )}
          {flow && enrolled && (
            <p className="text-[13px]/relaxed text-brand-text-sub">
              This account already has TOTP enrolled — use your authenticator's current code at the
              sudo step. To re-enroll, remove the credential via the Kratos admin API first.
            </p>
          )}
          {flow && !enrolled && (
            <>
              <p className="text-[13px]/relaxed text-brand-text-sub">
                Copy this secret into your authenticator (e.g.{" "}
                <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[12px]">
                  oathtool --totp -b "SECRET"
                </code>
                {/*
                 */}), then confirm a 6-digit code to finish enrollment.
              </p>
              <code className="block rounded-lg border border-border bg-card px-3 py-2 font-mono text-[13px] break-all select-all">
                {secret ?? "…"}
              </code>
              <div className="flex flex-col gap-3">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={code}
                  onChange={setCode}
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-11 rounded-md border-l text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  className="bg-brand-teal font-bold text-primary hover:bg-brand-teal/85"
                  disabled={code.length < 6 || isPending}
                  onClick={submit}
                >
                  {isPending ? "Enrolling…" : "Enroll TOTP"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
