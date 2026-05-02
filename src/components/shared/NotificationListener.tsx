"use client";

import { useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import baseApi from "@/redux/baseApi/baseApi";
import { useRouter } from "next/navigation";

import { addNotification } from "@/redux/features/notifications/notificationSlice";

export function NotificationListener() {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    // Listen for 'new_notification' event from the backend
    socket.on("new_notification", (data: { message: string, type?: 'success' | 'error' | 'info', link?: string }) => {
      // 1. Dispatch to Redux Store
      dispatch(addNotification({
        message: data.message,
        type: data.type || 'info',
        link: data.link
      }));

      const msg = data.message.toLowerCase();
      let link = data.link;

      // Guess link if not provided by backend
      if (!link) {
        if (msg.includes("job")) link = "/dashboard/admin/manage-jobs";
        else if (msg.includes("course")) link = "/courses";
        else if (msg.includes("session")) link = "/dashboard/manage-live-sessions";
      }

      const ToastContent = ({ t }: { t: any }) => (
        <div 
          className={link ? "cursor-pointer group" : ""}
          onClick={() => {
            if (link) {
              toast.dismiss(t.id);
              router.push(link);
            }
          }}
        >
          <div className="font-medium text-sm">{data.message}</div>
          {link && (
            <div className="text-xs text-blue-500 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
              Click to view details →
            </div>
          )}
        </div>
      );

      if (data.type === 'success') {
        toast.success((t) => <ToastContent t={t} />);
      } else if (data.type === 'error') {
        toast.error((t) => <ToastContent t={t} />);
      } else {
        // default fallback with an icon
        toast((t) => <ToastContent t={t} />, { icon: '🔔' });
      }

      // Automatically invalidate Redux RTK Query tags to fetch fresh data
      
      
      if (msg.includes("job")) dispatch(baseApi.util.invalidateTags(["Job"]));
      if (msg.includes("course")) dispatch(baseApi.util.invalidateTags(["Course", "Dashboard"]));
      if (msg.includes("newsletter")) dispatch(baseApi.util.invalidateTags(["Newsletter"]));
      if (msg.includes("assignment")) dispatch(baseApi.util.invalidateTags(["Assignment"]));
      if (msg.includes("review")) dispatch(baseApi.util.invalidateTags(["Reviews"]));
      if (msg.includes("enroll") || msg.includes("payment")) {
        dispatch(baseApi.util.invalidateTags(["Enroll", "Dashboard", "Payment"]));
      }
      if (msg.includes("session")) dispatch(baseApi.util.invalidateTags(["LiveSession"]));
      if (msg.includes("user")) dispatch(baseApi.util.invalidateTags(["User", "Dashboard"]));
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("new_notification");
    };
  }, [socket, dispatch]);

  return null; // Invisible global listener
}
