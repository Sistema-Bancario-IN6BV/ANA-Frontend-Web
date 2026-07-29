import { useCallback, useEffect, useState } from 'react';
import { medicationsApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useMedications = () => {
  const [records, setRecords] = useState([]);
  const { loading, error, run } = useAsync();

  const load = useCallback(
    (params) =>
      run(async () => {
        const res = await medicationsApi.list(params);
        setRecords(res.data || []);
      }),
    [run]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const create = (payload) => run(() => medicationsApi.create(payload)).then(() => load());

  const update = (id, payload) => run(() => medicationsApi.update(id, payload)).then(() => load());

  const deactivate = (id) => run(() => medicationsApi.deactivate(id)).then(() => load());

  const take = (id) => run(() => medicationsApi.take(id)).then(() => load());

  return { records, loading, error, load, create, update, deactivate, take };
};
