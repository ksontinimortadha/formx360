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
  const newForm = req.body;

  // Validate input: category, title, fields must exist
  if (!newForm.category || !newForm.title || !Array.isArray(newForm.fields)) {
    return res.status(400).json({
      error: "category, title, and fields (array) are required",
    });
  }

  // Read existing templates from storage
  const templates = readTemplates();
  // templates is array like [{ category: "HR", forms: [...] }, ...]

  // Find the category group index
  const categoryIndex = templates.findIndex(
    (t) => t.category === newForm.category
  );

  if (categoryIndex > -1) {
    // Category exists, append new form to that category's forms array
    templates[categoryIndex].forms.push({
      title: newForm.title,
      description: newForm.description || "",
      fields: newForm.fields,
    });
  } else {
    // Create new category entry with forms array containing the new form
    templates.push({
      category: newForm.category,
      forms: [
        {
          title: newForm.title,
          description: newForm.description || "",
          fields: newForm.fields,
        },
      ],
    });
  }

  // Save templates back to your storage (e.g. file, db)
  writeTemplates(templates);

  return res.json({ message: "Form template added/updated successfully" });
});
  
  

module.exports = router;
