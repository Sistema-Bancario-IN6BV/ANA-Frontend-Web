import { useEffect, useState } from 'react';
import { anaApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

// Same shape as useAnaInsights but scoped to a specific elderly — used by
// caregivers/admins to review a linked elder's emotional trend and history.
export const useElderlyInsights = (elderlyId) => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const { loading, error, run } = useAsync();

  useEffect(() => {
    if (!elderlyId) {
      setHistory([]);
      setSummary(null);
      return;
    }

    run(async () => {
      const [historyRes, summaryRes] = await Promise.allSettled([
        anaApi.getHistory(20, 0, elderlyId),
        anaApi.getWeeklySummary(elderlyId),
      ]);
      setHistory(historyRes.status === 'fulfilled' ? historyRes.value.data || [] : []);
      setSummary(summaryRes.status === 'fulfilled' ? summaryRes.value.data : null);
    }).catch(() => {});
  }, [elderlyId, run]);

  return { history, summary, loading, error };
};
