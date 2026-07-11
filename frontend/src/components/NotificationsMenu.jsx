import { useState, useRef, useEffect } from 'react';
import { MdNotifications, MdClose, MdDoneAll } from 'react-icons/md';
import { useNotifications } from '../hooks/useNotification';

function timeAgo(value) {
  if (!value) return '';
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-[#0b1c30]/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`relative ${open ? 'z-50' : ''}`} ref={containerRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Notifications"
          aria-expanded={open}
          className="relative p-2 rounded-full text-[#565e74] hover:bg-[#f8f9ff] hover:text-[#0b1c30] transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006948]/40"
        >
          <MdNotifications className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#006948]" />
          )}
        </button>

        {open && (
          <div className="fixed top-[72px] left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-80 bg-white rounded-xl border border-[#e5eeff] shadow-[0_12px_32px_rgba(15,23,42,0.12)] overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f2fa]">
              <span className="text-sm font-bold text-[#0b1c30]">Notifications</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="p-1 rounded-full text-[#8a958e] hover:bg-[#f8f9ff] hover:text-[#0b1c30] transition-all"
              >
                <MdClose className="text-base" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {loading && (
                <div className="px-4 py-6 text-center text-xs text-[#8a958e]">Loading...</div>
              )}

              {!loading && error && (
                <div className="px-4 py-6 text-center text-xs text-[#DC2626]">
                  Couldn't load notifications.
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-[#8a958e]">
                  No notifications yet.
                </div>
              )}

              {!loading &&
                !error &&
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className="w-full text-left px-4 py-3 border-b border-[#f0f2fa] last:border-0 hover:bg-[#f8f9ff] transition-all flex gap-2.5"
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        n.is_read ? 'bg-transparent' : 'bg-[#006948]'
                      }`}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className={`text-xs ${n.is_read ? 'font-medium text-[#565e74]' : 'font-semibold text-[#0b1c30]'}`}>
                        {n.title}
                      </span>
                      <span className="text-[11px] text-[#565e74] leading-snug">{n.message}</span>
                      <span className="text-[10px] text-[#8a958e] mt-0.5">{timeAgo(n.created_at)}</span>
                    </div>
                  </button>
                ))}
            </div>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#006948] hover:bg-[#f0f9f5] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdDoneAll className="text-sm" />
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
}