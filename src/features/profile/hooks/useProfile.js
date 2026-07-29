import { useEffect, useState } from 'react';
import { authApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const { loading, error, run } = useAsync();

  useEffect(() => {
    run(async () => {
      const res = await authApi.getProfile();
      setProfile(res.data);
    }).catch(() => {});
  }, [run]);

  return { profile, loading, error };
};
