const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  companyId: { type: String, required: true },

  filters: [
    {
      field: { type: String, required: true }, 
      condition: { type: String, required: true }, 
      value: { type: mongoose.Schema.Types.Mixed, required: true }, 
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
