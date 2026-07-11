import { apiRequest } from '../../../api/apiClient';

const BASE = '/api/scan-summaries';

export function getScanHistory({ skip = 0, limit = 10, search = '', farmId = '', dateFrom = '', dateTo = '' } = {}) {
  const params = new URLSearchParams({ skip, limit });
  if (search) params.set('search', search);
  if (farmId) params.set('farm_id', farmId);
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);

  return apiRequest(`${BASE}/history/me?${params.toString()}`);
}

export function getScanSummaryBySession(scanSessionId) {
  return apiRequest(`${BASE}/session/${scanSessionId}`);
}

export function deleteScanSummary(summaryId) {
  return apiRequest(`${BASE}/${summaryId}`, { method: 'DELETE' });
}