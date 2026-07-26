import clsx from 'clsx';
import './Badge.css';

export const Badge = ({ children, colorVar, tone = 'dusk', className }) => (
  <span
    className={clsx(
      'badge',
      `badge--${tone}`,
      'inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[13px] font-bold leading-relaxed',
      className,
    )}
    style={colorVar ? { '--badge-color': `var(${colorVar})` } : undefined}
  >
    {children}
  </span>
);
