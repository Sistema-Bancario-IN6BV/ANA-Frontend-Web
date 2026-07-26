import clsx from 'clsx';

const TONES = {
  error:   'bg-clay-dim text-ember border-clay/30',
  success: 'bg-sage-dim text-[#3d5642] border-sage/30',
  info:    'bg-parchment-dim text-ink-soft border-border',
};

export const Banner = ({ tone = 'error', children }) => {
  if (!children) return null;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={clsx(
        'rounded-xl px-4 py-3 text-sm font-semibold mb-4 border animate-[fade-in_0.25s_ease_both]',
        TONES[tone],
      )}
    >
      {children}
    </div>
  );
};
