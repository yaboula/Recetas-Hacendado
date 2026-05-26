import { Minus, Plus } from "lucide-react";

export default function Stepper({ value, onChange, min = 1, max = 12, label, testid }) {
  return (
    <div className="inline-flex items-center gap-1 select-none" data-testid={testid}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={`Disminuir ${label || ""}`}
        className="h-9 w-9 rounded-md border border-rule hover:border-ink grid place-items-center transition-colors disabled:opacity-40"
        disabled={value <= min}
        data-testid={testid ? `${testid}-minus` : undefined}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="num-mono text-[15px] w-10 text-center text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`Aumentar ${label || ""}`}
        className="h-9 w-9 rounded-md border border-rule hover:border-ink grid place-items-center transition-colors disabled:opacity-40"
        disabled={value >= max}
        data-testid={testid ? `${testid}-plus` : undefined}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
