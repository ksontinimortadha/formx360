module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected");

    // Join room by userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
