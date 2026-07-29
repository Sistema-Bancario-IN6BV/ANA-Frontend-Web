import clsx from 'clsx';

export const Card = ({ className, padded = true, hover = false, children, ...rest }) => (
  <div
    className={clsx(
      'bg-white rounded-[20px] shadow-soft border border-border',
      padded && 'p-6',
      hover && 'cursor-pointer transition-all duration-200 hover:shadow-lifted hover:-translate-y-0.5',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);
