import { useState, useEffect, useCallback } from 'react';
import { ProfileAPI } from '../api/profileApi';

export function useProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProfileAPI.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (payload) => {
      if (!user?.id) return;
      setSaving(true);
      setSaveError(null);
      try {
        const updated = await ProfileAPI.updateProfile(user.id, payload);
        setUser(updated);
        return updated;
      } catch (err) {
        setSaveError(err.message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  return {
    user,
    loading,
    error,
    saving,
    saveError,
    updateProfile,
    refetch: fetchProfile,
  };
}