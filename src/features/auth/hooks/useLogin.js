import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';
import { useAuth } from '../../../shared/hooks/useAuth';

export const useLogin = () => {
  const { loading, error, run } = useAsync();
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const login = async ({ emailOrUsername, password }) =>
    run(async () => {
      const result = await authApi.login(emailOrUsername, password);
      setSession(result.token, result.userDetails);
      navigate('/', { replace: true });
    });

  return { login, loading, error };
};
