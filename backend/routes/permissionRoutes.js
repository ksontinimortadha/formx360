const express = require("express");
const {
  savePermission,
  getPermission,
} = require("../controllers/permissionController");
const router = express.Router();

// Save permission
router.post("/save", savePermission);

// Get permission
router.get("/:formId", getPermission);

module.exports = router;
