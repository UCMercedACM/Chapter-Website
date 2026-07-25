import axios from "axios";

/// Types and Interfaces

type SubmitBody = Partial<Flow> & { error?: { id?: string }; redirect_browser_to?: string };
export type FlowType = "login" | "registration" | "recovery" | "verification" | "settings";

export type SubmitResponse =
  | { flow?: Flow; kind: "success" }
  | { flow: Flow; kind: "validation" }
  | { kind: "redirect"; url: string }
  | { kind: "refresh"; url: string }
  | { kind: "expired" };

export interface Message {
  id: number;
  text: string;
  type: "info" | "error" | "success";
}

export interface OryNode {
  type?: string;
  group?: string;
  attributes: {
    id?: string;
    name?: string;
    src?: string;
    text?: { context?: { secrets?: { text?: string }[] }; text?: string };
    value?: unknown;
  };
  messages: Message[];
}

export interface Flow {
  id: string;
  return_to?: string;
  ui: { action: string; messages?: Message[]; nodes: OryNode[] };
}

/// Constants

export const ORY_URL =
  (import.meta.env.VITE_ORY_URL as string | undefined) ?? "http://localhost:4433";

const ACCEPT_JSON = { headers: { Accept: "application/json" } };

/// Helper functions

function toFlow(body: SubmitBody): Flow | undefined {
  const { id, return_to, ui } = body;
  return id === undefined || ui === undefined ? undefined : { id, return_to, ui };
}

/// Exported functions

export function csrfToken(flow: Flow): string {
  const node = flow.ui.nodes.find((entry) => entry.attributes.name === "csrf_token");
  return (node?.attributes.value as string | undefined) ?? "";
}

export async function oryInit(
  type: FlowType,
  opts: { flowId?: string; returnTo?: string },
): Promise<Flow> {
  if (opts.flowId) {
    const existing = await axios.get<Flow>(`${ORY_URL}/self-service/${type}/flows`, {
      ...ACCEPT_JSON,
      params: { id: opts.flowId },
      validateStatus: (status) => status === 200 || status === 404 || status === 410,
    });
    if (existing.status === 200) return existing.data;
  }

  const fresh = await axios.get<Flow>(`${ORY_URL}/self-service/${type}/browser`, {
    ...ACCEPT_JSON,
    params: opts.returnTo ? { return_to: opts.returnTo } : undefined,
  });
  return fresh.data;
}

export async function orySubmit(
  action: string,
  body: Record<string, unknown>,
): Promise<SubmitResponse> {
  const { status, data } = await axios.post<SubmitBody>(action, body, {
    ...ACCEPT_JSON,
    validateStatus: () => true,
  });
  const flow = toFlow(data);

  if (status < 300) return { flow, kind: "success" };
  if (data.redirect_browser_to) {
    const reason = data.error?.id;
    return reason === "session_refresh_required" || reason === "session_aal2_required"
      ? { kind: "refresh", url: data.redirect_browser_to }
      : { kind: "redirect", url: data.redirect_browser_to };
  }
  return status === 400 && flow ? { flow, kind: "validation" } : { kind: "expired" };
}
