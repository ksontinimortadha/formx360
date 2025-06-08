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
    required: false,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  responses: [
    {
      field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FormField",
        required: true,
      },
      field_name: {
        type: String,
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Response", responseSchema);
