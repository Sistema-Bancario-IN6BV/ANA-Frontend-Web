export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex items-start justify-between mb-8 animate-[slide-up_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
    <div>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-lamplight-700 mb-1 block">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-[28px] md:text-[34px] font-semibold text-ink leading-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-[17px] text-ink-soft leading-relaxed max-w-[520px]">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
  </div>
);
