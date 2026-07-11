export function isFarmMissingError(message) {
  if (!message) return false;
  return message.toLowerCase().includes('farm not found');
}