import { apiRequest } from '../../../api/apiClient';

export function predictDisease({ scanSessionId, imageType, file }) {
  const formData = new FormData();
  formData.append('scan_session_id', scanSessionId);
  formData.append('image_type', imageType);
  formData.append('file', file);

  return apiRequest('/api/ai/predict', {
    method: 'POST',
    body: formData,
  });
}