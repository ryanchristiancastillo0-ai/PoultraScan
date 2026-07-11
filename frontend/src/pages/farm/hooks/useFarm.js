import { useState, useEffect, useCallback } from 'react';
import { getMyFarms, getFarmById } from '../api/farmApi';

export function useFarm(farmId) {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarm = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (farmId) {
        const result = await getFarmById(farmId);
        setFarm(result);
      } else {
        const result = await getMyFarms();
        setFarm(Array.isArray(result) && result.length > 0 ? result[0] : null);
      }
    } catch (err) {
      setError(err.message);
      setFarm(null);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    fetchFarm();
  }, [fetchFarm]);

  return { farm, loading, error, refetch: fetchFarm };
}