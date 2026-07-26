import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  return {
    token,
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(token),
    setSession,
    updateUser,
    logout,
  };
};
