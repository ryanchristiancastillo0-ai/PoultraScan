import { useState, useRef, useEffect } from 'react';
import { MdNotifications, MdClose, MdDoneAll, MdNotificationsNone } from 'react-icons/md';
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
          className="fixed inset-0 z-40 bg-[#0b1c30]/20 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`relative ${open ? 'z-50' : ''}`} ref={containerRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Notifications"
          aria-expanded={open}
          className="relative rounded-full p-2 text-[#565e74] transition-all hover:bg-[#f8f9ff] hover:text-[#0b1c30] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006948]/40 active:scale-95"
        >
          <MdNotifications className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#006948] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div
            className="fixed left-4 right-4 top-[72px] bottom-24 z-50 flex flex-col overflow-hidden rounded-2xl border border-[#e5eeff] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:h-auto sm:max-h-[26rem] sm:w-80"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-[#f0f2fa] px-4 py-3">
              <span className="text-sm font-bold text-[#0b1c30]">Notifications</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="rounded-full p-1 text-[#8a958e] transition-all hover:bg-[#f8f9ff] hover:text-[#0b1c30]"
              >
                <MdClose className="text-base" />
              </button>
            </div>

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading && (
                <div className="px-4 py-10 text-center text-xs text-[#8a958e]">Loading...</div>
              )}

              {!loading && error && (
                <div className="px-4 py-10 text-center text-xs text-[#DC2626]">
                  Couldn't load notifications.
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                  <MdNotificationsNone className="text-2xl text-[#c7cfd8]" />
                  <span className="text-xs text-[#8a958e]">No notifications yet.</span>
                </div>
              )}

              {!loading &&
                !error &&
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className="flex w-full gap-2.5 border-b border-[#f0f2fa] px-4 py-3 text-left transition-all last:border-0 hover:bg-[#f8f9ff]"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        n.is_read ? 'bg-transparent' : 'bg-[#006948]'
                      }`}
                    />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span
                        className={`text-xs ${
                          n.is_read ? 'font-medium text-[#565e74]' : 'font-semibold text-[#0b1c30]'
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[11px] leading-snug text-[#565e74]">{n.message}</span>
                      <span className="mt-0.5 text-[10px] text-[#8a958e]">{timeAgo(n.created_at)}</span>
                    </div>
                  </button>
                ))}
            </div>

            {/* Footer */}
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex flex-shrink-0 items-center justify-center gap-1.5 border-t border-[#f0f2fa] py-2.5 text-xs font-semibold text-[#006948] transition-all hover:bg-[#f0f9f5] disabled:cursor-not-allowed disabled:opacity-40"
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