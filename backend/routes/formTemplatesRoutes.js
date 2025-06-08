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

  if (!Array.isArray(templates)) {
    return res.status(500).json({ error: "Template data format is invalid" });
  }

  const allForms = templates.flatMap((categoryGroup) => {
    if (!categoryGroup.forms || !Array.isArray(categoryGroup.forms)) return [];

    return categoryGroup.forms.map((form) => ({
      ...form,
      category: categoryGroup.category || "Uncategorized",
    }));
  });

  res.json(allForms);
});

// POST add or update templates
router.post("/save", (req, res) => {
  const newForm = req.body;

  if (!newForm.category || !newForm.title || !Array.isArray(newForm.fields)) {
    return res.status(400).json({
      error: "category, title, and fields (array) are required",
    });
  }

  const templates = readTemplates();

  const categoryIndex = templates.findIndex(
    (t) => t.category === newForm.category
  );

  if (categoryIndex > -1) {
    templates[categoryIndex].forms.push({
      title: newForm.title,
      description: newForm.description || "",
      fields: newForm.fields,
    });
  } else {
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

  writeTemplates(templates);

  return res.json({ message: "Form template added/updated successfully" });
});

module.exports = router;
