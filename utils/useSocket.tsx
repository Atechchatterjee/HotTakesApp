"use client";
import { useEffect, useState } from "react";
import { Socket, connect } from "socket.io-client";

export function useSocket(url: string = "http://localhost:4000") {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (!socket) {
      setSocket(connect(url));
    } else {
      socket?.on("connect", () => {
        console.log("Socket successfully connected");
      });
    }
  }, [socket]);

  useEffect(() => {}, [socket]);

  return { socket };
}
