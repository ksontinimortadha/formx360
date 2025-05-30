const express = require("express");
const router = express.Router();
const {
  createForm,
  getFormById,
  updateForm,
  deleteForm,
  getCompanyForms,
  updateFormStyle,
  updateFieldStyle,
  updateFormVisibility,
  duplicatedForm,
  exportForm,
  lockForm,
} = require("../controllers/formController");
const authenticateUser = require("../middlewares/authenticateUser");

// Create a new form for a company
router.post("/:companyId/forms", authenticateUser, createForm);

// Get all forms for a company
router.get("/:companyId/forms", getCompanyForms);

// Get a single form by ID
router.get("/:id", getFormById);

// Update a form by ID
router.patch("/:id", updateForm);

// Update form style
router.put("/style/:id", updateFormStyle);

// Update field style
router.put("/:formId/fields/:fieldId/style", updateFieldStyle);

// Delete a form by ID
router.delete("/:id", deleteForm);
4;

// Update form visibility
router.put("/:formId/visibility", updateFormVisibility);

// Duplicate
router.post("/duplicate/:formId", duplicatedForm);

// export
router.get("/export/:formId", exportForm);

// Lock
router.put("/lock/:formId", lockForm);

module.exports = router;
