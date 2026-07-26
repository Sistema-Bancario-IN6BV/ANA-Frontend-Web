import { useCallback, useEffect, useState } from 'react';
import { caregiversApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useCaregivers = () => {
  const [links, setLinks] = useState([]);
  const { loading, error, run } = useAsync();

  const load = useCallback(
    () =>
      run(async () => {
        const res = await caregiversApi.list();
        setLinks(res.data || []);
      }),
    [run]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const create = (payload) => run(() => caregiversApi.create(payload)).then(() => load());

  const deactivate = (id) => run(() => caregiversApi.deactivate(id)).then(() => load());

  return { links, loading, error, create, deactivate };
};
