import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Erro ao carregar o dashboard</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <button
        className="rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        onClick={onRetry}
      >
        Tentar novamente
      </button>
    </div>
  );
}
