// Routes

const express = require("express");
const router = express.Router();
const {
  saveCharts,
  getCharts,
} = require("../controllers/DashboardChartController");

// GET saved charts for user
router.post("/save", saveCharts);

// POST save/update charts for user
router.get("/get", getCharts);

module.exports = router;
