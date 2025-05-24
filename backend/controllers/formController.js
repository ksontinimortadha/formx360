const Form = require("../models/Form");
const Company = require("../models/Company");
const Notification = require("../models/Notification");
const crypto = require("crypto");
const User = require("../models/User");

// Create a new form for a specific company
exports.createForm = async (req, res) => {
  const { companyId } = req.params;
  const { title, description, fields, visibility } = req.body;
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

    // Create the new form object (not saved yet)
    const newForm = new Form({
      user_id: userId,
      title,
      description,
      fields,
      field_order: [],
      visibility,
    });

    // Generate URLs based on visibility
    const baseUrl = "https://formx360.vercel.app/responses"; // e.g. from env or config

    if (visibility === "public") {
      // Public forms can have a public URL accessible by anyone
      newForm.publicUrl = `${baseUrl}/public/${newForm._id}`;
      newForm.privateUrl = null;
    } else if (visibility === "private") {
      // Private forms may have a private URL (or none)
      newForm.privateUrl = `${baseUrl}/private/${newForm._id}`;
      newForm.publicUrl = null;
    }

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
    req.io.to(userId).emit("new_notification", notif);

    // Respond with the newly created form ID and URLs
    res.status(201).json({
      message: "Form created successfully!",
      formId: newForm._id,
      form: newForm, // includes URLs
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

  try {
    // Retrieve the form from the database to get the userId
    const existingForm = await Form.findById(id);

    // Check if the form exists
    if (!existingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    const userId = existingForm.user_id; // Retrieve userId from the form

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
    req.io.to(userId).emit("new_notification", notif);

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

  try {
    // Find the form
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    // Optionally, remove form from the company’s forms array
    await Company.updateMany({ forms: id }, { $pull: { forms: id } });

    // Delete the form
    await Form.findByIdAndDelete(id);

    // Create a notification (optional)
    const notif = await Notification.create({
      userId: form.user_id,
      message: `Your form "${form.title}" has been deleted.`,
    });

    // Emit socket event (if req.io is available)
    if (req.io) {
      req.io.to(form.user_id.toString()).emit("new_notification", notif);
    }

    res.status(200).json({ message: "Form deleted successfully." });
  } catch (err) {
    console.error("Error deleting form:", err);
    res.status(500).json({ message: "Server error while deleting form." });
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

exports.updateFormVisibility = async (req, res) => {
  const { formId } = req.params;
  const { visibility, publicUrl } = req.body;

  try {
    const validVisibilities = ["public", "private"];
    if (!validVisibilities.includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility value." });
    }

    const form = await Form.findById(formId).populate("user_id");
    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    let privateUrl = null;
    if (visibility === "private") {
      let token, exists;
      do {
        token = crypto.randomBytes(12).toString("hex");
        privateUrl = `https://formx360.vercel.app/responses/private/${formId}`;
        exists = await Form.findOne({ privateUrl });
      } while (exists);
    }

    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        $set: {
          visibility,
          publicUrl: visibility === "public" ? publicUrl : null,
          privateUrl: visibility === "private" ? privateUrl : null,
        },
      },
      { new: true }
    );

    const visibilityMessage =
      visibility === "public"
        ? `Your form \"${form.title}\" is now public.`
        : `Your form \"${form.title}\" is now private and accessible to your company.`;

    const notif = await Notification.create({
      userId: form.user_id._id,
      message: visibilityMessage,
    });

    if (req.io) {
      req.io.to(form.user_id._id.toString()).emit("new_notification", notif);
    }

    res.status(200).json({ message: visibilityMessage, form: updatedForm });
  } catch (err) {
    console.error("Error updating form visibility:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPrivateFormByToken = async (req, res) => {
  const { token } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user || !user.companyId) {
      return res.status(403).json({ message: "User not part of a company." });
    }

    const form = await Form.findOne({
      privateUrl: `/forms/private/${token}`,
    }).populate("user_id");
    if (!form) {
      return res.status(404).json({ message: "Private form not found." });
    }

    if (form.user_id.companyId.toString() !== user.companyId.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. You are not in the same company." });
    }

    res.status(200).json({ message: "Private form access granted", form });
  } catch (err) {
    console.error("Error accessing private form:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Duplicate Form
exports.duplicatedForm = async (req, res) => {
  const { formId } = req.params;

  try {
    const existingForm = await Form.findById(formId);

    if (!existingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Convert to plain object and exclude fields that shouldn't be duplicated
    const formObj = existingForm.toObject();
    delete formObj._id;
    delete formObj.__v;
    delete formObj.createdAt;
    delete formObj.updatedAt;
    delete formObj.responses; // remove responses if present
    formObj.title = `${formObj.title} - Copy`;

    // Create and save new form
    const duplicatedForm = new Form(formObj);
    const savedForm = await duplicatedForm.save();

    res.status(201).json(savedForm);
  } catch (error) {
    console.error("Error duplicating form:", error);
    res.status(500).json({ message: "Failed to duplicate form" });
  }
};

// Export Form as JSON
exports.exportForm = async (req, res) => {
  const { formId } = req.params;

  try {
    // Find the form by ID
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Set headers for file download (e.g., JSON format)
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${form.title}.json`
    );

    // Send the form data as JSON
    res.status(200).json(form);
  } catch (error) {
    console.error("Error exporting form:", error);
    res.status(500).json({ message: "Failed to export form" });
  }
};

// Lock Form
exports.lockForm = async (req, res) => {
  const { lockStatus } = req.body;
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    form.locked = lockStatus;
    const updatedForm = await form.save();

    res.status(200).json(updatedForm);
  } catch (error) {
    console.error("Error locking form:", error);
    res.status(500).json({ message: "Failed to lock form" });
  }
};
