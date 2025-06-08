const mongoose = require("mongoose");

const DashboardChartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  charts: { type: Array, default: [] },
});

const DashboardChart = mongoose.model("DashboardChart", DashboardChartSchema);

module.exports = DashboardChart;
