import { useCallback, useEffect, useState } from 'react';
import { glucoseApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useGlucose = () => {
  const [records, setRecords] = useState([]);
  const { loading, error, run } = useAsync();

  const load = useCallback(
    (params) =>
      run(async () => {
        const res = await glucoseApi.list(params);
        setRecords(res.data || []);
      }),
    [run]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const create = (payload) => run(() => glucoseApi.create(payload)).then(() => load());

  const deactivate = (id) => run(() => glucoseApi.deactivate(id)).then(() => load());

  return { records, loading, error, load, create, deactivate };
};
