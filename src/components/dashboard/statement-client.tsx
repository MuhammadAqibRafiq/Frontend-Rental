"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Settings, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { StatementConfig, StatementHistoryEntry } from "@/lib/types";

interface Props {
  initialConfig: StatementConfig;
  initialHistory: StatementHistoryEntry[];
}

function previousMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function StatementClient({ initialConfig, initialHistory }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ManualSendCard defaultEmail={initialConfig.sendToEmail ?? ""} onSent={() => router.refresh()} />
        <ConfigCard initialConfig={initialConfig} />
      </div>
      <HistoryCard history={initialHistory} />
    </div>
  );
}

// ─── Manual Send ──────────────────────────────────────────────────────────────

function ManualSendCard({ defaultEmail, onSent }: { defaultEmail: string; onSent: () => void }) {
  const [month, setMonth] = useState(previousMonth());
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!month) { toast.error("Please select a month."); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/statement/monthly/send?month=${month}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email.trim() ? { email: email.trim() } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to send.");
      toast.success(data.message ?? "Statement sent!");
      setEmail("");
      onSent();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send statement.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950">
          <Send size={16} className="text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-bold">Manual Send</p>
          <p className="text-xs text-muted-foreground">Send statement for any month right now</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Default: your account email"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Send Statement"}
      </button>
    </div>
  );
}

// ─── Auto-Send Config ─────────────────────────────────────────────────────────

function ConfigCard({ initialConfig }: { initialConfig: StatementConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/statement/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to save.");
      toast.success("Settings saved!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950">
          <Settings size={16} className="text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-bold">Auto-Send Settings</p>
          <p className="text-xs text-muted-foreground">Automatically email on a fixed day each month</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enable Auto Send</span>
          <button
            role="switch"
            aria-checked={config.autoSend}
            onClick={() => setConfig((c) => ({ ...c, autoSend: !c.autoSend }))}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${config.autoSend ? "bg-violet-600" : "bg-muted"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${config.autoSend ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Day of month + Statement Month on same line */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Day of Month (1–28)</label>
            <input
              type="number"
              min={1}
              max={28}
              value={config.dayOfMonth}
              onChange={(e) => setConfig((c) => ({ ...c, dayOfMonth: Math.min(28, Math.max(1, Number(e.target.value))) }))}
              disabled={!config.autoSend}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statement Month</label>
            <select
              value={config.statementMonth}
              onChange={(e) => setConfig((c) => ({ ...c, statementMonth: e.target.value as "current" | "previous" }))}
              disabled={!config.autoSend}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              <option value="previous">Previous Month</option>
              <option value="current">Current Month</option>
            </select>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Send To (optional)</label>
          <input
            type="email"
            value={config.sendToEmail ?? ""}
            onChange={(e) => setConfig((c) => ({ ...c, sendToEmail: e.target.value || null }))}
            disabled={!config.autoSend}
            placeholder="Default: your account email"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/70 disabled:opacity-60"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : "Save Settings"}
      </button>
    </div>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────

function HistoryCard({ history }: { history: StatementHistoryEntry[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950">
          <Clock size={16} className="text-sky-600" />
        </div>
        <p className="text-sm font-bold">Send History</p>
        {history.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">{history.length} records</span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock size={32} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No emails sent yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Send your first statement above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Sent To</th>
                <th className="px-4 py-3">Triggered By</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.slice(0, 50).map((entry, i) => (
                <tr key={`${entry.month}-${entry.sentAt}-${i}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(entry.sentAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.month}</td>
                  <td className="px-4 py-3 text-muted-foreground">{entry.sentTo}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      entry.triggeredBy === "auto"
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                    }`}>
                      {entry.triggeredBy === "auto" ? "Auto" : "Manual"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold w-fit ${
                        entry.status === "success"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      }`}>
                        {entry.status === "success"
                          ? <><CheckCircle size={11} /> Sent</>
                          : <><XCircle size={11} /> Failed</>
                        }
                      </span>
                      {entry.error && (
                        <span className="text-[11px] text-muted-foreground">{entry.error}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
