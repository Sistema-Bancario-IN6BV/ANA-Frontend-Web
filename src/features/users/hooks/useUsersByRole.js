import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useUsersByRole = (roleName) => {
  const [users, setUsers] = useState([]);
  const { loading, error, run } = useAsync();

  const load = useCallback(
    () =>
      run(async () => {
        const res = await usersApi.getUsersByRole(roleName);
        setUsers(res.data || []);
      }),
    [run, roleName]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const changeRole = (userId, newRole) => run(() => usersApi.updateUserRole(userId, newRole)).then(() => load());

  return { users, loading, error, changeRole, reload: load };
};
