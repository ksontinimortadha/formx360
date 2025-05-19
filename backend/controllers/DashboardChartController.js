// controllers/DashboardChartController.js
const DashboardChart = require("../models/DashboardChart");

exports.saveCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { charts } = req.body;

    if (!Array.isArray(charts)) {
      return res.status(400).json({ message: "charts must be an array" });
    }

    let saved = await DashboardChart.findOne({ userId });

    if (saved) {
      saved.charts = charts;
    } else {
      saved = new DashboardChart({ userId, charts });
    }

    await saved.save();
    return res.json({ message: "Charts saved successfully" });
  } catch (error) {
    console.error("Error saving charts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    const saved = await DashboardChart.findOne({ userId });

    if (!saved) return res.json({ charts: [] });
    return res.json({ charts: saved.charts });
  } catch (error) {
    console.error("Error getting charts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
