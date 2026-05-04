"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// Define the shape of our context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Create the context with default values
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook to easily access the socket instance from any component
export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // 🔒 SECURITY FIX: Get user role from Redux to filter notifications by role
  const user = useAppSelector(selectCurrentUser);
  const userRole = user?.role || "guest";

  useEffect(() => {
    // ---------------------------------------------------------
    // DEVELOPER NOTE:
    // Initialize the socket connection with user role for role-based notifications.
    // The backend uses the role query parameter to join role-specific rooms.
    // This ensures users only receive notifications meant for their role.
    // ---------------------------------------------------------
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

    const socketInstance = io(socketUrl, {
      query: {
        // 🔒 SECURITY FIX: Pass user role to backend for role-based notification routing
        role: userRole,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      console.log("🟢 [Socket.IO] Connected to server:", socketInstance.id, `(role: ${userRole})`);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 [Socket.IO] Disconnected from server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userRole]); // Re-run if user role changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
