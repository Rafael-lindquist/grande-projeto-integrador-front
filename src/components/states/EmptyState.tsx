import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Nenhum dado disponível</h2>
        <p className="text-sm text-muted-foreground">
          Ainda não há medições registradas para o período selecionado.
        </p>
      </div>
    </div>
  );
}
