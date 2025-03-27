const Response = require("../models/Response");
const Form = require("../models/Form");

// Submit a New Response
exports.submitResponse = async (req, res) => {
  const { user_id, responses } = req.body;
  const { form_id } = req.params;

  try {
    // Validate the form exists
    const form = await Form.findById(form_id);
    if (!form) {
      console.log("Error: Form not found");
      return res.status(404).json({ message: "Form not found" });
    }

    // Validate responses
    const validationErrors = [];
    const processedResponses = [];

    form.fields.forEach((field) => {
      const userResponse = responses.find(
        (r) => r.field_id === field._id.toString()
      );

      // Check required fields
      if (field.required && (!userResponse || !userResponse.value)) {
        validationErrors.push(`Field '${field.label}' is required.`);
        return; // Skip further validation for this field
      }

      if (userResponse) {
        let value = userResponse.value;

        // Normalize checkbox-group and radio-group to array
        if (Array.isArray(value)) {
          value = value.filter((val) =>
            field.values.some((option) => option.value === val)
          );
        } else {
          value = [value];
        }

        // Validate based on field type
        switch (field.type) {
          case "text":
          case "textarea":
            if (field.min_length && value[0].length < field.min_length) {
              validationErrors.push(
                `Field '${field.label}' must have at least ${field.min_length} characters.`
              );
            }
            if (field.max_length && value[0].length > field.max_length) {
              validationErrors.push(
                `Field '${field.label}' must not exceed ${field.max_length} characters.`
              );
            }
            break;

          case "number":
            if (isNaN(value[0])) {
              validationErrors.push(
                `Field '${field.label}' must be a valid number.`
              );
            }
            if (field.min && value[0] < field.min) {
              validationErrors.push(
                `Field '${field.label}' must be at least ${field.min}.`
              );
            }
            if (field.max && value[0] > field.max) {
              validationErrors.push(
                `Field '${field.label}' must not exceed ${field.max}.`
              );
            }
            break;

          case "checkbox-group":
          case "radio-group":
            if (!Array.isArray(value)) value = [value]; // Normalize single option to an array
            value.forEach((val) => {
              console.log("Checking value:", val);
              console.log(
                "Available options:",
                field.values.map((val) => val.value)
              );
              if (!field.values.some((option) => option.value === val)) {
                validationErrors.push(
                  `Field '${field.label}' contains invalid options.`
                );
              }
            });

            if (field.min && value.length < field.min) {
              validationErrors.push(
                `Field '${field.label}' must have at least ${field.min} selected.`
              );
            }
            if (field.max && value.length > field.max) {
              validationErrors.push(
                `Field '${field.label}' must not exceed ${field.max} selected.`
              );
            }
            break;

          case "select":
            if (!field.values.some((opt) => opt.value === value[0])) {
              validationErrors.push(
                `Field '${field.label}' must be one of the predefined options.`
              );
            }
            break;

          case "date":
            const dateValue = new Date(value[0]);
            if (isNaN(dateValue)) {
              validationErrors.push(
                `Field '${field.label}' must be a valid date.`
              );
            }
            if (field.min && dateValue < new Date(field.min)) {
              validationErrors.push(
                `Field '${field.label}' must not be before ${field.min}.`
              );
            }
            if (field.max && dateValue > new Date(field.max)) {
              validationErrors.push(
                `Field '${field.label}' must not be after ${field.max}.`
              );
            }
            break;

          case "file":
            const file = value[0];
            if (
              file &&
              field.min_length &&
              file.size < field.min_length * 1024
            ) {
              validationErrors.push(
                `Field '${field.label}' file size must be at least ${field.min_length} KB.`
              );
            }
            if (
              file &&
              field.max_length &&
              file.size > field.max_length * 1024
            ) {
              validationErrors.push(
                `Field '${field.label}' file size must not exceed ${field.max_length} KB.`
              );
            }
            break;

          case "autocomplete":
          case "hidden":
          case "button":
          case "header":
          case "paragraph":
          case "starRating":
            break;

          default:
            validationErrors.push(
              `Field '${field.label}' has an unsupported field type: ${field.type}.`
            );
        }

        // Custom validation based on field subtype (e.g., password)
        if (field.subtype === "password" && value[0].length < 8) {
          validationErrors.push(
            `Field '${field.label}' (password) must have at least 8 characters.`
          );
        }

        // Add validated response with field name
        processedResponses.push({
          field_id: field._id,
          field_name: field.label, // Adding field_name
          value: userResponse.value,
        });
      }
    });

    if (validationErrors.length > 0) {
      console.log("Validation Errors:", validationErrors);
      return res
        .status(400)
        .json({ message: "Validation errors", errors: validationErrors });
    }

    // Save the response
    const newResponse = new Response({
      form_id,
      user_id,
      responses: processedResponses, // Use processed responses with field names
    });

    await newResponse.save();

    res.status(201).json({
      message: "Response submitted successfully",
      response: newResponse,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get Responses for a Form
exports.getFormResponses = async (req, res) => {
  const { form_id } = req.params;

  try {
    // Validate if form exists
    const form = await Form.findById(form_id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Fetch all responses for the given form
    const responses = await Response.find({ form_id })
      .populate("user_id", "name email") // Populating user details
      .exec();

    // Check if responses exist
    if (responses.length === 0) {
      return res
        .status(404)
        .json({ message: "No responses found for this form" });
    }

    res.status(200).json(responses); // Return responses
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Responses Submitted by a User
exports.getUserResponses = async (req, res) => {
  const { user_id } = req.params;

  try {
    const responses = await Response.find({ user_id }).populate(
      "form_id",
      "title"
    );
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
