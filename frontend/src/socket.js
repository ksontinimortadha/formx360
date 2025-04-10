import io from "socket.io-client";

// Make sure to update with your backend URL if you're deploying it
const socket = io("https://formx360.onrender.com", {
  withCredentials: true, // Include credentials (cookies, etc.)
});

export default socket;
