import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, Topbar } from '../../shared/components';
import { useAuth } from '../../shared/hooks/useAuth';
import { NAV_BY_ROLE } from '../router/navConfig';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen max-[900px]:flex-col">
      <Sidebar items={items} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar user={user} onLogout={handleLogout} />
        <main
          key={location.pathname}
          className="flex-1 p-8 max-w-[1180px] w-full mx-auto animate-[fade-in_0.3s_ease_both]"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
