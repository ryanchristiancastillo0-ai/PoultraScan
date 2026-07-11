import { apiRequest } from '../../../api/apiClient';

export function getMyFarms() {
  return apiRequest('/api/farms/me', { method: 'GET' });
}

export function getFarmById(farmId) {
  return apiRequest(`/api/farms/${farmId}`, { method: 'GET' });
}

function buildFarmFormData({ farm_name, location, capacity, image }) {
  const formData = new FormData();
  if (farm_name !== undefined && farm_name !== null) formData.append('farm_name', farm_name);
  if (location !== undefined && location !== null) formData.append('location', location);
  if (capacity !== undefined && capacity !== null) formData.append('capacity', capacity);
  if (image) formData.append('image', image);
  return formData;
}

export function createFarm(data) {
  return apiRequest('/api/farms/', {
    method: 'POST',
    body: buildFarmFormData(data),
  });
}

export function updateFarm(farmId, data) {
  return apiRequest(`/api/farms/${farmId}`, {
    method: 'PUT',
    body: buildFarmFormData(data),
  });
}

export function deleteFarm(farmId) {
  return apiRequest(`/api/farms/${farmId}`, { method: 'DELETE' });
}