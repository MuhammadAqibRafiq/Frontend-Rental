import "server-only";
import { redirect } from "next/navigation";
import { routes } from "./routes";
import { getSessionToken } from "./session";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getSessionToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    if (res.status === 401 && auth) {
      redirect(routes.logout);
    }
    const message = extractMessage(data) ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  // Backend returns { status: false, message, data: null } with HTTP 200 on some errors
  if (isJson && data && typeof data === "object" && "status" in data && data.status === false) {
    const message = extractMessage(data) ?? "Something went wrong.";
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

function extractMessage(data: unknown): string | null {
  if (data && typeof data === "object" && "message" in data && typeof (data as Record<string, unknown>).message === "string") {
    return (data as Record<string, unknown>).message as string;
  }
  return null;
}
