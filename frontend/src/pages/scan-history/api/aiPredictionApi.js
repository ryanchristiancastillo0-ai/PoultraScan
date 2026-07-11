import { apiRequest } from '../../../api/apiClient';

export function getPredictionsBySession(scanSessionId) {
  return apiRequest(`/api/ai/session/${scanSessionId}`, { method: 'GET' });
}