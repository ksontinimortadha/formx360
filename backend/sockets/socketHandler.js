function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("new_notification", (data) => {
      socket.broadcast.emit("new_notification", data); 
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = setupSocket;
