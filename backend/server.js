const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend
  methods: ["GET", "POST"],
  credentials: true, // Allow cookies and other credentials
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use("/users", require("./routes/userRoutes"));
app.use("/forms", require("./routes/formRoutes"));
app.use("/responses", require("./routes/responseRoutes"));
app.use("/companies", require("./routes/companyRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow only your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket connection handler
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle events like notifications
  socket.on("new_notification", (data) => {
    console.log("New notification:", data);
    socket.broadcast.emit("new_notification", data); // Emit to all other clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
