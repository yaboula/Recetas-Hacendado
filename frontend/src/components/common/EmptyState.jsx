export default function EmptyState({ headline, body, action, testid }) {
  return (
    <div
      className="mx-auto max-w-md text-center py-16 px-4"
      data-testid={testid || "empty-state"}
    >
      <h3 className="display-lg text-balance">{headline}</h3>
      {body && <p className="mt-4 text-ink-soft text-[15px] leading-relaxed">{body}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
