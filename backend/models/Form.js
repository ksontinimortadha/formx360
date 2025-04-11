const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    visibility: {
      type: String,
      enum: ["public", "private"], // visibility can be either "public" or "private"
      default: "private", // Default visibility is "private"
    }, // visibitly of the form
    publicUrl: { type: String, default: null },
    privateUrl: { type: String, default: null },
    theme: { type: String },
    fields: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            "text",
            "textarea",
            "number",
            "checkbox-group",
            "radio-group",
            "button",
            "select",
            "date",
            "file",
            "header",
            "paragraph",
            "autocomplete",
            "hidden",
            "starRating",
          ],
        },
        subtype: { type: String }, // e.g., "password" for text fields
        label: { type: String, required: true },
        name: { type: String, required: true },
        placeholder: { type: String },
        className: { type: String }, // CSS classes for styling
        style: { type: String }, // Inline styles
        required: { type: Boolean, default: false },
        options: [
          {
            label: { type: String, required: true }, // The displayed label
            value: { type: String, required: true }, // The actual stored value
            selected: { type: Boolean, default: false }, // Whether the option is preselected
          },
        ],
        description: { type: String }, // Help text for the field
        access: { type: [String], default: ["all"] }, // e.g., ["admin", "user"]
        values: { type: mongoose.Schema.Types.Mixed }, // Default value (can be any type)
        value: { type: mongoose.Schema.Types.Mixed }, // Default value (can be any type)
        multiple: { type: Boolean, default: false }, // Allows multiple selection
        inline: { type: Boolean, default: false }, // Inline options for radio/checkbox
        min_length: { type: Number },
        max_length: { type: Number },
        min: { type: mongoose.Schema.Types.Mixed },
        max: { type: mongoose.Schema.Types.Mixed },
        toggle: { type: Boolean }, // For fields like checkbox with "other"
        other: { type: Boolean }, // For checkbox options that allow other input
        maxlength: { type: Number },
        rows: { type: Number },
        step: { type: Number },
        style: { type: String }, // CSS for individual field styles
        tooltip: { type: String }, // Tooltip text for the field
        visibility_rules: { type: mongoose.Schema.Types.Mixed }, // Conditional visibility logic
        order: { type: Number, required: true }, // Position of the field
      },
    ],
    fieldStyles: {
      type: Map,
      of: {
        backgroundColor: { type: String, default: "#ffffff" },
        color: { type: String, default: "#000000" },
        position: {
          type: String,
          enum: ["left", "center", "right"],
          default: "left",
        },
      },
      default: {}, // Each field ID will map to a style object
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Form", formSchema);
