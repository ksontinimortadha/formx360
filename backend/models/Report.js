const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  companyId: { type: String, required: true },

  filters: [
    {
      field: { type: String, required: true }, // Field to filter (e.g., "status")
      condition: { type: String, required: true }, // Condition (e.g., "equals", "contains")
      value: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be a string, number, or date
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
