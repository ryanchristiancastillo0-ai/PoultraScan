import { useState, useEffect, useCallback } from 'react';
import { getScanSessionsByFarm } from '../api/scanApi';

export function useRecentScans(farmId) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScans = useCallback(async () => {
    if (!farmId) {
      setScans([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getScanSessionsByFarm(farmId);
      const sorted = [...result].sort(
        (a, b) => new Date(b.started_at) - new Date(a.started_at)
      );
      setScans(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  return { scans, loading, error, refetch: fetchScans };
}