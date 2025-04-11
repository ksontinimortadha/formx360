const Notification = require("../models/Notification");

// Get user notifications
exports.getNotifications = async (req, res) => {
  const userId = req.params.userId;
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

// Create a new notification
exports.createNotification = async (req, res) => {
  const { userId, message } = req.body;
  const notif = await Notification.create({ userId, message });

  // Emit via WebSocket
  req.io.to(userId).emit("new-notification", notif);

  res.status(201).json(notif);
};

// Mark one notification as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notif = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification: notif,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read.`,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read.",
      error: error.message,
    });
  }
};

