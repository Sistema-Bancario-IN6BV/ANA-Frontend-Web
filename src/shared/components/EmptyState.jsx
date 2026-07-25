export const EmptyState = ({ title, description, action }) => (
  <div className="text-center py-12 px-6 text-ink-soft flex flex-col items-center animate-[fade-in_0.4s_ease_both]">
    <div
      className="w-14 h-14 rounded-full mb-4"
      style={{ background: 'radial-gradient(circle, var(--color-lamplight-dim), transparent 70%)' }}
      aria-hidden="true"
    />
    <h3 className="font-display text-[20px] text-ink mb-2">{title}</h3>
    {description && (
      <p className="max-w-[360px] text-[15px] leading-relaxed mb-4">{description}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
