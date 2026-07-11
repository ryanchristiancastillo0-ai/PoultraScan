import { apiRequest } from '../../../api/apiClient';

const BASE = '/api/journal-entries';

export function getJournalEntries({ skip = 0, limit = 100 } = {}) {
  return apiRequest(`${BASE}/?skip=${skip}&limit=${limit}`);
}

export function getJournalEntriesByFarm(farmId, { skip = 0, limit = 100 } = {}) {
  return apiRequest(`${BASE}/farm/${farmId}?skip=${skip}&limit=${limit}`);
}

export function getJournalEntryById(entryId) {
  return apiRequest(`${BASE}/${entryId}`);
}

export function createJournalEntry(data) {
  return apiRequest(`${BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function updateJournalEntry(entryId, data) {
  return apiRequest(`${BASE}/${entryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function deleteJournalEntry(entryId) {
  return apiRequest(`${BASE}/${entryId}`, { method: 'DELETE' });
}