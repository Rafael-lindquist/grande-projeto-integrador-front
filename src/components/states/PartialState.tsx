import { WifiOff } from "lucide-react";

interface PartialStateProps {
  message: string;
}

export function PartialState({ message }: PartialStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
      <WifiOff className="h-5 w-5 text-amber-600" />
      <span>{message}</span>
    </div>
  );
}
