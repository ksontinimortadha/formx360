const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// Get notifications for a specific user (personal and company-wide)
router.get("/:userId", getNotifications);

// Create a new notification (for a company)
router.post("/", createNotification);

// Mark a single notification as read
router.patch("/read/:id", markAsRead);

// Mark all notifications as read for a specific user
router.patch("/read-all/:userId", markAllAsRead);

module.exports = router;
