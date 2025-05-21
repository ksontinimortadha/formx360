const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const TEMPLATES_FILE = path.join(__dirname, "../data/formTemplates.json");

// Helper to read templates
function readTemplates() {
  try {
    const data = fs.readFileSync(TEMPLATES_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write templates
function writeTemplates(data) {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(data, null, 2));
}

// GET all form templates
router.get("/get", (req, res) => {
  const templates = readTemplates();
  res.json(templates);
});

// POST add or update templates
router.post("/save", (req, res) => {
  const newCategoryOrForm = req.body;

  if (!newCategoryOrForm.category || !Array.isArray(newCategoryOrForm.forms)) {
    return res
      .status(400)
      .json({ error: "category and forms (array) are required" });
  }

  const templates = readTemplates();

  const existingIndex = templates.findIndex(
    (t) => t.category === newCategoryOrForm.category
  );

  if (existingIndex > -1) {
    // Append new forms to existing category
    templates[existingIndex].forms.push(...newCategoryOrForm.forms);
  } else {
    // Add new category
    templates.push(newCategoryOrForm);
  }

  writeTemplates(templates);
  res.json({ message: "Template added/updated successfully" });
});

module.exports = router;
