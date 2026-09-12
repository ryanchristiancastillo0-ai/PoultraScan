import { apiRequest } from './apiClient';

export const FeedbackAPI = {
  send: ({ senderEmail, message }) =>
    apiRequest('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_email: senderEmail || null, message }),
    }),
};