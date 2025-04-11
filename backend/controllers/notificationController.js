const Notification = require("../models/Notification");
const User = require("../models/User");

// Get notifications for a specific user (personal + company-wide)
exports.getNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create a notification for all users in a company
exports.createNotification = async (req, res) => {
  const { userId, companyId, message, createdBy } = req.body;

  try {
    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(404).json({ message: "Creator user not found." });
    }

    const notif = await Notification.create({
      userId,
      companyId,
      message,
      createdBy,
      createdByName: `${creator.firstName} ${creator.lastName}`, // Or creator.name if that's your schema
    });

    req.io.to(companyId).emit("new_notification", notif);

    res.status(201).json(notif);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({
      message: "Failed to create notification.",
      error: error.message,
    });
  }
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
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Mark all notifications as read for a specific user
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
    console.error("❌ Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read.",
      error: error.message,
    });
  }
};
