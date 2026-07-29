import { useCallback, useEffect, useState } from 'react';
import { bloodPressureApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useBloodPressure = () => {
  const [records, setRecords] = useState([]);
  const { loading, error, run } = useAsync();

  const load = useCallback(
    (params) =>
      run(async () => {
        const res = await bloodPressureApi.list(params);
        setRecords(res.data || []);
      }),
    [run]
  );

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const create = (payload) => run(() => bloodPressureApi.create(payload)).then(() => load());

  const deactivate = (id) => run(() => bloodPressureApi.deactivate(id)).then(() => load());

  return { records, loading, error, load, create, deactivate };
};
