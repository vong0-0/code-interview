"use client";

import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";

/**
 * A hook to monitor the health and status of the global socket connection.
 */
export function useSocketStatus() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState(socket.io?.engine?.transport?.name || "N/A");

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (rawTransport) => {
        setTransport(rawTransport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return {
    isConnected,
    transport,
    socketId: socket.id,
  };
}
