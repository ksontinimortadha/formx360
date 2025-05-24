const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByName: { type: String },
});

module.exports = mongoose.model("Notification", notificationSchema);
