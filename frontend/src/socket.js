import io from "socket.io-client";

const socket = io("https://formx360.onrender.com", {
  withCredentials: true,
});

export default socket;
