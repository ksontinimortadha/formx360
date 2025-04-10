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
  const notif = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  res.json(notif);
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  const { userId } = req.params;
  await Notification.updateMany({ userId }, { read: true });
  res.json({ success: true });
};
