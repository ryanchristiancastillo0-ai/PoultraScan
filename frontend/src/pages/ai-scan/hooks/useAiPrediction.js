import { useState, useCallback } from 'react';
import { predictDisease } from '../api/aiPrediction';

export function useAiPrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runPrediction = useCallback(async ({ scanSessionId, imageType, file }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictDisease({ scanSessionId, imageType, file });
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, runPrediction };
}