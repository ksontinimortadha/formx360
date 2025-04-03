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
