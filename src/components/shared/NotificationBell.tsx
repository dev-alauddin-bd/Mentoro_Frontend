"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { markAsRead, markAllAsRead, clearNotifications } from "@/redux/features/notifications/notificationSlice";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-card border border-primary/10 hover:bg-primary/5 transition-all group"
      >
        <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-lg ring-2 ring-background animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
          <div className="p-4 bg-secondary/20 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Notifications</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch(markAllAsRead())}
                className="text-[9px] font-black uppercase tracking-tighter text-primary hover:opacity-70"
              >
                Mark all read
              </button>
              <button 
                onClick={() => dispatch(clearNotifications())}
                className="text-[9px] font-black uppercase tracking-tighter text-destructive hover:opacity-70"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-primary/[0.02]' : ''}`}
                  onClick={() => {
                    dispatch(markAsRead(notif.id));
                    if (notif.link) {
                      setIsOpen(false);
                      router.push(notif.link);
                    }
                  }}
                >
                  {!notif.isRead && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
                  )}
                  <p className={`text-xs leading-relaxed ${!notif.isRead ? 'font-bold text-foreground' : 'text-muted-foreground font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 mt-2 font-black uppercase tracking-widest">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
