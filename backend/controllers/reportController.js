const Report = require("../models/Report");
const Form = require("../models/Form");
const Response = require("../models/Response");

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

exports.filterReportData = async (req, res) => {
  const { reportId } = req.params;
  const { filters } = req.body;

  console.log("📥 Incoming filter request for reportId:", reportId);
  console.log("🧪 Filters received:", filters);

  try {
    const report = await Report.findById(reportId).populate("formId");
    if (!report) {
      console.log("❌ Report not found");
      return res.status(404).json({ message: "Report not found" });
    }

    const formId = report.formId._id;
    console.log("✅ Report found:", report.title);
    console.log("📝 Form ID associated with report:", formId);

    // Fetch all responses for this form
    const responses = await Response.find({ form_id: formId });
    console.log("📦 Total responses fetched:", responses.length);

    // Now filter responses in JS
    const filteredResponses = responses.filter((response, index) => {
      console.log(`🔎 Checking response #${index + 1}:`, response._id);

      const isMatch = filters.every(({ field, condition, value }) => {
        const answer = response.responses.find((r) => r.field_name === field);
        if (!answer) {
          console.log(`⚠️ Field '${field}' not found in response.`);
          return false;
        }

        const responseValue = answer.value;
        const parsedValue = isNaN(value) ? value : Number(value);

        console.log(
          `🧮 Filtering - Field: ${field}, Condition: ${condition}, Value: ${parsedValue}, Response Value: ${responseValue}`
        );

        switch (condition) {
          case "equals":
            return responseValue === parsedValue;
          case "contains":
            return (
              typeof responseValue === "string" &&
              responseValue.toLowerCase().includes(parsedValue.toLowerCase())
            );
          case "greater_than":
            return responseValue > parsedValue;
          case "less_than":
            return responseValue < parsedValue;
          default:
            console.log(`⚠️ Unknown condition: ${condition}`);
            return false;
        }
      });

      if (!isMatch) {
        console.log("❌ Response does not match all filters.");
      } else {
        console.log("✅ Response matches all filters.");
      }

      return isMatch;
    });

    console.log("✅ Total filtered responses:", filteredResponses.length);
    res.status(200).json(filteredResponses);
  } catch (err) {
    console.error("💥 Error filtering report data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};