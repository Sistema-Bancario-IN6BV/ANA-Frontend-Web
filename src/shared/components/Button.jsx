import clsx from 'clsx';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold cursor-pointer ' +
  'transition-all duration-150 ease-out whitespace-nowrap select-none border-0 ' +
  'active:translate-y-px disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0 ' +
  'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-lamplight focus-visible:ring-offset-1';

const VARIANTS = {
  primary:
    'bg-lamplight text-white shadow-soft ' +
    'hover:bg-lamplight-700 hover:shadow-lifted',
  dusk:
    'bg-dusk text-white ' +
    'hover:bg-dusk-600',
  ghost:
    'bg-transparent text-ink border border-border ' +
    'hover:bg-parchment-dim',
  danger:
    'bg-ember text-white ' +
    'hover:brightness-90',
};

const SIZES = {
  sm:  'px-4 py-2 text-sm',
  md:  'px-6 py-3 text-base',
  lg:  'px-8 py-4 text-[19px] min-h-[56px]',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  children,
  ...rest
}) => (
  <button
    type={type}
    className={clsx(BASE, VARIANTS[variant], SIZES[size], className)}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <span className="inline-flex items-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Un momento…
      </span>
    ) : children}
  </button>
);
