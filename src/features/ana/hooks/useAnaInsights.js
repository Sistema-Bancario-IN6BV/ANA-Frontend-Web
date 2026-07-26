import { useEffect, useState } from 'react';
import { anaApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';

export const useAnaInsights = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const { loading, error, run } = useAsync();

  useEffect(() => {
    run(async () => {
      const [historyRes, summaryRes] = await Promise.allSettled([
        anaApi.getHistory(8, 0),
        anaApi.getWeeklySummary(),
      ]);
      if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data || []);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
    }).catch(() => {});
  }, [run]);

  return { history, summary, loading, error };
};
