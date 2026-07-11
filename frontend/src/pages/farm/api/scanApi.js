import { apiRequest } from '../../../api/apiClient';

export function getScanSessionsByFarm(farmId) {
  return apiRequest(`/api/scan-sessions/farm/${farmId}`, { method: 'GET' });
}

export function getScanSessionById(sessionId) {
  return apiRequest(`/api/scan-sessions/${sessionId}`, { method: 'GET' });
}

export function createScanSession({ farm_id, scan_type }) {
  return apiRequest('/api/scan-sessions/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ farm_id, scan_type }),
  });
}

export function deleteScanSession(sessionId) {
  return apiRequest(`/api/scan-sessions/${sessionId}`, { method: 'DELETE' });
}