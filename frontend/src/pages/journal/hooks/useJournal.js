import { useState, useEffect, useCallback } from 'react';
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../api/journalApi';

export function useJournal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJournalEntries();
      setEntries(data);
    } catch (err) {
      setError(err.message || 'Failed to load journal entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (payload) => {
    setSaving(true);
    setError(null);
    try {
      const result = await createJournalEntry(payload);
      const newEntry = result.entry;
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message || 'Failed to create journal entry.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const editEntry = async (entryId, payload) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateJournalEntry(entryId, payload);
      setEntries((prev) => prev.map((e) => (e.id === entryId ? updated : e)));
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update journal entry.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (entryId) => {
    const prevEntries = entries;
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    try {
      await deleteJournalEntry(entryId);
    } catch (err) {
      setEntries(prevEntries);
      setError(err.message || 'Failed to delete journal entry.');
    }
  };

  return { entries, loading, error, saving, addEntry, editEntry, removeEntry, refetch: fetchEntries };
}