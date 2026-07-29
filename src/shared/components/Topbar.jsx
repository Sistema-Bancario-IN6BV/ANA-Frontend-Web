import { ROLE_LABELS } from '../constants/roles';
import { initials } from '../utils/formatters';

export const Topbar = ({ user, onLogout }) => (
  <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-parchment/90 backdrop-blur-sm sticky top-0 z-20">
    <div />
    <div className="flex items-center gap-3">
      <span className="text-[13px] font-bold text-ink-soft">
        {ROLE_LABELS[user?.role] || 'Cuenta'}
      </span>

      <div
        className="w-9 h-9 rounded-full bg-lamplight text-white flex items-center justify-center font-bold text-sm shrink-0"
        aria-hidden="true"
      >
        {initials(user?.username || 'A', user?.username?.slice(1) || 'N')}
      </div>

      <span className="font-bold text-ink">{user?.username}</span>

      <button
        type="button"
        onClick={onLogout}
        className="border border-border rounded-full px-4 py-2 font-semibold text-sm text-ink-soft cursor-pointer transition-all duration-150 hover:bg-parchment-dim hover:text-ink focus-visible:ring-2 focus-visible:ring-lamplight"
      >
        Cerrar sesión
      </button>
    </div>
  </header>
);
