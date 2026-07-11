import { useState, useEffect, useCallback, useRef } from 'react';
import { NotificationAPI } from '../api/notificationApi';

const POLL_INTERVAL_MS = 15000;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userIdRef.current) {
        const user = await NotificationAPI.getCurrentUser();
        userIdRef.current = user.id;
      }
      const list = await NotificationAPI.getForUser(userIdRef.current);
      setNotifications(list);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      await NotificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => NotificationAPI.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      setError(err.message);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}