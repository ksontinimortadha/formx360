const express = require("express");
const router = express.Router();
const {
  saveCharts,
  getCharts,
} = require("../controllers/DashboardChartController");
const authenticateUser = require("../middlewares/authenticateUser");

// GET saved charts for user
router.post("/save", authenticateUser, saveCharts);

// POST save/update charts for user
router.get("/get", authenticateUser, getCharts);

module.exports = router;
