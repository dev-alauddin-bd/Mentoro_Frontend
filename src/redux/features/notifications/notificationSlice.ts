import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface INotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<INotification, "id" | "isRead" | "createdAt">>) => {
      const newNotification: INotification = {
        ...action.payload,
        id: Date.now().toString(),
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
