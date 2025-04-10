// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://formx360.onrender.com";
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
