import clsx from 'clsx';
import './LamplightPulse.css';

// The signature motif: a slow amber pulse trace, read as both a heartbeat
// and a porch light left on. Used as the loading indicator app-wide.
export const LamplightPulse = ({ label = 'Cargando…', size = 'md', className }) => (
  <div className={clsx('pulse', `pulse--${size}`, className)} role="status">
    <svg viewBox="0 0 120 32" className="pulse__trace" aria-hidden="true">
      <polyline
        points="0,16 28,16 34,4 40,28 46,16 60,16 66,10 72,16 120,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {label && <span className="pulse__label">{label}</span>}
    <span className="visually-hidden">{label}</span>
  </div>
);
