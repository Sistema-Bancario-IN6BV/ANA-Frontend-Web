import { useCallback, useState } from 'react';

// Wraps an async action with loading/error state, shared by every feature hook
// that calls the API (create/toggle/etc.) so each one doesn't reinvent it.
export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, run, setError };
};
