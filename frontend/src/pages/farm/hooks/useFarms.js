import { useState, useEffect, useCallback } from 'react';
import { getMyFarms, deleteFarm } from '../api/farmApi';

export function useFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyFarms();
      setFarms(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const removeFarm = async (farmId) => {
    const prevFarms = farms;
    setFarms((prev) => prev.filter((f) => f.id !== farmId));
    try {
      await deleteFarm(farmId);
    } catch (err) {
      setFarms(prevFarms);
      setError(err.message);
    }
  };

  return { farms, loading, error, removeFarm, refetch: fetchFarms };
}