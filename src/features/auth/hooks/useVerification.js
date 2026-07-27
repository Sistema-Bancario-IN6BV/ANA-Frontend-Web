import { authApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useVerification = () => {
  const { loading, error, run } = useAsync();

  const verifyEmail = (token) => run(() => authApi.verifyEmail(token));
  const resend = (email) => run(() => authApi.resendVerification(email));
  const forgotPassword = (email) => run(() => authApi.forgotPassword(email));
  const resetPassword = (token, newPassword) => run(() => authApi.resetPassword(token, newPassword));

  return { loading, error, verifyEmail, resend, forgotPassword, resetPassword };
};
