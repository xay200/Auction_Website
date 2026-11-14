import { io } from "socket.io-client";

export const socket = io("https://webid-auction.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});