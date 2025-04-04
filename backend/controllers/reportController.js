const Report = require("../models/Report");
const Form = require("../models/Form");

// Create a New Report
exports.createReport = async (req, res) => {
  const { title, formId, companyId } = req.body;

  try {
    // Validate the form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const newReport = new Report({ title, formId, companyId });
    await newReport.save();

    res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Reports for a Company
exports.getCompanyReports = async (req, res) => {
  const { companyId } = req.params;

  try {
    const reports = await Report.find({ companyId }).populate(
      "formId",
      "title"
    );
    if (reports.length === 0) {
      return res
        .status(404)
        .json({ message: "No reports found for this company" });
    }
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a Single Report by ID
exports.getReportById = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findById(reportId).populate("formId", "title");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a Report
exports.deleteReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findByIdAndDelete(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const mongoose = require("mongoose");

exports.filterReportData = async (req, res) => {
  const { reportId } = req.params;
  const { filters } = req.body;

  console.log("Incoming request to filter report data for reportId:", reportId);
  console.log("Received filters:", filters);

  try {
    const report = await Report.findById(reportId).populate("formId");

    if (!report) {
      console.log("❌ Report not found");
      return res.status(404).json({ message: "Report not found" });
    }

    console.log("✅ Report found:", report.title);
    console.log("📄 Populated formId:", report.formId);
    console.log("📦 Collection Name:", report.formId?.collectionName);

    const collectionName = report.formId?.collectionName;

    if (!collectionName) {
      console.log("❌ Collection name not found in formId");
      return res.status(400).json({ message: "Form collection not found" });
    }

    const FormModel = mongoose.model(collectionName);

    let query = {};
    filters.forEach(({ field, condition, value }) => {
      if (!field || value === "") {
        console.log(
          `⚠️ Skipping invalid filter: field=${field}, value=${value}`
        );
        return;
      }

      let parsedValue = isNaN(value) ? value : Number(value);
      console.log(
        `🔍 Adding filter - Field: ${field}, Condition: ${condition}, Value: ${parsedValue}`
      );

      switch (condition) {
        case "equals":
          query[field] = parsedValue;
          break;
        case "contains":
          query[field] = { $regex: parsedValue, $options: "i" };
          break;
        case "greater_than":
          query[field] = { $gt: parsedValue };
          break;
        case "less_than":
          query[field] = { $lt: parsedValue };
          break;
        default:
          console.log(`⚠️ Unknown condition: ${condition}`);
          break;
      }
    });

    console.log("📥 Final MongoDB Query:", query);

    const filteredData = await FormModel.find(query);
    console.log("✅ Filtered data count:", filteredData.length);

    res.status(200).json(filteredData);
  } catch (err) {
    console.error("💥 Error filtering report data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
