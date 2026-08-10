// src/layout/NotificationBell.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { useGetMyNotifications, useGetUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead } from "../hooks/queries/notification.queries";
import type { NotificationIF } from "../interface/data/notification";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: countData } = useGetUnreadCount();
  const { data: listData, isLoading } = useGetMyNotifications(8);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = countData?.data?.count ?? 0;
  const notifications: NotificationIF[] = listData?.data?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (n: NotificationIF) => {
    if (!n.isRead) markRead.mutate(n._id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer"
        style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)" }}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
            style={{ backgroundColor: "var(--error)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}>
          <div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</p>
            {unreadCount > 0 && (
              <button onClick={() => markAllRead.mutate()} className="flex items-center gap-1 text-xs cursor-pointer" style={{ color: "var(--color-primary)" }}>
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="px-3 py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>You're all caught up.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className="flex w-full items-start gap-2 border-b px-3 py-2.5 text-left cursor-pointer last:border-0 hover:bg-(--bg-soft)"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: n.isRead ? "transparent" : "var(--color-primary)" }} />
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: "var(--text-primary)", fontWeight: n.isRead ? 400 : 600 }}>{n.title}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{n.message}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;