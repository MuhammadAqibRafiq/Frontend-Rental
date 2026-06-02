import { FileText } from "lucide-react";
import { StatementClient } from "@/components/dashboard/statement-client";
import { getStatementConfig, getStatementHistory } from "@/controllers/statement.controller";
import { fetchOr } from "@/lib/api";
import type { StatementConfig, StatementHistoryEntry } from "@/lib/types";

export default async function StatementPage() {
  const [config, history] = await Promise.all([
    fetchOr(getStatementConfig(), { autoSend: false, dayOfMonth: 1, sendToEmail: null, statementMonth: "previous" } as StatementConfig),
    fetchOr(getStatementHistory(), [] as StatementHistoryEntry[]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-violet-600">Reports</p>
        <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight flex items-center gap-3">
          <FileText size={26} className="text-violet-600" />
          Statement Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Send monthly bill summaries via email — manually or on a schedule.
        </p>
      </div>

      <StatementClient initialConfig={config} initialHistory={history} />
    </div>
  );
}
