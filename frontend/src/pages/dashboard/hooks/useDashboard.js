import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../api/apiClient';

export function getDashboardStats() {
  return apiRequest('/api/scan-summaries/dashboard/me', { method: 'GET' });
}

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardStats();
      setStats(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}