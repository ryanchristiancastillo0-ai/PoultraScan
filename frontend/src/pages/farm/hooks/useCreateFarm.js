import { useState, useCallback } from 'react';
import { createFarm, updateFarm } from '../api/farmApi';

export function useSaveFarm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const save = useCallback(async (data, existingFarmId = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = existingFarmId
        ? await updateFarm(existingFarmId, data)
        : await createFarm(data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { save, loading, error };
}