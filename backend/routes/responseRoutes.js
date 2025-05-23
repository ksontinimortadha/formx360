const express = require("express");
const router = express.Router();
const {
  submitResponse,
  getFormResponses,
  editResponse,
  deleteResponse,
  getResponsesBySubmittedBy,
} = require("../controllers/responseController");

// Submit a response
router.post("/:form_id", submitResponse);

// Get all responses for a form
router.get("/form/:form_id", getFormResponses);

// Get all responses submitted by a user
router.get("/submitted-by/:userId", getResponsesBySubmittedBy);

// Edit a response
router.put("/:response_id", editResponse);

// Delete a response
router.delete("/:response_id", deleteResponse);

module.exports = router;
