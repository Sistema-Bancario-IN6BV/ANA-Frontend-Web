import { forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef(
  ({ label, error, hint, id, className, as = 'input', children, ...rest }, ref) => {
    const Field = as;
    return (
      <label className={clsx('flex flex-col gap-2 w-full', className)} htmlFor={id}>
        {label && (
          <span className="font-bold text-sm text-ink-soft">{label}</span>
        )}
        <Field
          ref={ref}
          id={id}
          className={clsx(
            'font-body text-[16px] px-4 py-3 rounded-xl border-[1.5px] bg-white text-ink min-h-[48px]',
            'transition-colors duration-150 outline-none',
            'focus:border-lamplight focus:ring-2 focus:ring-lamplight/25',
            'placeholder:text-ink-soft/50',
            error ? 'border-clay' : 'border-border',
            as === 'textarea' && 'min-h-[96px] resize-y',
          )}
          {...rest}
        >
          {children}
        </Field>
        {hint && !error && <span className="text-[13px] text-ink-soft">{hint}</span>}
        {error && (
          <span className="text-[13px] text-clay font-bold" role="alert">
            {error}
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = 'Input';
