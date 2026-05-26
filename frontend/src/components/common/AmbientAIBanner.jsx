import { Sparkles, ArrowRight } from "lucide-react";

export default function AmbientAIBanner({ eyebrow = "Sugerencia", title, hint, onClick, testid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid || "ambient-ai-banner"}
      className="group w-full text-left bg-paper-raised border border-rule hover:border-ink rounded-xl px-5 py-4 transition-colors flex items-start gap-4"
    >
      <span className="h-9 w-9 shrink-0 rounded-full bg-tomate-soft grid place-items-center">
        <Sparkles className="h-4 w-4 text-tomate" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="eyebrow block">{eyebrow}</span>
        <span className="display-sm block mt-0.5 text-balance">{title}</span>
        {hint && <span className="text-[13px] text-ink-soft block mt-1">{hint}</span>}
      </span>
      <ArrowRight className="h-4 w-4 text-ink-soft group-hover:text-ink mt-3 shrink-0 transition-colors" />
    </button>
  );
}
