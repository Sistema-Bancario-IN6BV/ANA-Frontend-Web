import { useState } from 'react';
import { authApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useRegister = () => {
  const { loading, error, run } = useAsync();
  const [done, setDone] = useState(false);

  const register = async (payload) =>
    run(async () => {
      await authApi.register(payload);
      setDone(true);
    });

  return { register, loading, error, done };
};
