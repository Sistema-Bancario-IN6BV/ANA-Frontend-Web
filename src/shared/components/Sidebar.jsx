import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export const Sidebar = ({ items, brand = 'ANA' }) => (
  <aside className="w-[248px] shrink-0 bg-dusk text-white min-h-screen flex flex-col gap-8 px-4 py-6 max-[900px]:w-full max-[900px]:min-h-0 max-[900px]:flex-row max-[900px]:overflow-x-auto max-[900px]:py-3">
    <div className="hidden items-center gap-3 px-2 text-[22px] font-bold max-[900px]:hidden md:flex">
      <span
        className="w-3 h-3 rounded-full bg-lamplight"
        style={{ boxShadow: '0 0 0 4px rgba(16,185,129,0.25)' }}
        aria-hidden="true"
      />
      {brand}
    </div>

    <nav className="flex flex-col gap-1 max-[900px]:flex-row">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-[15px] whitespace-nowrap',
              'transition-all duration-150 ease-out cursor-pointer',
              isActive
                ? 'bg-lamplight text-dusk-700 shadow-soft'
                : 'text-white/75 hover:bg-dusk-600 hover:text-white',
            )
          }
          aria-label={label}
        >
          <Icon size={18} strokeWidth={2} className="shrink-0" aria-hidden="true" />
          <span className="max-[900px]:hidden">{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);
