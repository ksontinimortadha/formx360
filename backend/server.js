const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend
  methods: ["GET", "POST"],
  credentials: true, // Allow cookies and other credentials
};

// Middleware
app.use(cors(corsOptions)); // Use the CORS configuration with credentials
app.use(bodyParser.json());

// Routes
app.use("/users", require("./routes/userRoutes"));
app.use("/forms", require("./routes/formRoutes"));
app.use("/responses", require("./routes/responseRoutes"));
app.use("/companies", require("./routes/companyRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));

// Socket
const notificationSocket = require("./sockets/notificationSocket");

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
