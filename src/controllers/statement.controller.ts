import "server-only";
import { apiFetch } from "@/lib/api";
import { apiUrls } from "@/lib/api-urls";
import { getSessionToken } from "@/lib/session";
import type { ApiResponse, StatementConfig, StatementHistoryEntry } from "@/lib/types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";

export async function downloadMonthlyCsv(month?: string): Promise<string> {
  const token = await getSessionToken();
  const res = await fetch(`${API_BASE_URL}${apiUrls.statement.monthly(month)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  return res.text();
}

export async function sendMonthlyStatement(month: string, email?: string): Promise<string> {
  const res = await apiFetch<ApiResponse<null>>(apiUrls.statement.send(month), {
    method: "POST",
    body: email ? { email } : {},
  });
  return res.message;
}

export async function getStatementConfig(): Promise<StatementConfig> {
  const res = await apiFetch<ApiResponse<{ config: StatementConfig }>>(apiUrls.statement.config);
  return res.data.config;
}

export async function saveStatementConfig(config: Partial<StatementConfig>): Promise<StatementConfig> {
  const res = await apiFetch<ApiResponse<{ config: StatementConfig }>>(apiUrls.statement.config, {
    method: "PUT",
    body: config,
  });
  return res.data.config;
}

type ApiHistoryLog = {
  month: string;
  sentTo: string;
  trigger: "manual" | "auto";
  status: "success" | "failed";
  error?: string;
  createdAt: string;
};

export async function getStatementHistory(): Promise<StatementHistoryEntry[]> {
  const res = await apiFetch<ApiResponse<{ logs: ApiHistoryLog[] }>>(apiUrls.statement.history);
  return (res.data?.logs ?? []).map((l) => ({
    month: l.month,
    sentTo: l.sentTo,
    sentAt: l.createdAt,
    triggeredBy: l.trigger,
    status: l.status,
    error: l.error,
  }));
}
