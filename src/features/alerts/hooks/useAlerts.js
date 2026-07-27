import { useCallback, useEffect, useState } from 'react';
import { alertsApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';
import { useAuth } from '../../../shared/hooks/useAuth';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const { loading, error, run } = useAsync();
  const { user } = useAuth();

  const load = useCallback(
    () =>
      run(async () => {
        const res = await alertsApi.list();
        setAlerts(res.data || []);
      }),
    [run]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const markAsRead = (id) => run(() => alertsApi.markAsRead(id, user?.username)).then(() => load());
  const deactivate = (id) => run(() => alertsApi.deactivate(id)).then(() => load());

  return { alerts, loading, error, markAsRead, deactivate, reload: load };
};
