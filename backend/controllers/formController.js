const Form = require("../models/Form");
const Company = require("../models/Company");
const Notification = require("../models/Notification");

// Create a new form for a specific company
exports.createForm = async (req, res) => {
  const { companyId } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;
  try {
    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    // Check if the form with the same title already exists within the same company
    const existingForm = await Form.findOne({
      title,
      _id: { $in: company.forms },
    });

    if (existingForm) {
      return res.status(400).json({
        error: "A form with this title already exists in the same company.",
      });
    }

    // Create the new form with the user_id field
    const newForm = new Form({
      user_id: userId,
      title,
      description,
      fields: [],
      field_order: [],
    });

    // Save the new form to the database
    await newForm.save();

    // Add the new form to the company's forms array
    company.forms.push(newForm._id);
    await company.save();
    // Create and send notification
    const notif = await Notification.create({
      userId,
      message: `The form "${title}" has been created.`,
    });

    // Send real-time notification via Socket.IO
    req.io.to(userId).emit("new-notification", notif);
    // Respond with the newly created form ID
    res.status(201).json({
      message: "Form created successfully!",
      formId: newForm._id,
      form: newForm, // Optionally return the form details
    });
  } catch (error) {
    console.error("Error creating form:", error.message);
    res.status(500).json({
      error: "Error creating form. Please try again.",
    });
  }
};

// Get All Forms for a Company
exports.getCompanyForms = async (req, res) => {
  const { companyId } = req.params; // Fix parameter name

  try {
    // Ensure company exists
    const company = await Company.findById(companyId).populate("forms");

    if (!company) {
      console.log("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company.forms);
  } catch (err) {
    console.error("Error fetching company forms:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a Single Form
exports.getFormById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the form by ID in the database
    const form = await Form.findById(id);

    // If form not found, return 404 error
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // If form found, return 200 with form data
    res.status(200).json({
      success: true,
      message: "Form retrieved successfully",
      form,
    });
  } catch (err) {
    // Return 500 error for server-side issues
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Update a Form
exports.updateForm = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    field_order = [],
    fields = [],
    values,
  } = req.body;
  console.log("userId", req.body);
  const userId = req.user.id; // Ensure req.user is available
  try {
    if (!Array.isArray(fields)) {
      return res
        .status(400)
        .json({ message: "Invalid fields format. Expected an array." });
    }

    // Validate and ensure all fields contain a 'type'
    fields.forEach((field, index) => {
      if (!field.type) {
        console.warn(`Missing type for field at index ${index}`, field);
      }

      // Ensure options are properly handled for 'checkbox-group', 'radio-group', and 'select'
      if (["checkbox-group", "radio-group", "select"].includes(field.type)) {
        field.options = field.options || []; // Ensure options exist

        field.options = field.options.map((option) => ({
          label: option.label || option, // Use provided label or default to option value
          value: option.value || option, // Use provided value or default
          selected: option.selected ?? false, // Ensure selected is explicitly set
        }));
      }
    });

    // Find and update the form, ensuring arrays are replaced properly
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { title, description, field_order, fields, values },
      { new: true } // Return updated form & validate fields
    );

    // Handle form not found scenario
    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Create a notification about the form update
    const notif = await Notification.create({
      userId,
      message: `Your form "${updatedForm.title}" was updated.`,
    });

    // Send real-time notification via Socket.IO (make sure req.io is available)
    req.io.to(userId).emit("new-notification", notif);

    // Send success response
    res.status(200).json({
      message: "Form updated successfully",
      form: updatedForm,
    });
  } catch (err) {
    // Handle server errors
    console.error("Error updating form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Delete a Form
exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Ensure req.user is available

  try {
    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm)
      return res.status(404).json({ message: "Form not found" });
    
    // Create a notification about the form update
    const notif = await Notification.create({
      userId,
      message: `Your form "${updatedForm.title}" was deleted.`,
    });

    // Send real-time notification via Socket.IO (make sure req.io is available)
    req.io.to(userId).emit("new-notification", notif);
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update form theme
exports.updateFormStyle = async (req, res) => {
  const { id } = req.params;
  const { theme } = req.body;

  try {
    // Validate if theme is a valid className
    const validThemes = [
      "classic-blue",
      "modern-gray",
      "light-airy",
      "dark-mode",
      "nature-green",
      "vibrant-orange",
      "minimalist-white",
      "vintage-red",
      "elegant-purple",
      "tech-blue",
      "professional-bw",
      "fresh-mint",
      "funky-pink",
      "elegant-gold",
      "techno-yellow",
    ];

    if (!validThemes.includes(theme)) {
      return res.status(400).json({ message: "Invalid theme data." });
    }

    // Update the form's theme
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { $set: { theme } }, // Use $set to only update the theme field
      { new: true } // Ensure the updated form is returned
    );
    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({
      message: "Form style updated successfully",
      form: updatedForm,
    });
  } catch (err) {
    console.error("Error updating form style:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// update field style
exports.updateFieldStyle = async (req, res) => {
  const { formId, fieldId } = req.params;
  const { backgroundColor, color, position } = req.body;

  try {
    // Validate position value
    const validPositions = ["left", "center", "right"];
    if (position && !validPositions.includes(position)) {
      return res.status(400).json({ message: "Invalid position value." });
    }

    // Validate colors (optional: use regex for HEX validation)
    if (backgroundColor && !/^#([0-9A-Fa-f]{3}){1,2}$/.test(backgroundColor)) {
      return res
        .status(400)
        .json({ message: "Invalid background color format." });
    }
    if (color && !/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) {
      return res.status(400).json({ message: "Invalid text color format." });
    }

    // Update the field's style
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        $set: {
          [`fieldStyles.${fieldId}`]: { backgroundColor, color, position },
        },
      },
      { new: true } // Return updated form
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({
      message: "Field style updated successfully",
      form: updatedForm,
    });
  } catch (err) {
    console.error("Error updating field style:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update form visibility
exports.updateFormVisibility = async (req, res) => {
  const { formId } = req.params;
  const { visibility, publicUrl } = req.body;

  try {
    // Validate visibility value
    const validVisibilities = ["public", "private"];
    if (!validVisibilities.includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility value." });
    }

    // Update the form's visibility
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { $set: { visibility, publicUrl } },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({
      message: `Form visibility updated to ${visibility} and link ${publicUrl}`,
      form: updatedForm,
    });
  } catch (err) {
    console.error("Error updating form visibility:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
