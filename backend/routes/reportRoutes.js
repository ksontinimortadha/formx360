const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Create a new report
router.post("/", reportController.createReport);

// Get all reports for a company
router.get("/:companyId", reportController.getCompanyReports);

// Get a single report by ID
router.get("/:reportId", reportController.getReportById);

// Delete a report
router.delete("/:reportId", reportController.deleteReport);

// filter report
router.delete("/:reportId/filter", reportController.filterReportData);

module.exports = router;
