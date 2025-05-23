const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for anonymous responses
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  responses: [
    {
      field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormField",
        required: true,
      }, // Reference to the form field
      field_name: {
        type: String,
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      }, // Mixed type to support text, numbers, etc.
    },
  ],
});

module.exports = mongoose.model("Response", responseSchema);
