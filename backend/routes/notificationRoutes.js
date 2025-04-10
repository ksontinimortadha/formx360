const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

router.get("/:userId", getNotifications);
router.post("/", createNotification);
router.patch("/read/:id", markAsRead);
router.patch("/read-all/:userId", markAllAsRead);

module.exports = router;
