const express = require("express");
const router = express.Router();
const {
  submitResponse,
  getFormResponses,
  getUserResponses,
  editResponse,
  deleteResponse,
  getResponseById,
} = require("../controllers/responseController");

// Submit a response
router.post("/:form_id", submitResponse);

// Get all responses for a form
router.get("/form/:form_id", getFormResponses);

// Get all responses submitted by a user
router.get("/user/:userId", getResponseById);

// Edit a response
router.put("/:response_id", editResponse);

// Delete a response
router.delete("/:response_id", deleteResponse);

module.exports = router;
